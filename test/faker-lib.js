const faker = require('faker');
module.exports = { 
    quiz_name : faker.name.firstName(),
    description : faker.commerce.productDescription(),
    prizeMoney : parseInt(faker.commerce.price()),
    starttime : parseInt(faker.date.future().getTime()/1000),
    time: parseInt(faker.date.past().getTime()/1000),
    duration : 100,
    questionHash : faker.git.commitSha(),
    answerHash : faker.git.commitSha(),
    currentTime : Date.now()
};