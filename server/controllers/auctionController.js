const Player = require('../models/Player');
const PlayerSet = require('../models/PlayerSet');
const Team = require('../models/Team');
const BidLog = require('../models/BidLog');

async function getCurrentBid(playerId) {
  const lastBid = await BidLog.findOne({ player: playerId })
    .sort({ createdAt: -1 })
    .lean();
  if (lastBid) return lastBid.bidAmount;
  const player = await Player.findById(playerId).lean();
  return player ? player.basePrice : null;
}

exports.getCurrentState = async (req, res) => {
  try {
    // 1. First, try to find a player who is currently LIVE
    let currentPlayer = await Player.findOne({
      auctionStatus: 'In Progress'
    })
      .populate('playerSet')
      .lean();

    // 2. If NO ONE is live, find the LAST person who was touched (Sold or Unsold)
    if (!currentPlayer) {
      currentPlayer = await Player.findOne({
        auctionStatus: { $in: ['Sold', 'Unsold'] }
      })
        .sort({ updatedAt: -1 }) // Sort by "Most Recently Updated"
        .populate('playerSet')
        .populate('soldToTeam')  // Important: Get the team name for the "Sold To" text
        .lean();
    }

    const teams = await Team.aggregate([
      {
        $lookup: {
          from: 'players',
          localField: '_id',
          foreignField: 'soldToTeam',
          as: 'players'
        }
      },
      {
        $addFields: {
          playerCount: { $size: '$players' }
        }
      },
      {
        $project: {
          players: 0
        }
      },
      { $sort: { name: 1 } }
    ]);

    if (!currentPlayer) {
      return res.json({
        currentPlayer: null,
        currentBid: null,
        currentSet: null,
        teams
      });
    }

    const currentBid = await getCurrentBid(currentPlayer._id);

    res.json({
      currentPlayer,
      currentBid,
      currentSet: currentPlayer.playerSet,
      teams
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch current auction state' });
  }
};

exports.startAuction = async (req, res) => {
  try {
    const { playerId } = req.body;
    if (!playerId) {
      return res.status(400).json({ message: 'playerId is required' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Reset any existing in-progress players
    await Player.updateMany(
      { auctionStatus: 'In Progress' },
      { auctionStatus: 'Not Started' }
    );

    player.auctionStatus = 'In Progress';
    await player.save();

    const currentBid = await getCurrentBid(player._id);

    res.json({ player, currentBid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to start auction' });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const { playerId, type, increment, customAmount, teamId } = req.body;
    if (!playerId || !type) {
      return res.status(400).json({ message: 'playerId and type are required' });
    }

    const player = await Player.findById(playerId).populate('playerSet');
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const base = (await getCurrentBid(playerId)) ?? player.basePrice;
    let nextBid;

    if (type === 'increment') {
      let inc = 50;
      if (base >= 1500) {
        inc = 100;
      }
      
      nextBid = base + inc;
    }else if (type === 'custom') {
      if (!customAmount || customAmount <= 0) {
        return res.status(400).json({ message: 'customAmount must be positive' });
      }
      nextBid = customAmount;
    } else {
      return res.status(400).json({ message: 'Invalid bid type' });
    }

    const bid = await BidLog.create({
      player: playerId,
      team: teamId || null,
      bidAmount: nextBid
    });

    res.status(201).json({ bid, currentBid: nextBid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place bid' });
  }
};

exports.sellPlayer = async (req, res) => {
  try {
    const { playerId, teamId } = req.body;
    if (!playerId || !teamId) {
      return res
        .status(400)
        .json({ message: 'playerId and teamId are required' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const latestBidDoc = await BidLog.findOne({ player: playerId })
      .sort({ createdAt: -1 })
      .lean();
    const finalPrice = latestBidDoc ? latestBidDoc.bidAmount : player.basePrice;

    if (team.remainingBudget < finalPrice) {
      return res
        .status(400)
        .json({ message: 'Team does not have enough budget' });
    }

    team.remainingBudget -= finalPrice;
    await team.save();

    player.auctionStatus = 'Sold';
    player.soldPrice = finalPrice;
    player.soldToTeam = team._id;
    await player.save();

    res.json({ player, team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to sell player' });
  }
};

exports.markUnsold = async (req, res) => {
  try {
    const { playerId } = req.body;
    if (!playerId) {
      return res.status(400).json({ message: 'playerId is required' });
    }

    let unsoldSet = await PlayerSet.findOne({ name: 'Unsold Players' });
    if (!unsoldSet) {
      unsoldSet = await PlayerSet.create({
        name: 'Unsold Players',
        defaultBasePrice: 0,
        biddingIncrement: 0
      });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.auctionStatus = 'Unsold';
    player.playerSet = unsoldSet._id;
    await player.save();

    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark player unsold' });
  }
};


