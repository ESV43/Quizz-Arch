// script.js
let score = 0;
let currentRound = 1;
let currentQuestion = 0;
let timer;
let questions = [];
let lifelineUsed = false;

async function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  await loadQuestions();
  displayQuestion();
}

async function loadQuestions() {
  try {
    // Fetch questions from an external API or repository
    let response = await fetch("https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple");
    let data = await response.json();
    questions = data.results;
  } catch (error) {
    console.error("Failed to load questions:", error);
  }
}

function displayQuestion() {
  resetTimer();
  let questionObj = questions[currentQuestion];
  document.getElementById("question").innerText = questionObj.question;
  
  // Show options
  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  let options = [...questionObj.incorrect_answers, questionObj.correct_answer];
  options = shuffleArray(options);
  
  options.forEach(option => {
    let btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selectedOption) {
  let questionObj = questions[currentQuestion];
  if (selectedOption === questionObj.correct_answer) {
    score += 10;
    alert("Correct Answer!");
  } else {
    alert("Incorrect Answer. The correct answer is: " + questionObj.correct_answer);
  }
  
  currentQuestion++;
  if (currentQuestion % 5 === 0 && currentRound < 3) {
    currentRound++;
    alert(`Round ${currentRound} starts now!`);
  }
  
  if (currentQuestion >= questions.length || currentRound > 3) {
    endQuiz();
  } else {
    displayQuestion();
  }
}

function endQuiz() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("score-text").innerText = `You scored ${score} points!`;
}

function resetQuiz() {
  score = 0;
  currentRound = 1;
  currentQuestion = 0;
  lifelineUsed = false;
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function resetTimer() {
  clearInterval(timer);
  let timeLeft = 30;
  document.getElementById("time").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
      currentQuestion++;
      if (currentQuestion >= questions.length) {
        endQuiz();
      } else {
        displayQuestion();
      }
    }
  }, 1000);
}

function useLifeline() {
  if (lifelineUsed) return alert("You already used your lifeline!");
  lifelineUsed = true;
  
  let questionObj = questions[currentQuestion];
  let correct = questionObj.correct_answer;
  let incorrect = questionObj.incorrect_answers[0];
  let reducedOptions = [correct, incorrect];
  
  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  
  reducedOptions.forEach(option => {
    let btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function showHint() {
  let questionObj = questions[currentQuestion];
  document.getElementById("hint").style.display = "block";
  document.getElementById("hint-text").innerText = "Think carefully, the correct answer may relate to...";
}
