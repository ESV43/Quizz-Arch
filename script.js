
const apiUrl = 'https://opentdb.com/api.php?amount=5&type=multiple';
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentRound = 1;
let score = 0;
let timer;

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('current-score');
const timerElement = document.getElementById('time-left');
const roundElement = document.getElementById('current-round');
const nextButton = document.getElementById('next-question');
const fiftyFiftyButton = document.getElementById('fifty-fifty');
const hintButton = document.getElementById('hint');

async function fetchQuestions(difficulty) {
    const response = await fetch(`${apiUrl}&difficulty=${difficulty}`);
    const data = await response.json();
    return data.results;
}

function startQuiz() {
    currentRound = 1;
    score = 0;
    loadRound();
}

async function loadRound() {
    const difficulty = currentRound === 3 ? 'hard' : currentRound === 2 ? 'medium' : 'easy';
    currentQuestions = await fetchQuestions(difficulty);
    currentQuestionIndex = 0;
    roundElement.textContent = currentRound;
    displayQuestion();
}

function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionElement.innerHTML = question.question;
    
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);
    
    answersElement.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer;
        button.addEventListener('click', () => selectAnswer(answer));
        answersElement.appendChild(button);
    });
    
    startTimer();
}

function startTimer() {
    let timeLeft = 30;
    timerElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft === 0) {
            clearInterval(timer);
            selectAnswer(null);
        }
    }, 1000);
}

function selectAnswer(answer) {
    clearInterval(timer);
    const question = currentQuestions[currentQuestionIndex];
    
    if (answer === question.correct_answer) {
        score += 10;
        feedbackElement.textContent = 'Correct!';
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is: ${question.correct_answer}`;
    }
    
    scoreElement.textContent = score;
    nextButton.style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    feedbackElement.textContent = '';
    nextButton.style.display = 'none';
    
    if (currentQuestionIndex < currentQuestions.length) {
        displayQuestion();
    } else if (currentRound < 3) {
        currentRound++;
        loadRound();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    questionElement.textContent = 'Quiz completed!';
    answersElement.innerHTML = '';
    feedbackElement.textContent = `Your final score is: ${score}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function fiftyFifty() {
    const question = currentQuestions[currentQuestionIndex];
    const correctAnswer = question.correct_answer;
    const incorrectAnswers = question.incorrect_answers;
    
    const answerButtons = answersElement.getElementsByTagName('button');
    let removedCount = 0;
    
    for (let button of answerButtons) {
        if (button.innerHTML !== correctAnswer && removedCount < 2) {
            button.style.display = 'none';
            removedCount++;
        }
    }
    
    fiftyFiftyButton.disabled = true;
}

function showHint() {
    const question = currentQuestions[currentQuestionIndex];
    feedbackElement.textContent = `Hint: The correct answer starts with "${question.correct_answer[0]}"`;
    hintButton.disabled = true;
}

nextButton.addEventListener('click', nextQuestion);
fiftyFiftyButton.addEventListener('click', fiftyFifty);
hintButton.addEventListener('click', showHint);

startQuiz();
