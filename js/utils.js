'use strict'
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function countNeighbors(row, col, board) {
    var cnt = 0;
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === row && j === col) continue;
            if (board[i][j].isMine) cnt++;
        }
    }
    return cnt;
}

