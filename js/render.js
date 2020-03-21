'use strict'
function renderBoard(mat, selector) {
    var strHTML = '';
    var className = 'back';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var strData = `data-i="${i}" data-j="${j}"`;
            strHTML += `<td class="${className}" ${strData}
            oncontextmenu="rightClick(event, this)" onclick="leftClick(this)">`;
            strHTML += '</td>';
        }
        strHTML += '</tr>'
    }
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function renderRevealCell(elCell, cellCoord) {
    elCell = document.querySelector(`[data-i="${cellCoord.i}"][data-j="${cellCoord.j}"]`);
    // hide back hints
    if (!elCell.classList.contains("back") && gHint.isOn) {
        elCell.removeAttribute("class")
        elCell.classList.add("back")
        elCell.innerText = '';
        gBoard[cellCoord.i][cellCoord.j].isSho = false;
        return;

    }
    if (gBoard[cellCoord.i][cellCoord.j].isMine) {
        elCell.classList.add("mine");
        elCell.innerText = gMine;
    }
    else {
        var minesCount = gBoard[cellCoord.i][cellCoord.j].minesAroundCount
        if (minesCount == 0) {
            elCell.classList.add("noMine");
            elCell.innerText = '';

        }
        if (minesCount === 1) {
            elCell.classList.add("oneMine");
            elCell.innerText = minesCount;
        }
        if (minesCount === 2) {
            elCell.classList.add("twoMine");
            elCell.innerText = minesCount;
        }
        if (minesCount === 3) {
            elCell.classList.add("threeMine");
            elCell.innerText = minesCount;
        }
        if (minesCount > 3) {
            elCell.classList.add("fourPlusMine");
            elCell.innerText = minesCount;
        }
    }

    elCell.classList.remove("back");
    elCell.classList.remove("flag");
    gBoard[cellCoord.i][cellCoord.j].isShown = true;
}

function renderFlagCell(elCell) {
    elCell.classList.add("flag");
    elCell.innerText = gFlag;
    elCell.classList.remove("back");
}
function renderUnFlagCell(elCell) {
    elCell.innerText = '';
    elCell.classList.remove("flag");
    elCell.classList.add("back");
}