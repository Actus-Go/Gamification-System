const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const trackerSchema = new Schema(
    {
        player: {
            type: Schema.Types.ObjectId,
            ref: 'Player66e79ff75e293c8456370682'
        },
        categoryId: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        isPaidFromTotalPoints: {
            type: Boolean,
            required: true,
        },
    },
    { 
        timestamps: true,
        collection: 'trackers_66e79ff75e293c8456370682',
    }
);
    
trackerSchema.index({ categoryId: 1 });
    
trackerSchema.set('toJSON', {
    transform: (doc) => {
        return {
            id: doc._id.toString(),
            playerId: doc.player.toString(),
            productId: doc.productId,
            categoryId: doc.categoryId,
            points: doc.points,
            isPaidFromTotalPoints: doc.isPaidFromTotalPoints,
        };
    }
});
    
const Tracker = mongoose.model('Tracker66e79ff75e293c8456370682', trackerSchema);
    
module.exports = Tracker;