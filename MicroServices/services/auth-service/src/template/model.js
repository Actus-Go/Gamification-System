const playerModel = (clientObjectId) => {
    return `const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const playerSchema = new Schema(
    {
        points: {
            type: Number,
            default: 0
        },
        numberOfRedeemPoints: {
            type: Number,
            default: 0
       },
   },
   {
        timestamps: true,
        collection: 'players_${clientObjectId}'
   }
);

playerSchema.index({ points: -1 });

playerSchema.set('toJSON', {
    transform: (doc) => {
        return {
            id: doc._id.toString(),
            points: doc.points,
            redeemedPoints: doc.redeemedPoints,
        };
    }
});

const Player = mongoose.model('Player${clientObjectId}', playerSchema);

module.exports = Player;`;
};

const trackerModel = (clientObjectId) => {
    return `const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const trackerSchema = new Schema(
    {
        player: {
            type: Schema.Types.ObjectId,
            ref: 'Player${clientObjectId}'
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
        collection: 'trackers_${clientObjectId}',
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
        };
    }
});
    
const Tracker = mongoose.model('Tracker${clientObjectId}', trackerSchema);
    
module.exports = Tracker;`;
};

module.exports = { playerModel, trackerModel };
