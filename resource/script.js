let currentPlayer = '○';
let gameState = [];
let gameActive = true;
let gridSize = 3;

const winningConditions = {
    3: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    4: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12]
    ]
};

function setGridSize(size) {
    gridSize = size;
    resetGame();
    createGrid();
}

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // 初期化
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gameState = Array(gridSize * gridSize).fill('');

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (gameState[index] !== '' || !gameActive) {
        return;
    }

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkResult();
    currentPlayer = currentPlayer === '○' ? '×' : '○';
}

function checkResult() {
    let roundWon = false;

    for (const condition of winningConditions[gridSize]) {
        const [a, b, c, d] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c] && (d === undefined || gameState[a] === gameState[d])) {
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
    gameActive = true;
    message.textContent = '';
    createGrid();
}

// デフォルトは3x3マスで開始
setGridSize(3);
