const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const clientSchema = new Schema({
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

clientSchema.set('toJSON', {
    transform: (doc) => {
        return {
            id: doc._id,
            name: doc.name,
            clientId: doc.clientId,
            clientSecret: doc.clientSecret,
            redirectUris: doc.redirectUris,
            grants: doc.grants,
            userAccountId: doc.userAccountId,
        };
    }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;