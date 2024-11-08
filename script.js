const questions = [
    {
        round: 1,
        question: "What is the capital of France?",
        options: ["Paris", "Berlin", "Madrid", "Rome"],
        correctAnswer: "Paris"
    },
    // Add more questions here for each round
    // ...
];

let currentRound = 1;
let currentQuestionIndex = 0;
let score = 0;
let timerCount = 30;  // Initial timer value in seconds

const roundsDisplay = document.getElementById("rounds");
const questionSection = document.getElementById("question-section");
const feedbackSection = document.getElementById("feedback");
const timerElement = document.getElementById("timerCount");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-answer");
const resultElement = document.getElementById("result");
const correctAnswerElement = document.getElementById("correct-answer");

function startTimer() {
    timerCount--;
    timerElement.textContent = timerCount;
    if (timerCount >= 0) {
        setTimeout(startTimer, 1000);
    } else {
        endRound();
    }
}

function displayQuestion() {
    const currentQuestion = questions.find(q => q.round === currentRound && !q.displayed);
    if (currentQuestion) {
        currentQuestion.displayed = true;
        questionElement.textContent = currentQuestion.question;
        currentQuestion.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.addEventListener("click", () => checkAnswer(option));
            optionsElement.appendChild(button);
        });
        submitButton.style.display = "block";
        startTimer();
    } else {
        endRound();
    }
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions.find(q => q.round === currentRound && !q.answered);
    if (currentQuestion) {
        currentQuestion.answered = true;
        if (selectedOption === currentQuestion.correctAnswer) {
            resultElement.textContent = "Correct!";
            score += 10;
        } else {
            resultElement.textContent = "Wrong!";
            correctAnswerElement.textContent = `Correct Answer: ${currentQuestion.correctAnswer}`;
        }
        feedbackSection.style.display = "block";
        submitButton.style.display = "none";
        optionsElement.innerHTML = "";
    }
}

function endRound() {
    feedbackSection.style.display = "none";
    timerElement.textContent = "0";
    if (currentRound < 3) {
        currentRound++;
        currentQuestionIndex = 0;
        displayRound();
    } else {
        displayFinalScore();
    }
}

function displayRound() {
    roundsDisplay.innerHTML = `Round ${currentRound}`;
    displayQuestion();
}

function displayFinalScore() {
    questionSection.style.display = "none";
    feedbackSection.style.display = "block";
    resultElement.textContent = `Quiz completed! Your score: ${score}`;
    correctAnswerElement.textContent = "";
}

function init() {
    displayRound();
}

init();
