const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

router.get('/current-state', auctionController.getCurrentState);
router.post('/start', auctionController.startAuction);
router.post('/bid', auctionController.placeBid);
router.post('/sell', auctionController.sellPlayer);
router.post('/unsold', auctionController.markUnsold);

module.exports = router;


