const express = require('express');
const router = express.Router();
const setController = require('../controllers/setController');

router.get('/', setController.getSets);
router.post('/', setController.createSet);
router.get('/:id/players', setController.getPlayersInSet);

module.exports = router;


