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
var gIsPutMine = false;
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
    renderBoard(gBoard)
    rendCells(gBoard)
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
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell();
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
            expandShown(gBoard, i, j)
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
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.classList.remove('open');
                el.innerText = '';
            }, 500);
        }
        if (gIsPutMine === false) {
            putMines(gBoard);
            setMinesNegsCount(gBoard)
            gIsPutMine = true;
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

    var elMarked = document.querySelector('.marked span')
    elMarked.innerText = gGame.markedCount;
    gameWon(gBoard);
}


function putMines(board) {
    var mines = [];
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            var currCell = board[i][j];
            if (currCell.isShown === false) mines.push({ i, j });
            shuffle(mines);

        }
    }

    for (var a = 0; a < gLevel.mines; a++) {
        var currMineI = mines[0].i;
        var currMinej = mines[0].j;
        gBoard[currMineI][currMinej] = {
            minesAroundCount: 0,
            isShown: false,
            isMine: true,
            isMarked: false
        }
        mines.shift();
    }
    renderMine(board)
}

function renderMine(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            var currCell = board[i][j];
            if (currCell.isMine === true) {
                var elMine = document.querySelector(`[data-i="${i}"][data-j="${j}"]`); {
                    elMine.classList.remove('empty');
                    elMine.classList.add('mine');
                }
            }
        }
    }
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = row[j];
            var className = 'empty';
            strHtml += `<td oncontextmenu="return false" onmousedown="flagOrUnflag(event, this, ${i}, ${j})"" onclick="cellClicked(this, ${i}, ${j})" data-i="${i}" data-j="${j}" id="cell-${i}-${j}" class="${className}">`
            strHtml += cell;
            strHtml += '</td>'
        }
        strHtml += '</tr>'
    }
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHtml;

}

function rendCells(board) {
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
            elCell.classList.add('open');
            elCell.innerText = MINE;
        } else if (elCell.classList.contains('empty')) {
            elCell.classList.add('open');
            if (gBoard[i][j].minesAroundCount !== 0) {
                elCell.innerText = gBoard[i][j].minesAroundCount;
            }
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
                        elMine.classList.add('open');
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
    gIsPutMine = false;
    gGame.isOn = false;
    var elLives = document.querySelector('.lives span');
    elLives.innerText = gMistakeAllowed;

    var elTime = document.querySelector('.timer span');
    elTime.innerText = '0.000';

    var elMarked = document.querySelector('.marked span')
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

function expandShown(board, cellI, cellJ) {
    if (board[cellI][cellJ].isShown === true) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= board[i].length) continue;
                if (i === cellI && j === cellJ) continue;
                if (gBoard[i][j].isMine === false) {
                    gBoard[i][j].isShown = true;
                    renderCell(i, j);
                    if (gIsPutMine === true) {
                        if (gBoard[i][j].isShown === true) {
                            for (var a = i - 1; a <= i + 1; a++) {
                                if (a < 0 || a >= board.length) continue;
                                for (var b = j - 1; b <= j + 1; b++) {
                                    if (b < 0 || b >= board[a].length) continue;
                                    if (a === i && b === j) continue;
                                    if (gBoard[a][b].isMine === false) {
                                        gBoard[a][b].isShown = true;
                                        renderCell(a, b);
                                        if (gBoard[a][b].isShown === true) {
                                            for (var c = a - 1; c <= a + 1; c++) {
                                                if (c < 0 || c >= board.length) continue;
                                                for (var d = b - 1; d <= b + 1; d++) {
                                                    if (d < 0 || d >= board[c].length) continue;
                                                    if (c === i && d === j) continue;
                                                    if (gBoard[c][d].isMine === false) {
                                                        gBoard[c][d].isShown = true;
                                                        renderCell(c, d);
                                                    }
                                                }
                                            }
                                        }

                                    }

                                }
                            }
                        }

                    }

                }

            }
        }
    }
}

