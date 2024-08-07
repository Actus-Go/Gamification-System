require('dotenv').config();


module.exports = {
    modelName: process.env.MODEL_NAME,
    clientId: process.env.CLIENT_ID || 'bcf8262e341ab565bef7a7515b86edc00fdee228b77a741265731cdbf467158a56607f1b5638dc1c01ccdd78005de733a4fb36be318381ee363ddfe670f3c3f3279fbe2df100',
    clientSecret: process.env.CLIENT_SECRET || '497271a2bff4982fd17d4b23eba76caa34712e85f3a409043bbe537d36fc2c4fad613b00d8d6e6415cfcf620fdee8a589ea7e0110b9bf3f020c53945f9f6a87bd2c460fe169b',
    baseURL: 'http://127.0.0.1:8080'
}