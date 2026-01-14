const express = require('express');
const router = express.Router();
const { getGigs, getMyGigs, getGig, createGig, deleteGig, updateGig, hireBidder } = require('../controllers/gigController');
const { protect, checkUser } = require('../middleware/auth');

router.get('/', getGigs);
router.get('/my-gigs', protect, getMyGigs);
router.get('/:id', checkUser, getGig);
router.post('/', protect, createGig);
router.delete('/:id', protect, deleteGig);
router.put('/:id', protect, updateGig);
router.patch('/:id/hire/:bidId', protect, hireBidder);

module.exports = router;
