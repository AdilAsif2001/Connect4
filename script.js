const ROWS = 6;  // number of rows
const COLS = 7;  // number of columns

let board = [];  // 2D array to store game state
let currentPlayer = 1;   // 1 = Red, 2 = Yellow
let gameOver = false;  // stops game when someone wins

// ===== GET HTML ELEMENTS =====
const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

// Initialize board
function initBoard() {
    // Create empty board (6x7 filled with 0)
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    // Clear the board UI
    boardDiv.innerHTML = "";

    // Reset game state
    gameOver = false;
    currentPlayer = 1;

    // Create cells dynamically
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

    updateStatus();  // show current player
}

// Handle click
function handleClick(e) {

    // Stop if game is over
    if (gameOver) return;

    // Get column clicked
    const col = parseInt(e.target.dataset.col);

    // Start from bottom row.
    for (let r = ROWS - 1; r >= 0; r--) {

        // Find first empty spot
        if (board[r][col] === 0) {

            // Place current player's piece
            board[r][col] = currentPlayer;

            // Update UI
            updateUI();

            // Check if this move wins the game
            if (checkWin(r, col)) {
                statusText.textContent = `Player ${currentPlayer} Wins!`;
                gameOver = true;
                return;
            }

            // Check if board is full (draw)
            if (isDraw()) {
                statusText.textContent = "It's a Draw!";
                gameOver = true;
                return;
            }

            // Switch player
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
            return;
        }
    }

    // If column is full
    alert("Column is full!");
}

// Update UI
function updateUI() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;

        // Remove previous colors
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
    // Flatten array and check if all cells are filled
    return board.flat().every(cell => cell !== 0);
}

// Win check
function checkWin(row, col) {

    // Check all 4 directions
    return (
        checkDirection(row, col, 0, 1) ||  // horizontal
        checkDirection(row, col, 1, 0) ||  // vertical
        checkDirection(row, col, 1, 1) ||  // diagonal 
        checkDirection(row, col, 1, -1)    // diagonal 
    );
}

function checkDirection(row, col, dr, dc) {

    let count = 1;  // count current piece

    // Count same pieces in both directions
    count += countCells(row, col, dr, dc);
    count += countCells(row, col, -dr, -dc);

    // If 4 or more → win
    return count >= 4;
}

function countCells(row, col, dr, dc) {
    let r = row + dr;
    let c = col + dc;
    let count = 0;

    // Move in one direction
    while (
        r >= 0 && r < ROWS &&  // inside board vertically
        c >= 0 && c < COLS &&  // inside board horizontally
        board[r][c] === currentPlayer
    ) {
        count++;
        r += dr;  // move row
        c += dc;  // move column
    }

    return count;
}

// Reset
resetBtn.addEventListener("click", initBoard);

// Start game
initBoard();