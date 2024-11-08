let currentRound = 1;
let currentQuestionIndex = 0;
let score = 0;
let timerCount = 30;

const roundsDisplay = document.getElementById("rounds");
const questionSection = document.getElementById("question-section");
const feedbackSection = document.getElementById("feedback");
const timerElement = document.getElementById("timerCount");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-answer");
const resultElement = document.getElementById("result");
const correctAnswerElement = document.getElementById("correct-answer");

const apiUrl = 'https://triviaapi.example.com/questions'; // Replace with the actual API endpoint

function fetchQuestions(round) {
    fetch(`${apiUrl}?round=${round}&category=science`) // Adjust the category as needed
      .then(response => response.json())
      .then(data => {
        displayQuestions(data.results);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        // Handle error, maybe display an error message to the user.
      });
}

function displayQuestions(questions) {
    if (questions.length > 0) {
        questionElement.textContent = questions[currentQuestionIndex].question;
        questions[currentQuestionIndex].options.forEach(option => {
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

function startTimer() {
    // ... (same as before)
}

function checkAnswer(selectedOption) {
    // ... (same as before)
}

function endRound() {
    // ... (same as before)
    currentQuestionIndex = 0;
    fetchQuestions(currentRound); // Fetch questions for the next round
}

function displayRound() {
    roundsDisplay.innerHTML = `Round ${currentRound}`;
    fetchQuestions(currentRound); // Fetch questions for the current round
}

function displayFinalScore() {
    // ... (same as before)
}

function init() {
    displayRound();
}

init();
