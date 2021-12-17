// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract QuizContract {
    uint8 constant noOfQuestions = 1;
    uint8 constant noOfOptions = 2;

    event NewQuiz(
        string name,
        string description,
        uint256 startTime,
        uint256 endTime
    );

    struct Question {
        string question;
        string[noOfOptions] options;
    }

    struct Answers {
        uint8[noOfQuestions] selectedOptions;
        uint256 submissionTime;
        address submissionAddress;
    }

    struct Quiz {
        string quizName;
        string description;
        address quizOwner;
        uint256 prizeMoney; //wei
        uint256 startTime;
        uint256 endTime;
        Question[noOfQuestions] questions;
    }

    Quiz[] public quizzes;
    mapping(uint256 => mapping(address => Answers)) public submittedAnswers;

    function getPendingQuizzes()
        public
        view
        returns (Quiz[] memory pendingQuizzes)
    {
        uint256 present = block.timestamp;
        uint256 noOfQuizzes = 0;
        for (uint256 i = 0; i < quizzes.length; i++) {
            if (
                quizzes[i].startTime <= present && quizzes[i].endTime >= present
            ) {
                noOfQuizzes++;
            }
        }
        pendingQuizzes = new Quiz[](noOfQuizzes);
        uint256 j = 0;
        for (uint256 i = 0; i < quizzes.length; i++) {
            if (
                quizzes[i].startTime <= present && quizzes[i].endTime >= present
            ) {
                pendingQuizzes[j++] = quizzes[i];
            }
        }
        return pendingQuizzes;
    }

    function getQuizzesBy(address user)
        public
        view
        returns (Quiz[] memory quizzesByUser)
    {
        uint256 noOfQuizzes = 0;
        for (uint256 i = 0; i < quizzes.length; i++) {
            if (quizzes[i].quizOwner == user) {
                noOfQuizzes++;
            }
        }
        quizzesByUser = new Quiz[](noOfQuizzes);
        uint256 j = 0;
        for (uint256 i = 0; i < quizzes.length; i++) {
            if (quizzes[i].quizOwner == user) {
                quizzesByUser[j++] = quizzes[i];
            }
        }
        return quizzesByUser;
    }

    function createQuiz(Quiz calldata _quiz)
        external
        payable
        returns (uint256)
    {
        require(
            _quiz.startTime > block.timestamp,
            "Quiz cannot be created in the past"
        );
        require(
            _quiz.endTime > _quiz.startTime,
            "Quiz cannot be created with end time before start time"
        );
        require(bytes(_quiz.quizName).length != 0, "Quiz name cannot be empty");
        require(_quiz.prizeMoney > 0, "Prize money cannot be zero");
        require(
            _quiz.prizeMoney == msg.value,
            "Prize money must match the amount sent"
        );
        require(_quiz.quizOwner != address(0), "Quiz owner cannot be empty");

        for (uint256 i = 0; i < _quiz.questions.length; i++) {
            require(
                bytes(_quiz.questions[i].question).length != 0,
                "Question cannot be empty"
            );
            for (uint256 j = 0; j < _quiz.questions[i].options.length; j++) {
                require(
                    bytes(_quiz.questions[i].options[j]).length != 0,
                    "Option cannot be empty"
                );
            }
        }

        quizzes.push(_quiz);

        return quizzes.length - 1;
    }

    function submitAnswer(
        uint256 _quizId,
        uint8[noOfQuestions] calldata _answers
    ) external {
        require(
            quizzes[_quizId].startTime <= block.timestamp,
            "Quiz has not started yet"
        );
        require(quizzes[_quizId].endTime >= block.timestamp, "Quiz has ended");
        require(
            submittedAnswers[_quizId][msg.sender].submissionTime == 0,
            "You have already submitted the answers"
        );

        for (uint256 i = 0; i < _answers.length; i++) {
            require(
                _answers[i] < quizzes[_quizId].questions[i].options.length,
                "Answer is out of range"
            );
            require(_answers[i] != 0, "Answer cannot be empty");
        }

        submittedAnswers[_quizId][msg.sender] = Answers(
            _answers,
            block.timestamp,
            msg.sender
        );
    }

    function updateQuiz(
        uint256 _quizId,
        Question[noOfQuestions] calldata _questions,
        string calldata _description,
        address _quizOwner
    ) external {
        require(quizzes.length > _quizId, "Quiz Id does not exists");
        require(
            quizzes[_quizId].quizOwner == msg.sender,
            "Only Quiz Owner can update the quiz"
        );
        require(
            quizzes[_quizId].startTime > block.timestamp,
            "Quiz can be updated before start of the quiz"
        );

        require(_quizOwner != address(0), "Quiz owner cannot be empty");
        for (uint256 i = 0; i < _questions.length; i++) {
            require(
                bytes(_questions[i].question).length != 0,
                "Question cannot be empty"
            );
            for (uint256 j = 0; j < _questions[i].options.length; j++) {
                require(
                    bytes(_questions[i].options[j]).length != 0,
                    "Option cannot be empty"
                );
            }
        }

        Quiz storage _quiz = quizzes[_quizId];
        _quiz.description = _description;
        for(uint i=0;i<_questions.length; i++){
            _quiz.questions[i] = _questions[i];
        }
        _quiz.quizOwner = _quizOwner;
    }

    function submitCorrectAnswers(
        uint256 _quizId,
        uint8[noOfQuestions] calldata _quizAnswers
    ) external {
        require(_quizId < quizzes.length, "Quiz does not exist");
        require(
            block.timestamp > quizzes[_quizId].endTime,
            "Correct Answers cannot be submitted before end time"
        );
        require(
            quizzes[_quizId].quizOwner == msg.sender,
            "Only quiz owner can submit correct answers"
        );


        //TODO: Check for marks and distribute the prize money for top 25% in time
    }
}
