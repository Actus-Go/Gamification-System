const playerModel = (clientId) => {
    return `
const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const playerSchema = new Schema(
    {
        points: {
            type: Number,
            default: 0
        },
        redeemedPoints: {
            type: Number,
            default: 0
       },
   },
   {
        timestamps: true,
        collection: 'players_${clientId}'
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

const Player = mongoose.model('Player${clientId}', playerSchema);

module.exports = Player;
    `;

    return model;
};

const trackerModel = (clientId) => {
    return `
const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const trackerSchema = new Schema(
    {
        player: {
            type: Schema.Types.ObjectId,
            ref: 'Player${clientId}'
        },
        categoryId: String,
        productId: String,
        points: Number,
    },
    { 
       timestamps: true,
       collection: 'trackers_${clientId}',
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

const Tracker = mongoose.model('Tracker${clientId}', trackerSchema);

module.exports = Tracker;
    `;
};

module.exports = { playerModel, trackerModel };