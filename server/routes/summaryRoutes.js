const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

router.get('/by-set/:setId', summaryController.bySet);
router.get('/by-team/:teamId', summaryController.byTeam);
router.get('/global', summaryController.global);

module.exports = router;


