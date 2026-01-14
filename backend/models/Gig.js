const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        minLength: 5
    },
    description: {
        type: String,
        required: true,
        minLength: 20
    },
    budget: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['open', 'assigned', 'completed'],
        default: 'open'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gig', gigSchema);
