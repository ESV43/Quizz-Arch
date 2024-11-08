const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  // Add more questions here...
];

const questionContainer = document.querySelector('.question-container');
const questionElement = questionContainer.querySelector('.question');
const optionsList = questionContainer.querySelector('.options');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');

let currentQuestion = 0;
let score = 0;
let timer = 30; // Initial timer value in seconds

function startQuiz() {
  startBtn.style.display = 'none';
  showQuestion();
  startTimer();
}

function showQuestion() {
  const currentQuestionData = questions[currentQuestion];
  questionElement.textContent = currentQuestionData.question;
  optionsList.innerHTML = '';

  currentQuestionData.options.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option;
    li.addEventListener('click', () => checkAnswer(option));
    optionsList.appendChild(li);
  });
}

function checkAnswer(selectedOption) {
  const currentQuestionData = questions[currentQuestion];
  const isCorrect = selectedOption === currentQuestionData.correctAnswer;

  if (isCorrect) {
    score += 10;
    scoreElement.textContent = score;
  }

  optionsList.innerHTML = '';
  optionsList.textContent = isCorrect ? 'Correct!' : 'Wrong!';

  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(showQuestion, 1000);
  } else {
    endQuiz();
  }
}

function startTimer() {
  const timerInterval = setInterval(() => {
    timer--;
    timerElement.textContent = timer;

    if (timer === 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  questionElement.textContent = 'Quiz ended!';
  optionsList.innerHTML = '';
  timerElement.textContent = '0';
}

startBtn.addEventListener('click', startQuiz);
