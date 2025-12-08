const Player = require('../models/Player');

exports.getPlayers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.setId) {
      filter.playerSet = req.query.setId;
    }
    if (req.query.status) {
      filter.auctionStatus = req.query.status;
    }
    const players = await Player.find(filter)
      .populate('playerSet')
      .populate('soldToTeam')
      .sort({ createdAt: 1 });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch players' });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create player' });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update player' });
  }
};


