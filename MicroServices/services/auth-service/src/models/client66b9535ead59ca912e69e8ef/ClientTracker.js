const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const playerTrackerSchema = new Schema({
    Player: {
        type: Schema.Types.ObjectId,
        ref: "Client66b9535ead59ca912e69e8ef"
    },
    numberOfPoints: {
        type: Number,
    },
    category: String,
    productId: String

}, { timestamps: true });

trackerSchema.index(category);
const PlayerTracker = mongoose.model('PlayerTracker', playerTrackerSchema);
module.exports = PlayerTracker;