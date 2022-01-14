// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

contract QuizContract {
    uint8 constant noOfQuestions = 1;
    uint8 constant noOfOptions = 4;

    event QuizCreated(uint256 quizId, Quiz quiz);

    event QuizUpdated(uint256 quizId, Quiz quiz);

    event QuizStarted(
        uint256 quizId,
        string[noOfQuestions] questions,
        string[noOfOptions][noOfQuestions] options
    );

    event QuizCompleted(
        uint256 quizId,
        Quiz quiz,
        address[] winners,
        uint8[noOfQuestions] answers
    );

    struct Answers {
        uint8[noOfQuestions] selectedOptions;
        uint256 submissionTime;
        address submissionAddress;
    }

    struct Quiz {
        uint256 quizId;
        string quizName;
        string description;
        address quizOwner;
        uint256 prizeMoney; //wei
        uint256 startTime;
        uint256 duration; //seconds
        bytes32 questionHash;
        bytes32 answerHash;
        bool isRunning;
    }

    address owner;
    Quiz[] public quizzes;
    mapping(uint256 => Answers[]) public submittedAnswers;
    mapping(uint256 => mapping(address => bool)) public isSubmited;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwners(uint256 _quizId) {
        require(
            msg.sender == owner || msg.sender == quizzes[_quizId].quizOwner,
            "Only owner or the quiz creator can submit questions"
        );
        _;
    }

    modifier refundGas(uint256 _quizId) {
        uint256 gasAtStart = gasleft();
        _;
        if (msg.sender != owner) return;
        uint256 gasSpent = gasAtStart - gasleft() + 30000;
        uint256 gasCost = gasSpent * tx.gasprice;
        payable(msg.sender).transfer(gasCost);
        quizzes[_quizId].prizeMoney -= gasCost;
    }

    function hashQuestions(
        string[noOfQuestions] calldata _questions,
        string[noOfOptions][noOfQuestions] calldata _options,
        bytes32 _hashSalt
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(_questions, _options, _hashSalt));
    }

    function hashAnswers(
        uint8[noOfQuestions] calldata _answers,
        bytes32 _hashSalt
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(_answers, _hashSalt));
    }

    function equalAnswers(
        uint8[noOfQuestions] storage correctOptions,
        uint8[noOfQuestions] calldata optionsB
    ) internal pure returns (bool) {
        return
            keccak256(abi.encode(correctOptions)) ==
            keccak256(abi.encode(optionsB));
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
        external
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

    function createQuiz(
        string calldata quizName,
        string calldata description,
        uint256 prizeMoney, //wei
        uint256 startTime,
        uint256 duration, //seconds
        bytes32 questionHash,
        bytes32 answerHash
    ) external payable returns (uint256) {
        require(
            startTime > block.timestamp,
            "Quiz cannot be created in the past"
        );
        require(duration > 0, "Duration of quiz cannot be zero");
        require(bytes(quizName).length != 0, "Quiz name cannot be empty");
        require(prizeMoney > 0, "Prize money cannot be zero");
        require(
            prizeMoney == msg.value,
            "Prize money must match the amount sent"
        );

        Quiz memory _newQuiz = Quiz(
            quizzes.length,
            quizName,
            description,
            msg.sender,
            prizeMoney,
            startTime,
            duration,
            questionHash,
            answerHash,
            false
        );
        quizzes.push(_newQuiz);
        emit QuizCreated(quizzes.length - 1, _newQuiz);

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
        string[noOfQuestions] calldata _questions,
        string[noOfOptions][noOfQuestions] calldata _options,
        bytes32 _hashSalt
    ) external onlyOwners(_quizId) {
        require(
            quizzes[_quizId].isRunning == false,
            "Quiz has already started"
        );
        for (uint256 i = 0; i < _questions.length; i++) {
            require(
                bytes(_questions[i]).length != 0,
                "Question cannot be empty"
            );
            for (uint256 j = 0; j < _options[i].length; j++) {
                require(
                    bytes(_options[i][j]).length != 0,
                    "Option cannot be empty"
                );
            }
        }
        require(
            hashQuestions(_questions, _options, _hashSalt) ==
                quizzes[_quizId].questionHash,
            "Questions are not valid"
        );

        quizzes[_quizId].startTime = block.timestamp;
        quizzes[_quizId].isRunning = true;
        emit QuizStarted(_quizId, _questions, _options);
    }

    function submitCorrectAnswers(
        uint256 _quizId,
        uint8[noOfQuestions] calldata _quizAnswers,
        bytes32 _hashSalt
    ) external onlyOwners(_quizId) {
        require(_quizId < quizzes.length, "Quiz does not exist");
        require(quizzes[_quizId].isRunning == true, "Quiz has not started");
        require(
            block.timestamp >
                quizzes[_quizId].startTime + quizzes[_quizId].duration,
            "Correct Answers cannot be submitted before end time"
        );
        require(
            hashAnswers(_quizAnswers, _hashSalt) == quizzes[_quizId].answerHash,
            "Correct answers are not valid"
        );

        uint256 totalWinners = 0;
        for (uint256 i = 0; i < submittedAnswers[_quizId].length; i++) {
            if (
                equalAnswers(
                    submittedAnswers[_quizId][i].selectedOptions,
                    _quizAnswers
                )
            ) {
                totalWinners++;
            }
        }

        address[] memory winners = new address[](totalWinners);
        if (totalWinners == 0) {
            payable(quizzes[_quizId].quizOwner).transfer(
                quizzes[_quizId].prizeMoney
            );
            emit QuizCompleted(
                _quizId,
                quizzes[_quizId],
                winners,
                _quizAnswers
            );
            return;
        }
        uint256 prizeMoneyPerWinner = quizzes[_quizId].prizeMoney /
            totalWinners;
        uint256 prizeMoneyLeft = quizzes[_quizId].prizeMoney -
            prizeMoneyPerWinner *
            totalWinners;
        uint256 j = 0;
        for (uint256 i = 0; i < submittedAnswers[_quizId].length; i++) {
            if (
                equalAnswers(
                    submittedAnswers[_quizId][i].selectedOptions,
                    _quizAnswers
                )
            ) {
                winners[j++] = submittedAnswers[_quizId][i].submissionAddress;
                payable(submittedAnswers[_quizId][i].submissionAddress)
                    .transfer(prizeMoneyPerWinner);
            }
        }
        payable(quizzes[_quizId].quizOwner).transfer(prizeMoneyLeft);

        emit QuizCompleted(_quizId, quizzes[_quizId], winners, _quizAnswers);
    }

    function submitPlayerAnswer(
        uint256 _quizId,
        uint8[noOfQuestions] calldata _answers
    ) external {
        require(quizzes[_quizId].isRunning == true, "Quiz has not started yet");
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
}
