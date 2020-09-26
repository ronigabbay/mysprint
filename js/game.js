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
var gMineTimeOut;
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


function init() {
    clearInterval(gTimer);
    gMistakeAllowed = 3;
    gGame.markedCount = gLevel.mines;
    gBoard = createBoard(gLevel.size);
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    rendBoardMine(gBoard)

}


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

    var beginnerIMines = [0, 1, 2, 3];
    shuffle(beginnerIMines);
    var beginnerJMines = [0, 1, 2, 3];
    shuffle(beginnerJMines);

    var mediumIMines = [0, 1, 2, 3, 4, 5, 6, 7];
    shuffle(mediumIMines);
    var mediumJMines = [0, 1, 2, 3, 4, 5, 6, 7];
    shuffle(mediumJMines);

    var expertIMines = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15];
    shuffle(expertIMines);

    var expertJMines = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15];
    shuffle(expertJMines);

    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell();

            if (gLevel.mines === 2) {
                if (i === beginnerIMines[0] && j === beginnerJMines[0] || i === beginnerIMines[1] && j === beginnerJMines[1]) {
                    board[i][j] = {
                        minesAroundCount: 0,
                        isShown: false,
                        isMine: true,
                        isMarked: false
                    }
                }
            }

            else if (gLevel.mines === 12) {
                if (i === mediumIMines[0] && j === mediumIMines[7] ||
                    i === mediumIMines[1] && j === mediumIMines[6] ||
                    i === mediumIMines[2] && j === mediumIMines[5] ||
                    i === mediumIMines[3] && j === mediumIMines[4] ||
                    i === mediumIMines[4] && j === mediumIMines[3] ||
                    i === mediumIMines[5] && j === mediumIMines[2] ||
                    i === mediumIMines[6] && j === mediumIMines[1] ||
                    i === mediumIMines[7] && j === mediumIMines[0] ||
                    i === mediumIMines[1] && j === mediumIMines[1] ||
                    i === mediumIMines[2] && j === mediumIMines[2] ||
                    i === mediumIMines[3] && j === mediumIMines[3] ||
                    i === mediumIMines[4] && j === mediumIMines[4]) {
                    board[i][j] = {
                        minesAroundCount: 0,
                        isShown: false,
                        isMine: true,
                        isMarked: false
                    }
                }
            }

            else if (gLevel.mines === 30) {
                if (i === expertJMines[0] && j === expertJMines[15] ||
                    i === expertJMines[1] && j === expertJMines[14] ||
                    i === expertJMines[2] && j === expertJMines[13] ||
                    i === expertJMines[3] && j === expertJMines[12] ||
                    i === expertJMines[4] && j === expertJMines[11] ||
                    i === expertJMines[5] && j === expertJMines[10] ||
                    i === expertJMines[6] && j === expertJMines[9] ||
                    i === expertJMines[7] && j === expertJMines[8] ||
                    i === expertJMines[8] && j === expertJMines[7] ||
                    i === expertJMines[9] && j === expertJMines[6] ||
                    i === expertJMines[10] && j === expertJMines[5] ||
                    i === expertJMines[11] && j === expertJMines[4] ||
                    i === expertJMines[12] && j === expertJMines[3] ||
                    i === expertJMines[13] && j === expertJMines[2] ||
                    i === expertJMines[14] && j === expertJMines[1] ||
                    i === expertJMines[15] && j === expertJMines[0] ||
                    i === expertJMines[15] && j === expertJMines[15] ||
                    i === expertJMines[14] && j === expertJMines[14] ||
                    i === expertJMines[13] && j === expertJMines[13] ||
                    i === expertJMines[12] && j === expertJMines[12] ||
                    i === expertJMines[11] && j === expertJMines[11] ||
                    i === expertJMines[10] && j === expertJMines[10] ||
                    i === expertJMines[9] && j === expertJMines[9] ||
                    i === expertJMines[8] && j === expertJMines[8] ||
                    i === expertJMines[7] && j === expertJMines[7] ||
                    i === expertJMines[6] && j === expertJMines[6] ||
                    i === expertJMines[5] && j === expertJMines[5] ||
                    i === expertJMines[4] && j === expertJMines[4] ||
                    i === expertJMines[3] && j === expertJMines[3] ||
                    i === expertJMines[2] && j === expertJMines[2]) {
                    board[i][j] = {
                        minesAroundCount: 0,
                        isShown: false,
                        isMine: true,
                        isMarked: false
                    }
                }
            }
        }
    }
    return board;
}



function cellClicked(el, i, j) {
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
        } else if (gBoard[i][j].isMine === true) {
            gBoard[i][j].isShown = true;
            gMistakeAllowed -= 1;

            var elLives = document.querySelector('.lives span');
            elLives.innerText = gMistakeAllowed;

            var elSmileBtn = document.querySelector('.smileBtn');
            elSmileBtn.innerText = '🤯';

            setTimeout(function () {
                var elSmileBtn = document.querySelector('.smileBtn');
                elSmileBtn.innerText = '😀';
            }, 300)

            var gMineTimeOut = setTimeout(function () {
                gBoard[i][j].isShown = false;
                el.innerText = '';
            }, 500);
        }
        renderCell(i, j)
    }
    gameOver(i, j)
    gameWon(gBoard)

}


function flagOrUnflag(event, el, i, j) {
    if (event.which !== 3) return;
    if (gMistakeAllowed < 1) return;
    if (gBoard[i][j].isShown === false && el.innerText !== FLAG) {
        gBoard[i][j].isMarked = true;
        el.innerText = FLAG;
        gGame.markedCount -= 1;
        gFlagNum++;
    } else if (gBoard[i][j].isShown === false && el.innerText === FLAG) {
        gBoard[i][j].isMarked = false;
        el.innerText = EMPTY;
        gGame.markedCount += 1;
    }

    var elMarked = document.querySelector('.marked')
    elMarked.innerText = gGame.markedCount;
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

function gameWon(board) {
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
    gGame.isOn = false;
    var elWon = document.querySelector('.won');
    elWon.classList.remove('wonHide');
    elWon.classList.add('wonShow');
    clearInterval(gTimer);
    setTimeout(function () {
        var elSmileBtn = document.querySelector('.smileBtn');
        elSmileBtn.innerText = '😎';
    }, 300)
}


function gameOver(i, j) {
    if (gMistakeAllowed < 1) {
        var elOver = document.querySelector('.over')
        elOver.classList.remove('overHide');
        elOver.classList.add('overShow');
        gGame.isOn = false;
        gIsWon = false;
        clearInterval(gTimer);
        setTimeout(function () {
            var elSmileBtn = document.querySelector('.smileBtn');
            elSmileBtn.innerText = '🤯';
        }, 300)

        setTimeout(function () {
            for (var i = 0; i < gBoard.length; i++) {
                var row = gBoard[i]
                for (var j = 0; j < row.length; j++) {
                    var elMine = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                    if (gBoard[i][j].isShown === false && gBoard[i][j].isMine === true) {
                        elMine.innerText = MINE;
                    }

                }
            }
        }, 1000)
    }
}


function restartGame(el) {
    clearInterval(gTimer);
    var gMistakeAllowed = 3;
    gGame.markedCount = gLevel.mines;
    gGame.isOn = false;
    var elLives = document.querySelector('.lives span');
    elLives.innerText = gMistakeAllowed;

    var elTime = document.querySelector('.timer span');
    elTime.innerText = '0.000';

    var elMarked = document.querySelector('.marked')
    elMarked.innerText = gLevel.mines;

    init()

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


