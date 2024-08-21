// use this script to retrieve jwt for testing

const { Gamification } = require('./src/index');

const main = async () => {
    const gamification = new Gamification();
    await gamification.getAccessToken()
}

main();
