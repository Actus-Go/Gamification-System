const { Schema } = require('mongoose');
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
        collection: 'players_66e79ff75e293c8456370682'
   }
);

playerSchema.index({ points: -1 });

playerSchema.set('toJSON', {
    transform: (doc) => {
        return {
            id: doc._id.toString(),
            points: doc.points,
            numberOfRedeemPoints: doc.numberOfRedeemPoints,
        };
    }
});

const Player = mongoose.model('Player66e79ff75e293c8456370682', playerSchema);

module.exports = Player;