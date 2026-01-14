const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    gig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        minLength: 10
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'hired', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Compound unique index on (gig, bidder) - one bid per user per gig
bidSchema.index({ gig: 1, bidder: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
