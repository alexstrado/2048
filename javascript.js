let board;
let score = 0;
let hasMerged;

const gridContainer = document.getElementById('grid-container');
const scoreElement = document.getElementById('score');

function initBoard() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    hasMerged = Array(4).fill().map(() => Array(4).fill(false));
    updateBoard();
    spawnNewTile();
    spawnNewTile();
}

function updateBoard() {
    gridContainer.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const gridCell = document.createElement('div');
            gridCell.classList.add('grid-cell');
            if (cell !== 0) {
                gridCell.dataset.value = cell;
                gridCell.innerText = cell;
            }
            gridContainer.appendChild(gridCell);
        });
    });
    scoreElement.innerText = score;
}

function spawnNewTile() {
    let emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) emptyCells.push([row, col]);
        }
    }

    if (emptyCells.length === 0) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
    updateBoard();
}

function move(direction) {
    switch (direction) {
        case 'left':
            slideLeft();
            break;
        case 'right':
            slideRight();
            break;
        case 'up':
            slideUp();
            break;
        case 'down':
            slideDown();
            break;
    }
    spawnNewTile();
    hasMerged = Array(4).fill().map(() => Array(4).fill(false));
}

function slideLeft() {
    for (let row = 0; row < 4; row++) {
        let newRow = board[row].filter(val => val !== 0);
        let mergedRow = [];
        let i = 0;
        while (i < newRow.length) {
            if (i + 1 < newRow.length && newRow[i] === newRow[i + 1] && !hasMerged[row][i]) {
                mergedRow.push(newRow[i] * 2);
                score += newRow[i] * 2;
                hasMerged[row][i] = true;
                i += 2;
            } else {
                mergedRow.push(newRow[i]);
                i++;
            }
        }
        while (mergedRow.length < 4) {
            mergedRow.push(0);
        }
        board[row] = mergedRow;
    }
    updateBoard();
}

function slideRight() {
    for (let row = 0; row < 4; row++) {
        board[row].reverse();
    }
    slideLeft();
    for (let row = 0; row < 4; row++) {
        board[row].reverse();
    }
    updateBoard();
}

function slideUp() {
    board = transpose(board);
    slideLeft();
    board = transpose(board);
    updateBoard();
}

function slideDown() {
    board = transpose(board);
    slideRight();
    board = transpose(board);
    updateBoard();
}

function transpose(board) {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
});

initBoard();
