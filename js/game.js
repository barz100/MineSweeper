'use strict'
var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    life: 3
}
var gHint = {
    isOn: false,
    hintCount: 3,
}

var gSmileys = {
    normal: '🙂',
    sad: '😭',
    happy: '😎',
    gotHit: '🤯'
}
var gTimeInterval;
var gStartTime;
var gMine = '💣';
var gHintLook = ' 💡 ' + 'Hint: '
var gFlag = '‍ 🏴‍☠️';
var gLifes = ['❤️', '💔'];

function initGame() {
    // first run default board-Beginner
    gBoard = buildBoard();
    renderBoard(gBoard, '.board');
    var elHint = document.querySelector(".hint");
    elHint.innerText = gHintLook + gHint.hintCount;
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerText = gSmileys.normal;
    var elLife = document.querySelector(".life");
    elLife.innerText = gLifes[0].repeat(gGame.life);
    keepBestScore();
}
function setLevel(level) {
    var levelData = level.dataset.lvl;
    if (levelData == 1) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    }
    if (levelData == 2) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    }
    if (levelData == 3) {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    startOver();
}

function startGame(cellCoord, elCell) {
    gGame.isOn = true;
    gStartTime = Date.now();
    timer();
    gTimeInterval = setInterval(timer, 100);
    placeMines(cellCoord);
    setMinesNegsCount(gBoard);
    leftClick(elCell);
}

function timer() {
    var diffrence = (Date.now() - gStartTime);
    var minutes = Math.floor((diffrence % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diffrence % (1000 * 60)) / 1000);
    gGame.secsPassed = diffrence / 1000;
    var elTime = document.querySelector(".timer");
    elTime.innerText = '⌛ '
    if (minutes < 10) elTime.innerText += '0';
    elTime.innerText += minutes + ':';
    if (seconds < 10) elTime.innerText += '0';
    elTime.innerText += seconds;
}

function checkGameOver() {
    if (gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
        && gGame.markedCount === gLevel.MINES) {
        gameOver('win');
    }
    return false;
}

function gameOver(result) {
    clearInterval(gTimeInterval)
    gGame.isOn = false;
    if (result === 'win') {
        // console.log('win');
        var elSmiley = document.querySelector(".smiley");
        elSmiley.innerText = gSmileys.happy;
        keepBestScore();
    }
    else {
        // console.log('lose');
        var elSmiley = document.querySelector(".smiley");
        elSmiley.innerText = gSmileys.sad;
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cellCoord = {
                i: i,
                j: j,
            }
            var elCell = gBoard[i][j];
            gBoard[cellCoord.i][cellCoord.j].isShown = true;
            renderRevealCell(elCell, cellCoord);
        }
    }
}

function startOver() {
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gStartTime = 0;
    gHint.hintCount = 3;
    gGame.life = 3;
    hintClicked();
    clearInterval(gTimeInterval);
    initGame();
}

function changeLife() {
    gGame.life--;
    var elLife = document.querySelector(".life");
    elLife.innerText = gLifes[0].repeat(gGame.life);
    elLife.innerText += gLifes[1].repeat(3 - gGame.life);
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerText = gSmileys.gotHit;
    setTimeout(function () { elSmiley.innerText = gSmileys.normal }, 800);
}

function keepBestScore() {
    var bestScore = parseInt(localStorage.getItem(gLevel.SIZE.toString()));
    if (bestScore === NaN) localStorage.setItem(gLevel.SIZE.toString(), gGame.secsPassed);
    else if (bestScore === 0 || (gGame.secsPassed > 0 && bestScore > gGame.secsPassed)) {
        bestScore = gGame.secsPassed;
        localStorage.setItem(gLevel.SIZE.toString(), gGame.secsPassed);
    }
    if (+bestScore > 0) {
        var elScore = document.querySelector(".score");
        var minutes = Math.floor(bestScore / 60);
        var seconds = Math.floor(bestScore % 60);
        elScore.innerText = '🏆 Record:  ';
        if (seconds < 10) seconds = '0' + seconds;
        if (bestScore < 60) elScore.innerText += ' 00:' + seconds;
        else if (minutes < 10) elScore.innerText += ' 0' + minutes + ': ' + seconds
        else elScore += minutes + ': ' + seconds;
    }
}
