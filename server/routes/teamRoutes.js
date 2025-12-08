const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getTeams);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);

module.exports = router;


