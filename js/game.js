'use strict'

const MINE = '💣';
const EMPTY = '';
const FLAG = '🚩'

var gBoard;
var gMistakeAllowed;
var gFlagNum = 0;
var gStartTimer;
var gTimer;
var gIsWon;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 2,
    secsPassed: 0
}
var gLevel = {
    size: 4,
    mines: 2
}


// console.log(gBoard);
// console.table(gBoard)


function init() {
    clearInterval(gTimer);
    gMistakeAllowed = 3;
    gBoard = createBoard(4);
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    rendBoardMine(gBoard)

}

// function chooseLevel(){

// }

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}


function createBoard(boardSize) {
    var board = [];
    var posI1 = getRandomIntInclusive(0, 3)
    var posJ1 = getRandomIntInclusive(0, 3)
    var posI2 = getRandomIntInclusive(0, 3)
    var posJ2 = getRandomIntInclusive(0, 3)

    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell();

            // if (i === 1 && j === 1 || i === 3 && j === 0) {
            //     board[i][j] = {
            //         minesAroundCount: 0,
            //         isShown: false,
            //         isMine: true,
            //         isMarked: false
            //     }
            // }

            if (i === posI1 && j === posJ1 || i === posI2 && j === posJ2) {
                board[i][j] = {
                    minesAroundCount: 0,
                    isShown: false,
                    isMine: true,
                    isMarked: false
                }
            }

        }
    }

    return board;
}

function cellClicked(el, i, j) {
    // if (gGame.isOn === false){
    // } 
    if (gGame.isOn === false) {
        gGame.isOn = true;
        startTime()
    }

    var cell = gBoard[i][j];
    if (gBoard[i][j].isMarked !== false) return;
    if (gMistakeAllowed > 0) {
        if (gBoard[i][j].isMine === false) {
            gGame.shownCount += 1;
            gBoard[i][j].isShown = true;
            expandShown(gBoard, el, i, j)
            // console.log('show: ', gGame.shownCount);
        }
        else if (gBoard[i][j].isMine === true) {
            gBoard[i][j].isShown = true;
            gMistakeAllowed -= 1;

            var elLives = document.querySelector('.lives span');
            elLives.innerText = gMistakeAllowed;

            setTimeout(function () {
                gBoard[i][j].isShown = false;
                el.innerText = '';
            }, 2000);
            // console.log('mist: ', gMistakeAllowed);
        }
        renderCell(i, j)
    }
    gameOver()
    gameWon(gBoard)

}


function flagOrUnflag(event, el, i, j) {
    if (event.which !== 3) return;
    if (gMistakeAllowed < 1) return;
    console.log(gBoard[i][j].isShown)
    console.log(el.innerText)
    console.log(gGame.isOn)
    if (gBoard[i][j].isShown === false && el.innerText !== FLAG) {
        if (gGame.markedCount <= 0) return;
        gBoard[i][j].isMarked = true;
        el.innerText = FLAG;
        gGame.markedCount -= 1;
        gFlagNum++;
    } else if (gBoard[i][j].isShown === false && el.innerText === FLAG && gGame.isOn === true) {
        gBoard[i][j].isMarked = false;
        el.innerText = EMPTY;
        gGame.markedCount += 1;
    }
    // console.log('flag: ', gGame.markedCount);
    gameWon(gBoard);
}


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = row[j];
            var className = cell.isMine === true ? 'mine' : 'empty';
            strHtml += `<td oncontextmenu="return false" onmousedown="flagOrUnflag(event, this, ${i}, ${j})"" onclick="cellClicked(this, ${i}, ${j})" data-i="${i}" data-j="${j}" id="cell-${i}-${j}" class="${className}">`
            strHtml += cell;
            strHtml += '</td>'
        }
        strHtml += '</tr>'
    }
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHtml;

}

function rendBoardMine(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (var j = 0; j < board.length; j++) {
            renderCell(i, j)
        }
    }
}

function renderCell(i, j) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    // console.log(elCell);
    if (gBoard[i][j].isShown === true) {
        if (elCell.classList.contains('mine')) {
            elCell.innerText = MINE;
        } else if (elCell.classList.contains('empty')) {
            elCell.innerText = gBoard[i][j].minesAroundCount;
        }
    } else {
        elCell.innerText = ' ';
    }

}


function startTime() {
    if (gGame.isOn === false) return;
    gStartTimer = Date.now();
    gTimer = setInterval(function () {
        var currTime = (Date.now() - gStartTimer) / 1000;
        var elTimer = document.querySelector('.timer');
        elTimer.innerText = 'Time: ' + currTime;
    });
}


function gameWon(board) {
    console.log('won 2 is');
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        for (var j = 0; j < row.length; j++) {
            var elMine = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            if (board[i][j].isShown === false && board[i][j].isMine === false) {
                return;
            }
            if (board[i][j].isMine === true && elMine.innerText === '') {
                return;
            }
        }
    }
    gIsWon = true;
    console.log('woooooon');
    var elWon = document.querySelector('.wonHide');
    elWon.classList.remove('wonHide');
    elWon.classList.add('wonShow');
    clearInterval(gTimer);
}


function gameOver() {
    if (gMistakeAllowed < 1) {
        console.log('game over');
        var elOver = document.querySelector('.overHide')
        elOver.classList.remove('overHide');
        elOver.classList.add('overShow');
        gGame.isOn = false;
        gIsWon = false;
        clearInterval(gTimer);
    }
}



function restartGame(el) {
    clearInterval(gTimer);
    init()
    var gMistakeAllowed = 3;
    var elLives = document.querySelector('.lives span');
    elLives.innerText = gMistakeAllowed;

    var elTime = document.querySelector('.timer');
    elTime.innerText = 'Time is: ' + 0;
    console.log(elTime);
    startTime()

    if (gIsWon === false) {
        var elOver = document.querySelector('.overShow')
        elOver.classList.remove('overShow');
        elOver.classList.add('overHide');
    }
    if (gIsWon === true) {
        var elWon = document.querySelector('.wonShow');
        elWon.classList.remove('wonShow');
        elWon.classList.add('wonHide');
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
        }
    }
}

function expandShown(board, elCell, cellI, cellJ) {
    if (board[cellI][cellJ].isShown === true && board[cellI][cellJ].minesAroundCount === 0) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= board[i].length) continue;
                if (i === cellI && j === cellJ) continue;
                gBoard[i][j].isShown = true;
                renderCell(i, j)
            }
        }
    }
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

