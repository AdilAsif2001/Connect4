const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 1;
let gameOver = false;

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

// Initialize board
function initBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    boardDiv.innerHTML = "";
    gameOver = false;
    currentPlayer = 1;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", handleClick);
            boardDiv.appendChild(cell);
        }
    }

    updateStatus();
}

// Handle click
function handleClick(e) {
    if (gameOver) return;

    const col = parseInt(e.target.dataset.col);

    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            board[r][col] = currentPlayer;
            updateUI();

            if (checkWin(r, col)) {
                statusText.textContent = `Player ${currentPlayer} Wins!`;
                gameOver = true;
                return;
            }

            if (isDraw()) {
                statusText.textContent = "It's a Draw!";
                gameOver = true;
                return;
            }

            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
            return;
        }
    }

    alert("Column is full!");
}

// Update UI
function updateUI() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;

        cell.classList.remove("red", "yellow");

        if (board[r][c] === 1) {
            cell.classList.add("red");
        } else if (board[r][c] === 2) {
            cell.classList.add("yellow");
        }
    });
}

// Status text
function updateStatus() {
    statusText.textContent =
        currentPlayer === 1
            ? "Player 1's Turn (Red)"
            : "Player 2's Turn (Yellow)";
}

// Draw check
function isDraw() {
    return board.flat().every(cell => cell !== 0);
}

// Win check
function checkWin(row, col) {
    return (
        checkDirection(row, col, 0, 1) ||  // horizontal
        checkDirection(row, col, 1, 0) ||  // vertical
        checkDirection(row, col, 1, 1) ||  // diagonal \
        checkDirection(row, col, 1, -1)    // diagonal /
    );
}

function checkDirection(row, col, dr, dc) {
    let count = 1;

    count += countCells(row, col, dr, dc);
    count += countCells(row, col, -dr, -dc);

    return count >= 4;
}

function countCells(row, col, dr, dc) {
    let r = row + dr;
    let c = col + dc;
    let count = 0;

    while (
        r >= 0 && r < ROWS &&
        c >= 0 && c < COLS &&
        board[r][c] === currentPlayer
    ) {
        count++;
        r += dr;
        c += dc;
    }

    return count;
}

// Reset
resetBtn.addEventListener("click", initBoard);

// Start game
initBoard();