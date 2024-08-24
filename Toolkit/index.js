const {Gamification} = require('./src/index');

const main = async() =>{
    const g = new Gamification();
    await g.getAccessToken();
};

main()