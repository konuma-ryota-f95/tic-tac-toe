const grid = document.getElementById('grid');
const message = document.getElementById('message');
let currentPlayer = '○';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

grid.addEventListener('click', function(event) {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;

    const index = cell.getAttribute('data-index');

    if (gameState[index] !== '' || !gameActive) {
        return;
    }

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkResult();
    currentPlayer = currentPlayer === '○' ? '×' : '○';
});

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `プレイヤー ${currentPlayer} の勝ちです！`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        message.textContent = '引き分けです！';
        gameActive = false;
        return;
    }
}

function resetGame() {
    currentPlayer = '○';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = '';
    Array.from(grid.children).forEach(cell => {
        cell.textContent = '';
    });
}