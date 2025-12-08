const Team = require('../models/Team');
const Player = require('../models/Player');

exports.getTeams = async (req, res) => {
  try {
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
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, startingBudget } = req.body;
    if (!name || startingBudget == null) {
      return res
        .status(400)
        .json({ message: 'name and startingBudget are required' });
    }
    const team = await Team.create({
      name,
      startingBudget,
      remainingBudget: startingBudget
    });
    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create team' });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { startingBudget, remainingBudget } = req.body;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (startingBudget != null) {
      team.startingBudget = startingBudget;
    }
    if (remainingBudget != null) {
      team.remainingBudget = remainingBudget;
    }
    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update team' });
  }
};


