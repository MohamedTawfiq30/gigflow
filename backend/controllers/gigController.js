const Gig = require('../models/Gig');
const Bid = require('../models/Bid');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// @desc    Get all open gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
    const { search } = req.query;
    let query = { status: 'open' };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    try {
        const gigs = await Gig.find(query).populate('owner', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get my gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
const getMyGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public/Private
const getGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('owner', 'fullName email');

        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        let bids = [];

        // If user is owner, show all bids
        if (req.user && gig.owner._id.toString() === req.user.id) {
            bids = await Bid.find({ gig: gig._id }).populate('bidder', 'fullName email');
        } else if (req.user) {
            // If user is logged in but not owner, find their bid if any
            const myBid = await Bid.findOne({ gig: gig._id, bidder: req.user.id });
            if (myBid) bids = [myBid];
        }

        // Return gig and bids (bids might be empty if visitor or no bids)
        res.status(200).json({ gig, bids });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
        return res.status(400).json({ error: 'Please add all fields' });
    }

    try {
        const gig = await Gig.create({
            owner: req.user.id,
            title,
            description,
            budget,
        });
        res.status(201).json(gig);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private
const deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        if (gig.owner.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        await Gig.deleteOne({ _id: gig._id });
        await Bid.deleteMany({ gig: gig._id }); // Cascade delete bids

        res.status(200).json({ message: 'Gig removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private
const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        if (gig.owner.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const updatedGig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedGig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Hire a bidder
// @route   PATCH /api/gigs/:id/hire/:bidId
// @access  Private (Owner only)
const hireBidder = async (req, res) => {
    const { id: gigId, bidId } = req.params;
    const ownerId = req.user.id;

    try {
        // 1. Verify gig ownership and status
        const gig = await Gig.findOne({ _id: gigId, owner: ownerId, status: 'open' });
        if (!gig) {
            throw new Error('Gig not found, already assigned, or you are not the owner');
        }

        // 2. Verify bid exists and is pending
        const bid = await Bid.findOne({ _id: bidId, gig: gigId, status: 'pending' });
        if (!bid) {
            throw new Error('Bid not found or not pending');
        }

        // 3. Update gig status
        gig.status = 'assigned';
        gig.assignedTo = bid.bidder;
        await gig.save();

        // 4. Update selected bid to 'hired'
        bid.status = 'hired';
        await bid.save();

        // 5. Find other bids to reject
        const otherBids = await Bid.find({ gig: gigId, _id: { $ne: bidId } });

        // Update others to rejected
        await Bid.updateMany(
            { gig: gigId, _id: { $ne: bidId } },
            { status: 'rejected' }
        );

        // 6. Notifications & Socket
        const io = req.app.get('io');

        // --> Notify Hired Freelancer
        const hireMsg = `You've been hired for "${gig.title}"!`;
        await Notification.create({
            user: bid.bidder,
            type: 'hire',
            message: hireMsg,
            relatedId: gig._id
        });

        if (io) {
            io.to(bid.bidder.toString()).emit('notification', { message: hireMsg });
            io.to(bid.bidder.toString()).emit('hired', { gigId: gig._id, gigTitle: gig.title, message: hireMsg });
        }

        // --> Notify Rejected Freelancers
        for (const otherBid of otherBids) {
            const rejectMsg = `The gig "${gig.title}" has been assigned to someone else.`;
            await Notification.create({
                user: otherBid.bidder,
                type: 'rejection',
                message: rejectMsg,
                relatedId: gig._id
            });
            if (io) {
                io.to(otherBid.bidder.toString()).emit('notification', { message: rejectMsg });
            }
        }

        res.status(200).json({ gig, bid });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getGigs,
    getMyGigs,
    getGig,
    createGig,
    deleteGig,
    updateGig,
    hireBidder,
};
