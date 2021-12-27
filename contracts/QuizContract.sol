// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

contract QuizContract {
    uint8 constant noOfQuestions = 1;
    uint8 constant noOfOptions = 4;

    event QuizCreated(uint256 quizId, Quiz quiz);

    event QuizUpdated(uint256 quizId, Quiz quiz);

    event QuizStarted(uint256 quizId, Question[noOfQuestions] questions);

    event QuizEnded(
        uint256 quizId,
        Quiz quiz,
        address[] winners,
        uint8[noOfQuestions][noOfOptions] answers
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
        uint256 duration; //minutes
        bytes32 questionHash;
        bytes32 answerHash;
    }

    address owner;
    Quiz[] public quizzes;
    mapping(uint256 => Answers[]) public submittedAnswers;
    mapping(uint256 => mapping(address => bool)) public isSubmited;

    constructor() {
        owner = msg.sender;
    }

    function hashQuestions(Question[noOfQuestions] calldata questions)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(questions));
    }

    function hashAnswers(uint8[noOfQuestions] calldata answers, string calldata _hashSalt)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(answers, _hashSalt));
    }

    function getPendingQuizzes()
        public
        view
        returns (Quiz[] memory pendingQuizzes)
    {
        uint256 present = block.timestamp;
        uint256 noOfQuizzes = 0;
        for (uint256 i = 0; i < quizzes.length; i++) {
            if (
                quizzes[i].startTime <= present &&
                (quizzes[i].startTime + quizzes[i].duration) >= present
            ) {
                noOfQuizzes++;
            }
        }
        pendingQuizzes = new Quiz[](noOfQuizzes);
        uint256 j = 0;
        for (uint256 i = 0; i < quizzes.length; i++) {
            if (
                quizzes[i].startTime <= present &&
                (quizzes[i].startTime + quizzes[i].duration) >= present
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
            _quiz.startTime + _quiz.duration > _quiz.startTime,
            "Quiz cannot be created with end time before start time"
        );
        require(bytes(_quiz.quizName).length != 0, "Quiz name cannot be empty");
        require(_quiz.prizeMoney > 0, "Prize money cannot be zero");
        require(
            _quiz.prizeMoney == msg.value,
            "Prize money must match the amount sent"
        );
        require(_quiz.quizOwner != address(0), "Quiz owner cannot be empty");

        quizzes.push(_quiz);
        emit QuizCreated(quizzes.length - 1, _quiz);

        return quizzes.length - 1;
    }

    function updateQuiz(
        uint256 _quizId,
        string calldata _description,
        address _quizOwner,
        bytes32 _questionHash,
        bytes32 _answerHash
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

        Quiz storage _quiz = quizzes[_quizId];
        _quiz.description = _description;
        _quiz.quizOwner = _quizOwner;
        _quiz.questionHash = _questionHash;
        _quiz.answerHash = _answerHash;
    }

    function submitQuestions(
        uint256 _quizId,
        Question[noOfQuestions] calldata _questions
    ) external {
        require(
            msg.sender == owner || msg.sender == quizzes[_quizId].quizOwner,
            "Only owner or the quiz creator can submit questions"
        );
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
        require(
            hashQuestions(_questions) == quizzes[_quizId].questionHash,
            "Questions are not valid"
        );

        quizzes[_quizId].startTime = block.timestamp;
        emit QuizStarted(_quizId, _questions);
    }

    function submitPlayerAnswer(
        uint256 _quizId,
        uint8[noOfQuestions] calldata _answers
    ) external {
        require(
            quizzes[_quizId].startTime <= block.timestamp,
            "Quiz has not started yet"
        );
        require(
            quizzes[_quizId].startTime + quizzes[_quizId].duration >=
                block.timestamp,
            "Quiz has ended"
        );
        require(
            isSubmited[_quizId][msg.sender] == false,
            "You have already submitted the answers"
        );

        for (uint256 i = 0; i < _answers.length; i++) {
            require(_answers[i] < noOfOptions, "Answer is out of range");
            require(_answers[i] != 0, "Answer cannot be empty");
        }

        isSubmited[_quizId][msg.sender] = true;
        submittedAnswers[_quizId].push(
            Answers(_answers, block.timestamp, msg.sender)
        );
    }

    function submitCorrectAnswers(
        uint256 _quizId,
        uint8[noOfQuestions] calldata _quizAnswers,
        string calldata _hashSalt
    ) external {
        require(_quizId < quizzes.length, "Quiz does not exist");
        require(
            block.timestamp >
                quizzes[_quizId].startTime + quizzes[_quizId].duration,
            "Correct Answers cannot be submitted before end time"
        );
        require(
            quizzes[_quizId].quizOwner == msg.sender,
            "Only quiz owner can submit correct answers"
        );

        require(
            hashAnswers(_quizAnswers, _hashSalt) == quizzes[_quizId].answerHash,
            "Correct answers are not valid"
        );  
        //TODO: Check for marks and distribute the prize money ( for toppers only ) minus gas fees
    }
}
