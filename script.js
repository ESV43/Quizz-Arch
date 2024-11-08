// Fetch Questions from Open Trivia Database API
const API_URL = 'https://opentdb.com/api.php?amount=15&type=multiple&encode=url3986';

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let lifelineUsed = false;

const startButton = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const timerElement = document.getElementById('time');
const hintButton = document.getElementById('hint-btn');
const hintElement = document.getElementById('hint');

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', () => {
    window.location.reload();
});
hintButton.addEventListener('click', useHint);

async function startQuiz() {
    startButton.classList.add('hide');
    await fetchQuestions();
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.classList.remove('hide');
    setNextQuestion();
}

async function fetchQuestions() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        questions = data.results.map((questionData) => {
            const decodedQuestion = decodeURIComponent(questionData.question);
            const decodedCorrectAnswer = decodeURIComponent(questionData.correct_answer);
            const decodedIncorrectAnswers = questionData.incorrect_answers.map((answer) => decodeURIComponent(answer));

            const options = [...decodedIncorrectAnswers];
            options.splice(Math.floor(Math.random() * (decodedIncorrectAnswers.length + 1)), 0, decodedCorrectAnswer);

            return {
                question: decodedQuestion,
                options: options,
                answer: options.indexOf(decodedCorrectAnswer),
                hint: getHint(decodedCorrectAnswer, questionData.category),
                difficulty: mapDifficulty(questionData.difficulty)
            };
        });
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        alert('Failed to load questions. Please try again later.');
    }
}

function getHint(correctAnswer, category) {
    // Simple hint generation based on the category
    return `Think about ${category} related topics.`;
}

function mapDifficulty(apiDifficulty) {
    switch (apiDifficulty) {
        case 'easy':
            return 1;
        case 'medium':
            return 2;
        case 'hard':
            return 3;
        default:
            return 1;
    }
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        startTimer();
    } else {
        endQuiz();
    }
}

function showQuestion(questionObj) {
    questionElement.innerText = questionObj.question;
    questionObj.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    clearTimeout(timer);
    timeLeft = 30;
    timerElement.innerText = timeLeft;
    lifelineUsed = false;
    hintButton.disabled = false;
    hintElement.classList.add('hide');
    nextButton.classList.add('hide');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = questions[currentQuestionIndex].answer;
    Array.from(optionsContainer.children).forEach((button, index) => {
        if (index === correct) {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }
        button.disabled = true;
    });

    if (Array.from(optionsContainer.children).indexOf(selectedButton) === correct) {
        calculateScore();
    }

    clearTimeout(timer);
    nextButton.classList.remove('hide');
}

function calculateScore() {
    const difficulty = questions[currentQuestionIndex].difficulty;
    const points = timeLeft * difficulty * (lifelineUsed ? 0.5 : 1);
    score += points;
}

function endQuiz() {
    quizContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    scoreElement.innerText = Math.round(score);
}

function startTimer() {
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            Array.from(optionsContainer.children).forEach((button) => {
                button.disabled = true;
            });
            nextButton.classList.remove('hide');
        }
    }, 1000);
}

function useHint() {
    if (!lifelineUsed) {
        hintElement.innerText = questions[currentQuestionIndex].hint;
        hintElement.classList.remove('hide');
        lifelineUsed = true;
        hintButton.disabled = true;
    }
}
