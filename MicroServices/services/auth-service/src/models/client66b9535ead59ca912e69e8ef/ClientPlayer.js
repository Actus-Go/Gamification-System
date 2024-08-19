const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const playerFrom66b9535ead59ca912e69e8efSchema = new Schema({
    playerId: {
        type: String,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    },
    // How many times you get points from redeeming products
    numberOfRedeemPoints: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
playerFrom66b9535ead59ca912e69e8efSchema.index({points: -1});
const PlayerFrom66b9535ead59ca912e69e8ef = mongoose.model('PlayerFrom66b9535ead59ca912e69e8ef', playerFrom66b9535ead59ca912e69e8efSchema);
module.exports = PlayerFrom66b9535ead59ca912e69e8ef;
