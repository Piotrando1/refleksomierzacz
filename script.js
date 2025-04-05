let clickArea;
let startBtn;
let stopBtn;
let statsPanel;
let reactionTimes = [];
let maxTries = 5;
let currentTry = 0;
let timerId = null;
let colorChangeTime = 0;
let gameRunning = false;

const colors = ["red", "yellow", "green", "blue", "pink", "orange", "purple"];

window.onload = function() {

  clickArea = document.getElementById('game-area');
  startBtn = document.getElementById('start-btn');
  stopBtn = document.getElementById('stop-btn');
  statsPanel = document.getElementById('stats');


  startBtn.addEventListener('click', startGame);
  stopBtn.addEventListener('click', stopGame);
  clickArea.addEventListener('click', handleClick);
};

function startGame() {
  reactionTimes = [];
  currentTry = 0;
  gameRunning = true;


  statsPanel.style.display = 'none';
  document.getElementById('min-time').innerText = '--';
  document.getElementById('max-time').innerText = '--';
  document.getElementById('avg-time').innerText = '--';


  startBtn.disabled = true;
  stopBtn.disabled = false;

  scheduleColorChange();
}

function stopGame() {

  gameRunning = false;

  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }

  clickArea.style.backgroundColor = 'lightgray';

  stopBtn.disabled = true;
  startBtn.disabled = false;
}


function scheduleColorChange() {
  if (currentTry >= maxTries) {
    endGame();
    return;
  }
  let randomDelay = Math.floor(Math.random() * 1800) + 1000;
  timerId = setTimeout(changeColor, randomDelay);
}

function changeColor() {
  if (!gameRunning) return;

  let randomIndex = Math.floor(Math.random() * colors.length);
  let newColor = colors[randomIndex];

  clickArea.style.backgroundColor = newColor;
  colorChangeTime = performance.now();
}


function handleClick() {
  if (!gameRunning) return;

  if (clickArea.style.backgroundColor !== 'lightgray') {
    let now = performance.now();
    let reactionTime = now - colorChangeTime;
    reactionTimes.push(reactionTime);

    clickArea.style.backgroundColor = 'lightgray';

    currentTry++;
    if (currentTry < maxTries) {
      scheduleColorChange();
    } else {
      endGame();
    }
  }
}


function endGame() {
  gameRunning = false;
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  clickArea.style.backgroundColor = 'lightgray';

  showStats();
  stopBtn.disabled = true;
  startBtn.disabled = false;
}


function showStats() {
  if (reactionTimes.length === 0) {

    return;
  }

  let min = Math.min(...reactionTimes);
  let max = Math.max(...reactionTimes);
  let sum = reactionTimes.reduce((acc, val) => acc + val, 0);
  let avg = sum / reactionTimes.length;

  document.getElementById('min-time').innerText = min.toFixed(2);
  document.getElementById('max-time').innerText = max.toFixed(2);
  document.getElementById('avg-time').innerText = avg.toFixed(2);

  statsPanel.style.display = 'block';
}