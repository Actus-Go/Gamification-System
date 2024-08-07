const crypto = require('crypto');


const generateCode = () => {
    return crypto.randomBytes(70).toString('hex');
};

module.exports = generateCode;