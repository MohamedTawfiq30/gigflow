const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const Notification = require('../models/Notification');

// @desc    Get my bids
// @route   GET /api/bids/my-bids
// @access  Private
const getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({ bidder: req.user.id }).populate('gig');
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Submit a bid
// @route   POST /api/bids/:gigId
// @access  Private
const createBid = async (req, res) => {
    const { gigId } = req.params;
    const { message, price } = req.body;

    if (!message || !price) {
        return res.status(400).json({ error: 'Please add message and price' });
    }

    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        // Cannot bid on own gig
        if (gig.owner.toString() === req.user.id) {
            return res.status(400).json({ error: 'Cannot bid on your own gig' });
        }

        // Check if gig is open
        if (gig.status !== 'open') {
            return res.status(400).json({ error: 'Gig is not open for bidding' });
        }

        // Check if already bid
        const existingBid = await Bid.findOne({ gig: gigId, bidder: req.user.id });
        if (existingBid) {
            return res.status(400).json({ error: 'You have already placed a bid on this gig' });
        }

        const bid = await Bid.create({
            gig: gigId,
            bidder: req.user.id,
            message,
            price,
        });

        // Notify Gig Owner
        const io = req.app.get('io');
        const noteMsg = `New proposal for "${gig.title}"`;

        await Notification.create({
            user: gig.owner,
            type: 'proposal',
            message: noteMsg,
            relatedId: gig._id
        });

        if (io) {
            io.to(gig.owner.toString()).emit('notification', { message: noteMsg });
        }

        res.status(201).json(bid);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete bid
// @route   DELETE /api/bids/:id
// @access  Private
const deleteBid = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);

        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        if (bid.bidder.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        await Bid.deleteOne({ _id: bid._id });
        res.status(200).json({ message: 'Bid removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMyBids,
    createBid,
    deleteBid
};
