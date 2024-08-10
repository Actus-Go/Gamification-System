const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ClientSchema = new Schema({
    name: String,
    clientSecret: String,
    clientId: {
        type: String,
        unique: true
    },
    userAccountId: {
        type: Schema.Types.ObjectId,
        ref: 'UserAccount'
    },
    redirectUris: [String],
    grants: [String]
}, { timestamps: true});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;