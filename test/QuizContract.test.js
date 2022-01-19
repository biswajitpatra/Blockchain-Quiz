const QuizContract = artifacts.require("QuizContract");
const fake_data = require('./faker-lib')
const { expectRevert } = require('@openzeppelin/test-helpers');
const {expect} = require('chai')
contract("QuizContract", (accounts) => {
    let instance;
    beforeEach("should create instanc before every test", async () => {
        this.instance = await QuizContract.deployed();
    })
    describe("Should not create quiz", () => {
        
        it("should not create when start time is in past", async () => {
            
            
        await expectRevert(this.instance.createQuiz(fake_data.quiz_name, fake_data.description, 
            fake_data.prizeMoney, fake_data.time, fake_data.duration, 
            web3.utils.soliditySha3(fake_data.questionHash), web3.utils.soliditySha3(fake_data.answerHash), { from: accounts[0], value: fake_data.prizeMoney }),"Quiz cannot be created in the past");
            
            

        });

        it("should not create when prize money is zero", async () => {
               
            
            await expectRevert(this.instance.createQuiz(fake_data.quiz_name, 
                fake_data.description, 0, fake_data.starttime, 
                fake_data.duration, web3.utils.soliditySha3(fake_data.questionHash), 
                web3.utils.soliditySha3(fake_data.answerHash), 
                { from: accounts[0], value: fake_data.prizeMoney }),'Prize money cannot be zero');
            });


        it("should not create when duration is zero minute", async () => {
            
             
            await expectRevert(this.instance.createQuiz(fake_data.quiz_name, 
                fake_data.description, fake_data.prizeMoney, fake_data.starttime, 
                0, web3.utils.soliditySha3(fake_data.questionHash), 
                web3.utils.soliditySha3(fake_data.answerHash), 
                { from: accounts[0], value: fake_data.prizeMoney }),'Duration of quiz cannot be zero');
        });

    

        it("should not create when quiz name is empty", async () => {
             
            await expectRevert(this.instance.createQuiz("", 
                fake_data.description, fake_data.prizeMoney, fake_data.starttime, 
                fake_data.duration, web3.utils.soliditySha3(fake_data.questionHash), 
                web3.utils.soliditySha3(fake_data.answerHash), 
                { from: accounts[0], value: fake_data.prizeMoney }),'Quiz name cannot be empty');

        });

        it("should not create when prize money not equal to money sent", async () => {
             
            await expectRevert(this.instance.createQuiz(fake_data.quiz_name, 
                fake_data.description, 222, fake_data.starttime, 
                fake_data.duration, web3.utils.soliditySha3(fake_data.questionHash), 
                web3.utils.soliditySha3(fake_data.answerHash), 
                { from: accounts[0], value: fake_data.prizeMoney }),'Prize money must match the amount sent');

        });

        
    })

    describe("Should create quiz",()=>{
      
        it("Quiz should be created", async()=>{
            tx = await this.instance.createQuiz(fake_data.quiz_name, fake_data.description, 
                fake_data.prizeMoney, fake_data.starttime, fake_data.duration, 
                web3.utils.soliditySha3(fake_data.questionHash), 
                web3.utils.soliditySha3(fake_data.answerHash), 
                { from: accounts[0], value: fake_data.prizeMoney });
                
            expect(tx.logs[0].args.quiz.quizId).to.equal('0');
        })

    })
})

