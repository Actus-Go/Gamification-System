const clientModel = (client_id) => {
    const model = `const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const playerFrom${client_id}Schema = new Schema({
    playerId: {
        type: String,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    },
    // How many times you get points from redeeming products
    numberOfRedemPoints: {
        type: Number,
        default: 0
    },

}, { timestamps: true });
playerFrom${client_id}Schema.index({points: -1});
const PlayerFrom${client_id} = mongoose.model('PlayerFrom${client_id}', playerFrom${client_id}Schema);
module.exports = PlayerFrom${client_id};
`;
    return model;
};

const trackerModel = (client_id) => {
    const model = `const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const playerTrackerSchema = new Schema({
    Player: {
        type: Schema.Types.ObjectId,
        ref: "Client${client_id}"
    },
    numberOfPoints: {
        type: Number,
    },
    categoryId: String,
    productId: String,
    isPaidFromTotalPoints: Boolean

}, { timestamps: true });

trackerSchema.index(category);
const PlayerTracker = mongoose.model('PlayerTracker', playerTrackerSchema);
module.exports = PlayerTracker;
`;
    return model;
};





module.exports = { clientModel, trackerModel };