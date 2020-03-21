'use strict'
function buildBoard() {
    var boardSize = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board.push([]);
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isHint: false
            }
        }
    }
    return board;
}

function placeMines(cellCoord) {
    for (var k = 0; k < gLevel.MINES; k++) {
        var i = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var j = getRandomIntInclusive(0, gLevel.SIZE - 1);
        // dont place mine in first cellclicked
        if (i === cellCoord.i && j === cellCoord.j) {
            k--; 
            continue;
        }
        if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMine = true
        } // if spot taken run it again
        else { k-- }
    }
    return gBoard;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var row = i;
            var col = j;
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighbors(row, col, board);
            }
        }
    }
    return board;
}

function hintClicked() {
    if (!gHint.isOn && gHint.hintCount && gGame.isOn) {
        var elHint = document.querySelector(".hint");
        gHint.isOn = true;
        elHint.disabled = true;
        elHint.classList.add("hintOn");
        gHint.hintCount--;
        elHint.innerText = gHintLook + gHint.hintCount;
    }
    else if (gHint.isOn) {
        var elHint = document.querySelector(".hintOn");
        elHint.classList.remove("hintOn");
        elHint.disabled = false;
        gHint.isOn = false;
    }
}

function rightClick(event, elCell) {
    event.preventDefault();
    var cellCoord = {
        i: +elCell.dataset.i,
        j: +elCell.dataset.j
    }
    if (gBoard[cellCoord.i][cellCoord.j].isMarked) {
        gBoard[cellCoord.i][cellCoord.j].isMarked = false;
        renderUnFlagCell(elCell);
        gGame.markedCount--;
    }
    else {
        gBoard[cellCoord.i][cellCoord.j].isMarked = true;
        renderFlagCell(elCell);
        gGame.markedCount++;
    }
    checkGameOver();
}

function leftClick(elCell) {
    var cellCoord = {
        i: +elCell.dataset.i,
        j: +elCell.dataset.j
    }
    // check if its the player firstclick
    if (!gGame.isOn && !gGame.secsPassed) {
        startGame(cellCoord, elCell);
        return;
    }
    if (gHint.isOn) {
        showOrHideHint(cellCoord);
        setTimeout(function () { showOrHideHint(cellCoord); hintClicked(); }, 1000);
        return;
    }
    // if cell is flaged do nothing
    if (gBoard[cellCoord.i][cellCoord.j].isMarked) return;
    if (gBoard[cellCoord.i][cellCoord.j].isMine) {
        if (!gGame.life) {
            gameOver();
            return;
        }
        changeLife();
        return;
    }
    else {
        if (!gBoard[cellCoord.i][cellCoord.j].minesAroundCount) {
            expandShown(cellCoord);
        }
        else {
            gGame.shownCount++;
            renderRevealCell(elCell, cellCoord);
        }
    }
    if (gGame.isOn) checkGameOver();
}
function showOrHideHint(cellCoord) {
    for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if ((gBoard[i][j].isShown) && !(gBoard[i][j].isHint)) continue;
            gBoard[i][j].isHint = !(gBoard[i][j].isHint);
            var elNeg = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            var negCoord = {
                i: i,
                j: j
            }
            renderRevealCell(elNeg, negCoord);
        }
    }
}

function expandShown(cellCoord) {
    if (cellCoord.i < 0 || cellCoord.i >= gBoard.length ||
        (cellCoord.j < 0 || cellCoord.j >= gBoard[0].length)) {
        return;
    }

    var currCell = gBoard[cellCoord.i][cellCoord.j];
    var myCell = document.querySelector(`[data-i="${cellCoord.i}"][data-j="${cellCoord.j}"]`);
    if (currCell.isShown || currCell.isMine) {
        return;
    }
    gGame.shownCount++;
    renderRevealCell(myCell, cellCoord);
    if (!currCell.minesAroundCount) {
        for (var i = cellCoord.i - 1; i <= cellCoord.i + 1; i++) {
            for (var j = cellCoord.j - 1; j <= cellCoord.j + 1; j++) {
                expandShown({ i: i, j: j });
            }
        }
    }
}