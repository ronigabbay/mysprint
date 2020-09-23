'use strict'

const MINE = '*';
const EMPTY = '';
var gBoard = createBoard(4)

// console.log(gBoard);
// console.table(gBoard)

init()
function init() {
    createBoard(4);
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    rendBoardMine(gBoard)
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true
    }
    return cell;
}


function createBoard(boardSize) {
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell();
            if (i === 1 && j === 1 || i === 3 && j === 0) {
                board[i][j] = {
                    minesAroundCount: 0,
                    isShown: false,
                    isMine: true,
                    isMarked: true
                }
            }

        }
    }
    return board;
}

function cellClicked(el) {
    console.log(el);
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = row[j];
            var className = cell.isMine === true ? 'mine' : 'empty';
            strHtml += `<td onclick="cellClicked(this)" data-i="${i}" data-j="${j}" id="cell${i}-${j}" class="${className}">`
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
            rnderCell(i, j)
        }
    }
}

function rnderCell(i, j) {
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


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
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


