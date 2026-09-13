let currentQuestionIndex = 0;
let score = 0;

let selectedAnswer = null;
let selectedWords = [];

/*
==================================================
DOM ELEMENTS
==================================================
*/

const questionText = document.getElementById("question-text");
const questionType = document.getElementById("question-type");

const questionImageContainer = document.getElementById("question-image-container");
const questionImage = document.getElementById("question-image");

const choicesContainer = document.getElementById("choices-container");

const unscrambleContainer = document.getElementById("unscramble-container");
const wordBank = document.getElementById("word-bank");
const sentenceArea = document.getElementById("sentence-area");
const clearUnscramble = document.getElementById("clear-unscramble");

const writingContainer = document.getElementById("writing-container");
const writingTemplate = document.getElementById("writing-template");
const writingAnswer = document.getElementById("writing-answer");

const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");

const scoreDisplay = document.getElementById("score");
const questionNumber = document.getElementById("question-number");
const totalQuestions = document.getElementById("total-questions");
const progress = document.getElementById("progress");

const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const finalTotal = document.getElementById("final-total");
const restartBtn = document.getElementById("restart-btn");

/*
==================================================
INITIALIZE
==================================================
*/

totalQuestions.textContent = questions.length;
loadQuestion();

/*
==================================================
LOAD QUESTION
==================================================
*/

function loadQuestion() {
  resetQuestion();

  const currentQuestion = questions[currentQuestionIndex];

  questionText.textContent = currentQuestion.question;
  questionNumber.textContent = currentQuestionIndex + 1;

  updateProgress();

  if (currentQuestion.image) {
    questionImage.src = currentQuestion.image;
    questionImage.alt = currentQuestion.question;
    questionImageContainer.classList.remove("hidden");
  } else {
    questionImage.src = "";
    questionImageContainer.classList.add("hidden");
  }

  if (currentQuestion.type === "multipleChoice") {
    loadMultipleChoice(currentQuestion);
  }

  else if (currentQuestion.type === "unscramble") {
    loadUnscramble(currentQuestion);
  }

  else if (currentQuestion.type === "writing") {
    loadWriting(currentQuestion);
  }
}

/*
==================================================
RESET QUESTION
==================================================
*/

function resetQuestion() {
  selectedAnswer = null;
  selectedWords = [];

  choicesContainer.innerHTML = "";
  wordBank.innerHTML = "";
  sentenceArea.innerHTML = "";

  writingAnswer.value = "";
  writingTemplate.textContent = "";

  feedback.textContent = "";
  feedback.className = "";

  checkBtn.classList.remove("hidden");
  checkBtn.disabled = false;

  nextBtn.classList.add("hidden");
  nextBtn.disabled = false;

  clearUnscramble.disabled = false;
  writingAnswer.disabled = false;

  choicesContainer.classList.add("hidden");
  unscrambleContainer.classList.add("hidden");
  writingContainer.classList.add("hidden");
}

/*
==================================================
MULTIPLE CHOICE
==================================================
*/

function loadMultipleChoice(currentQuestion) {
  questionType.textContent = "MULTIPLE CHOICE";
  choicesContainer.classList.remove("hidden");

  currentQuestion.choices.forEach(choice => {
    const button = document.createElement("button");

    button.classList.add("choice-btn");
    button.textContent = choice;

    button.addEventListener("click", () => {
      selectChoice(button, choice);
    });

    choicesContainer.appendChild(button);
  });
}

function selectChoice(button, choice) {
  selectedAnswer = choice;

  document.querySelectorAll(".choice-btn").forEach(choiceButton => {
    choiceButton.classList.remove("selected");
  });

  button.classList.add("selected");
}

/*
==================================================
UNSCRAMBLE
==================================================
*/

function loadUnscramble(currentQuestion) {
  questionType.textContent = "UNSCRAMBLE";
  unscrambleContainer.classList.remove("hidden");

  const shuffledWords = shuffleArray([...currentQuestion.words]);

  shuffledWords.forEach((word, index) => {
    const button = document.createElement("button");

    button.classList.add("word-btn");
    button.textContent = word;
    button.dataset.wordIndex = index;

    button.addEventListener("click", () => {
      addWord(word, button);
    });

    wordBank.appendChild(button);
  });
}

function addWord(word, button) {
  if (button.classList.contains("used")) {
    return;
  }

  selectedWords.push(word);
  button.classList.add("used");

  renderSentence();
}

/*
The selected word is immediately compared with the word
that should be in the same position in the answer.
*/

function renderSentence() {
  sentenceArea.innerHTML = "";

  const currentQuestion = questions[currentQuestionIndex];
  const correctWords = currentQuestion.answer.split(" ");

  selectedWords.forEach((word, index) => {
    const wordButton = document.createElement("button");

    wordButton.textContent = word;
    wordButton.classList.add("selected-word");

    if (normalizeWord(word) === normalizeWord(correctWords[index])) {
      wordButton.classList.add("position-correct");
    } else {
      wordButton.classList.add("position-wrong");
    }

    wordButton.addEventListener("click", () => {
      removeWord(index);
    });

    sentenceArea.appendChild(wordButton);
  });
}

function removeWord(index) {
  const removedWord = selectedWords[index];

  selectedWords.splice(index, 1);

  const wordButtons = document.querySelectorAll(".word-btn");

  wordButtons.forEach(button => {
    if (
      button.textContent === removedWord &&
      button.classList.contains("used")
    ) {
      button.classList.remove("used");
      return;
    }
  });

  renderSentence();
}

clearUnscramble.addEventListener("click", () => {
  selectedWords = [];

  document.querySelectorAll(".word-btn").forEach(button => {
    button.classList.remove("used");
  });

  renderSentence();
});

/*
==================================================
WRITING
==================================================
*/

function loadWriting(currentQuestion) {
  questionType.textContent = "WRITING";
  writingContainer.classList.remove("hidden");

  writingTemplate.textContent =
    "Sentence pattern: " + currentQuestion.template;
}

/*
==================================================
CHECK ANSWER
==================================================
*/

checkBtn.addEventListener("click", checkAnswer);

function checkAnswer() {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.type === "multipleChoice") {
    checkMultipleChoice(currentQuestion);
  }

  else if (currentQuestion.type === "unscramble") {
    checkUnscramble(currentQuestion);
  }

  else if (currentQuestion.type === "writing") {
    checkWriting(currentQuestion);
  }
}

/*
==================================================
CHECK MULTIPLE CHOICE
==================================================
*/

function checkMultipleChoice(currentQuestion) {
  if (selectedAnswer === null) {
    showFeedback("Please choose an answer!", false);
    return;
  }

  const choiceButtons = document.querySelectorAll(".choice-btn");

  choiceButtons.forEach(button => {
    if (button.textContent === currentQuestion.answer) {
      button.classList.remove("selected");
      button.classList.add("answer-correct");
    } else {
      button.classList.remove("selected");
      button.classList.add("answer-wrong");
    }

    button.disabled = true;
  });

  if (selectedAnswer === currentQuestion.answer) {
    correctAnswer();
  } else {
    wrongAnswer(`Correct answer: ${currentQuestion.answer}`);
  }
}

/*
==================================================
CHECK UNSCRAMBLE
==================================================
*/

function checkUnscramble(currentQuestion) {
  const userAnswer = selectedWords.join(" ");

  if (userAnswer.length === 0) {
    showFeedback("Please arrange the words first!", false);
    return;
  }

  if (normalizeText(userAnswer) === normalizeText(currentQuestion.answer)) {
    correctAnswer("🎉 Perfect sentence!");
  } else {
    wrongAnswer(`Correct answer: ${currentQuestion.answer}`);
  }
}

/*
==================================================
CHECK WRITING
==================================================
*/

function checkWriting(currentQuestion) {
  const userAnswer = writingAnswer.value.trim();

  if (userAnswer.length === 0) {
    showFeedback("Please write your sentence first!", false);
    return;
  }

  const acceptedAnswers = currentQuestion.acceptedAnswers || [];

  const isCorrect = acceptedAnswers.some(answer =>
    normalizeText(answer) === normalizeText(userAnswer)
  );

  if (isCorrect) {
    correctAnswer("🎉 Excellent! Your sentence follows the pattern.");
  } else {
    /*
    IMPORTANT:
    A wrong writing answer does NOT finish the question.
    The student must rewrite it correctly before continuing.
    */

    showFeedback(
      `❌ Not quite. Please rewrite the sentence correctly.<br>
       <strong>Sample answer:</strong> ${currentQuestion.sampleAnswer}`,
      false
    );

    writingAnswer.classList.add("writing-error");
    writingAnswer.focus();
  }
}

/*
==================================================
CORRECT / WRONG
==================================================
*/

function correctAnswer(message = "🎉 Correct!") {
  score++;
  scoreDisplay.textContent = score;

  showFeedback(message, true);
  finishQuestion();
}

function wrongAnswer(message) {
  showFeedback(`❌ ${message}`, false);
  finishQuestion();
}

function showFeedback(message, isCorrect) {
  feedback.innerHTML = message;

  feedback.classList.remove("correct", "wrong");

  if (isCorrect) {
    feedback.classList.add("correct");
  } else {
    feedback.classList.add("wrong");
  }
}

/*
==================================================
FINISH QUESTION
==================================================
*/

function finishQuestion() {
  checkBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");

  document.querySelectorAll(".choice-btn").forEach(button => {
    button.disabled = true;
  });

  document.querySelectorAll(".word-btn").forEach(button => {
    button.disabled = true;
  });

  clearUnscramble.disabled = true;
  writingAnswer.disabled = true;
}

/*
==================================================
NEXT QUESTION
==================================================
*/

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

/*
==================================================
PROGRESS
==================================================
*/

function updateProgress() {
  const percentage =
    (currentQuestionIndex / questions.length) * 100;

  progress.style.width = percentage + "%";
}

/*
==================================================
RESULT
==================================================
*/

function showResult() {
  document.querySelector(".question-card").classList.add("hidden");
  document.querySelector(".game-header").classList.add("hidden");
  document.querySelector(".progress-container").classList.add("hidden");

  resultScreen.classList.remove("hidden");

  finalScore.textContent = score;
  finalTotal.textContent = questions.length;

  progress.style.width = "100%";
}

/*
==================================================
RESTART
==================================================
*/

restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;

  scoreDisplay.textContent = score;

  resultScreen.classList.add("hidden");

  document.querySelector(".question-card").classList.remove("hidden");
  document.querySelector(".game-header").classList.remove("hidden");
  document.querySelector(".progress-container").classList.remove("hidden");

  loadQuestion();
});

/*
==================================================
HELPER FUNCTIONS
==================================================
*/

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();
}
