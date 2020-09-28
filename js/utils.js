function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}


function countNeighbors(cellI, cellJ, mat) {
  var neighborsSum = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (mat[i][j].isMine === true) neighborsSum++;
    }
  }
  return neighborsSum;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function Beginner() {
  gGame.isOn = false;
  clearInterval(gTimer);
  gMistakeAllowed = 3;
  gIsPutMine = false;

  var elLives = document.querySelector('.lives span');
  elLives.innerText = gMistakeAllowed;

  var elTime = document.querySelector('.timer span');
  elTime.innerText = '0.000';

  var elMarked = document.querySelector('.marked span')
  elMarked.innerText = '2'

  if (gIsWon === false) {

    var elOver = document.querySelector('.over')
    elOver.classList.remove('overShow');
    elOver.classList.add('overHide');
  }
  if (gIsWon === true) {
    var elWon = document.querySelector('.won');
    elWon.classList.remove('wonShow');
    elWon.classList.add('wonHide');
  }

  setTimeout(function () {
    var elSmileBtn = document.querySelector('.smileBtn');
    elSmileBtn.innerText = '😀';
  }, 100)

  gLevel = {
    size: 4,
    mines: 2
  }
  gGame.markedCount = gLevel.mines;
  init()
}

function Medium() {
  gGame.isOn = false;
  clearInterval(gTimer);
  gGame.markedCount = 12;
  gMistakeAllowed = 3;
  gIsPutMine = false;

  var elLives = document.querySelector('.lives span');
  elLives.innerText = gMistakeAllowed;

  var elTime = document.querySelector('.timer span');
  elTime.innerText = '0.000';

  var elMarked = document.querySelector('.marked span')
  elMarked.innerText = '12'

  if (gIsWon === false) {

    var elOver = document.querySelector('.over')
    elOver.classList.remove('overShow');
    elOver.classList.add('overHide');
  }
  if (gIsWon === true) {
    var elWon = document.querySelector('.won');
    elWon.classList.remove('wonShow');
    elWon.classList.add('wonHide');
  }
  setTimeout(function () {
    var elSmileBtn = document.querySelector('.smileBtn');
    elSmileBtn.innerText = '😀';
  }, 100)

  gLevel = {
    size: 8,
    mines: 12
  }
  gGame.markedCount = gLevel.mines;
  init()
}

function Expert() {
  gGame.isOn = false;
  clearInterval(gTimer);
  gGame.markedCount = 30;
  gIsPutMine = false;

  gMistakeAllowed = 3;
  var elLives = document.querySelector('.lives span');
  elLives.innerText = gMistakeAllowed;

  var elTime = document.querySelector('.timer span');
  elTime.innerText = '0.000';

  var elMarked = document.querySelector('.marked span')
  elMarked.innerText = '30'

  if (gIsWon === false) {

    var elOver = document.querySelector('.over')
    elOver.classList.remove('overShow');
    elOver.classList.add('overHide');
  }
  if (gIsWon === true) {
    var elWon = document.querySelector('.won');
    elWon.classList.remove('wonShow');
    elWon.classList.add('wonHide');
  }

  setTimeout(function () {
    var elSmileBtn = document.querySelector('.smileBtn');
    elSmileBtn.innerText = '😀';
  }, 100)

  gLevel = {
    size: 16,
    mines: 30
  }
  gGame.markedCount = gLevel.mines;
  init()
}

function startTime() {
  if (gGame.isOn === false) return;
  gStartTimer = Date.now();
  gTimer = setInterval(function () {
    var currTime = (Date.now() - gStartTimer) / 1000;
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = currTime;
  });
}