const Player = require('../models/Player');
const Team = require('../models/Team');

exports.bySet = async (req, res) => {
  try {
    const { setId } = req.params;
    const players = await Player.find({ playerSet: setId })
      .populate('soldToTeam', 'name')
      .populate('playerSet', 'name')
      .sort({ createdAt: 1 });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch summary by set' });
  }
};

exports.byTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const players = await Player.find({ soldToTeam: teamId })
      .populate('playerSet', 'name')
      .sort({ createdAt: 1 });

    const totalSpent = players.reduce(
      (sum, p) => sum + (p.soldPrice || 0),
      0
    );

    res.json({
      team,
      players,
      totals: {
        totalSpent,
        remainingBudget: team.remainingBudget,
        playerCount: players.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch summary by team' });
  }
};

exports.global = async (req, res) => {
  try {
    const players = await Player.find();
    const totalPlayers = players.length;
    const totalSold = players.filter((p) => p.auctionStatus === 'Sold').length;
    const totalUnsold = players.filter((p) => p.auctionStatus === 'Unsold').length;
    const totalMoneySpent = players.reduce(
      (sum, p) => sum + (p.soldPrice || 0),
      0
    );
    res.json({
      totalPlayers,
      totalSold,
      totalUnsold,
      totalMoneySpent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch global summary' });
  }
};


