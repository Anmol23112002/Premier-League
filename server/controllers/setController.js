const PlayerSet = require('../models/PlayerSet');
const Player = require('../models/Player');

exports.getSets = async (req, res) => {
  try {
    const sets = await PlayerSet.find().sort({ createdAt: 1 });
    res.json(sets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch sets' });
  }
};

exports.createSet = async (req, res) => {
  try {
    const { name, defaultBasePrice, biddingIncrement } = req.body;
    if (!name || biddingIncrement == null) {
      return res
        .status(400)
        .json({ message: 'name and biddingIncrement are required' });
    }
    const set = await PlayerSet.create({
      name,
      defaultBasePrice,
      biddingIncrement
    });
    res.status(201).json(set);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create set' });
  }
};

exports.getPlayersInSet = async (req, res) => {
  try {
    const { id } = req.params;
    const players = await Player.find({ playerSet: id }).sort({ createdAt: 1 });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch players for set' });
  }
};


