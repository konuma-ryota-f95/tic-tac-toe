let currentPlayer = '○'; // 現在のプレイヤー
let gameState = []; // ゲーム状態
let gameActive = true; // ゲームがアクティブかどうか
let gridSize = 3;
let specialCellsEnabled = false; // 特殊マスの有無
let trapCellIndex; // トラップマスのインデックス
let bonusCellIndex; // ボーナスマスのインデックス
let trapOwner; // トラップマスを置いたプレイヤー
const message = document.getElementById('message');
const turnIndicator = document.getElementById('turnIndicator');

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
    ],
    5: [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ]
};

function setGridSize(size) {
    gridSize = size;
    resetGame();
    createGrid();
}

function toggleSpecialCells() {
    specialCellsEnabled = !specialCellsEnabled;
    resetGame();
}

// グリッドを生成する関数
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // 初期化
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gameState = Array(gridSize * gridSize).fill('');

    if (specialCellsEnabled) {
        generateSpecialCells(); // 特殊マスを生成
    }

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);

        // 特殊マスのスタイルを適用
        if (i === bonusCellIndex) {
            cell.classList.add('bonus');
        }
        if (i === trapCellIndex) {
            cell.classList.add('trap');
        }

        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
}

// プレイヤーごとのスキップフラグを初期化
let skipFlags = {
    '○': 0,
    '×': 0
};

// セルをクリックしたときの処理
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');
    let nextPlayer = currentPlayer === '○' ? '×' : '○';

    // セルがすでに埋まっているか、ゲームが終了している場合は何もしない
    if (gameState[index] !== '' || !gameActive) {
        return;
    }

    // メッセージをリセット
    message.textContent = '';

    // プレイヤーの入力処理
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    checkResult(); // 勝者の確認
    if (!gameActive) {
        return; // ゲームが終了しているので、これ以降の処理を行わない
    }

    // トラップマスのチェック
    if (index == trapCellIndex) {
        message.textContent += `${currentPlayer} がトラップマスに置きました！次の${currentPlayer} のターンがスキップされます。`;
        skipFlags[currentPlayer] = 1; // 現在のプレイヤーのスキップフラグを立てる
    }
    
    // ボーナスマスのチェック
    if (index == bonusCellIndex) {
        message.textContent += `\n${currentPlayer} がボーナスマスに置きました！もう一度プレイできます。`;
        skipFlags[nextPlayer] = 1; // 次のプレイヤーのスキップフラグを立てる
    }

    // 次のプレイヤーのスキップフラグを確認
    if (skipFlags[nextPlayer] === 1) {
        message.textContent += `\n${nextPlayer} のターンがスキップされました。`;
        skipFlags[nextPlayer] = 0; // スキップフラグをリセット
        // 現在のプレイヤーのターンを維持
    } else {
        // 次のプレイヤーに切り替え
        currentPlayer = nextPlayer;
    }
    turnIndicator.textContent = `現在のターン: ${currentPlayer}`;
}

// 勝利条件をチェックする関数
function checkResult() {
    let roundWon = false;

    for (const condition of winningConditions[gridSize]) {
        const [a, b, c, d, e] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c] &&
            (d === undefined || gameState[a] === gameState[d]) &&
            (e === undefined || gameState[a] === gameState[e])) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `プレイヤー ${currentPlayer} の勝ちです！`;
        turnIndicator.textContent = '';
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        message.textContent = '引き分けです！';
        turnIndicator.textContent = '';
        gameActive = false;
        return;
    }
}

// ゲームをリセットする関数
function resetGame() {
    currentPlayer = '○';
    gameActive = true;
    bonusCellIndex = null; // 初期化
    trapCellIndex = null;  // 初期化
    message.textContent = '';
    turnIndicator.textContent = `現在のターン: ${currentPlayer}`;
    createGrid();
}

// 特殊マスのインデックスを生成する関数
function generateSpecialCells() {
    const totalCells = gridSize * gridSize;

    bonusCellIndex = Math.floor(Math.random() * totalCells);
    trapCellIndex = Math.floor(Math.random() * totalCells);

    while (trapCellIndex === bonusCellIndex) {
        trapCellIndex = Math.floor(Math.random() * totalCells); // ボーナスマスと重ならないようにする
    }
}

// デフォルトは3x3マスで開始
setGridSize(3);
