const express = require('express');
const router = express.Router();
const { getMyBids, createBid, deleteBid } = require('../controllers/bidController');
const { protect } = require('../middleware/auth');

router.get('/my-bids', protect, getMyBids);
router.post('/:gigId', protect, createBid);
router.delete('/:id', protect, deleteBid);

module.exports = router;
