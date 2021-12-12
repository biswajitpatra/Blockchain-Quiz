var QuizContract = artifacts.require("QuizContract");

module.exports = function(deployer) {
  deployer.deploy(QuizContract);
};