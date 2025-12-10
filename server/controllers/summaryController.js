const Player = require('../models/Player');
const Team = require('../models/Team');

// 1. SUMMARY BY SET
exports.bySet = async (req, res) => {
  try {
    const { setId } = req.params;
    const players = await Player.find({ playerSet: setId })
      .populate('soldToTeam', 'name logoUrl') // <--- UPDATED: Gets Name AND Logo
      .populate('playerSet', 'name')
      .sort({ createdAt: 1 });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch summary by set' });
  }
};

// 2. SUMMARY BY TEAM (This was the broken one)
exports.byTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Get the Team details
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get Players sold to this team
    const players = await Player.find({ soldToTeam: teamId })
      .populate('playerSet', 'name')
      .populate('soldToTeam', 'name logoUrl') // <--- ADDED THIS LINE!
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

// 3. GLOBAL SUMMARY
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