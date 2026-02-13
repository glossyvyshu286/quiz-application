const questions = [
    {
        question: "Which language runs in the browser?",
        answers: [
            { text: "Java", correct: false },
            { text: "C", correct: false },
            { text: "JavaScript", correct: true },
            { text: "Python", correct: false }
        ]
    },
    {
        question: "What does CSS stand for?",
        answers: [
            { text: "Central Style Sheets", correct: false },
            { text: "Cascading Style Sheets", correct: true },
            { text: "Computer Style Sheets", correct: false },
            { text: "Creative Style System", correct: false }
        ]
    },
    {
        question: "Which HTML tag is used for inserting an image?",
        answers: [
            { text: "&lt;img&gt;", correct: true },
            { text: "&lt;image&gt;", correct: false },
            { text: "&lt;pic&gt;", correct: false },
            { text: "&lt;src&gt;", correct: false }
        ]
    },
    {
        question: "Which method prints output in JavaScript?",
        answers: [
            { text: "console.log()", correct: true },
            { text: "print()", correct: false },
            { text: "echo()", correct: false },
            { text: "display()", correct: false }
        ]
    },
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        answers: [
            { text: "var", correct: true },
            { text: "int", correct: false },
            { text: "define", correct: false },
            { text: "dim", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const scoreDisplay = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const timerElement = document.getElementById("timer");

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;

function startQuiz() {
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    restartButton.style.display = "none";
    scoreDisplay.innerHTML = "";
    showQuestion();
}

function showQuestion() {
    resetState();
    startTimer();

    let currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    updateProgressBar();

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.addEventListener("click", () => selectAnswer(button, answer.correct));
        answerButtons.appendChild(button);
    });
}

function resetState() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.innerHTML = "Time Left: 15s";
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = "Time Left: " + timeLeft + "s";

        if (timeLeft === 0) {
            clearInterval(timer);
            showCorrectAnswer();
        }
    }, 1000);
}

function selectAnswer(button, correct) {
    clearInterval(timer);

    const buttons = answerButtons.children;

    for (let btn of buttons) {
        btn.disabled = true;
    }

    if (correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        showCorrectAnswer();
    }

    nextButton.style.display = "block";
}

function showCorrectAnswer() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const buttons = answerButtons.children;

    for (let btn of buttons) {
        if (btn.innerHTML === currentQuestion.answers.find(a => a.correct).text) {
            btn.classList.add("correct");
        }
        btn.disabled = true;
    }

    nextButton.style.display = "block";
}

function updateProgressBar() {
    let progress = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = progress + "%";
}

function autoNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

nextButton.addEventListener("click", autoNext);

function showResult() {
    questionElement.innerHTML = "🎉 Quiz Finished!";
    answerButtons.innerHTML = "";
    nextButton.style.display = "none";
    restartButton.style.display = "block";
    timerElement.innerHTML = "";

    let percentage = Math.round((score / shuffledQuestions.length) * 100);

    scoreDisplay.innerHTML =
        "Your Score: " + score + " / " + shuffledQuestions.length +
        " (" + percentage + "%)";
    
    progressBar.style.width = "100%";

    // 🎉 Confetti if score >= 80%
    if (percentage >= 80) {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    }
}

restartButton.addEventListener("click", startQuiz);

startQuiz();
