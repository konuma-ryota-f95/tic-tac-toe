let currentPlayer = '○'; // 現在のプレイヤー
let gameState = []; // ゲーム状態
let gameActive = true; // ゲームがアクティブかどうか
let gridSize = 3;
let specialCellsEnabled = false; // 特殊マスの有無
let trapCells = [];
let bonusCells = [];
let trapOwner = ''; // トラップマスを置いたプレイヤー
let message = '';
let turnIndicator = '';

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

export function setGridSize(size) {
    gridSize = size;
    resetGame();
}

export function getGridSize() {
    return gridSize;
}

function toggleSpecialCells() {
    specialCellsEnabled = document.getElementById('specialCellsToggle').checked;
    resetGame();
}

function updateSpecialCellsUI() {
    const disabled = !specialCellsEnabled;
    
    // 入力フィールドとボタンの活性化/非活性化
    const elements = [
        document.getElementById('bonusCount'),
        document.getElementById('trapCount'),
        document.getElementById('visibleSpecials'),
        document.getElementById('addSpecialCellsButton')
    ];

    elements.forEach((element) => {
        if (element) {
            element.disabled = disabled;
        }
    });
}

function addSpecialCells() {
    specialCellsEnabled = true;
    resetGame();
}

// プレイヤーごとのスキップフラグを初期化
let skipFlags = {
    '○': 0,
    '×': 0
};

// セルをクリックしたときの処理
export function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');
    let nextPlayer = currentPlayer === '○' ? '×' : '○';

    // セルがすでに埋まっているか、ゲームが終了している場合は何もしない
    if (gameState[index] !== '' || !gameActive) {
        return;
    }

    // メッセージをリセット
    if (message) {
        message.textContent = '';
    }

    // プレイヤーの入力処理
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    checkResult(); // 勝者の確認
    if (!gameActive) {
        return; // ゲームが終了しているので、これ以降の処理を行わない
    }

    // トラップマスのチェック
    if (trapCells.includes(parseInt(index))) {
        message.textContent += `${currentPlayer}がトラップマスに置きました！次の${currentPlayer} のターンがスキップされます。`;
        skipFlags[currentPlayer] = 1; // 現在のプレイヤーのスキップフラグを立てる
        cell.classList.remove('hidden');
    }
    
    // ボーナスマスのチェック
    if (bonusCells.includes(parseInt(index))) {
        message.textContent += `\n${currentPlayer}がボーナスマスに置きました！もう一度プレイできます。`;
        skipFlags[nextPlayer] = 1; // 次のプレイヤーのスキップフラグを立てる
        cell.classList.remove('hidden');
    }

    // 次のプレイヤーのスキップフラグを確認
    if (skipFlags[nextPlayer] === 1) {
        message.textContent += `\n${nextPlayer}のターンがスキップされました。`;
        skipFlags[nextPlayer] = 0; // スキップフラグをリセット
        // 現在のプレイヤーのターンを維持
    } else {
        // 次のプレイヤーに切り替え
        currentPlayer = nextPlayer;
    }
    turnIndicator.textContent = `現在のターン: ${currentPlayer}`;

}

// 勝利条件をチェックする関数
export function checkResult() {
    let roundWon = false;

    for (const condition of winningConditions[gridSize]) {
        const [a, b, c, d, e] = condition;
        if (
            gameState[a] && 
            gameState[a] === gameState[b] && 
            gameState[a] === gameState[c] &&
            (d === undefined || gameState[a] === gameState[d]) &&
            (e === undefined || gameState[a] === gameState[e])
        ) {
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
export function resetGame() {
    currentPlayer = '○';
    gameActive = true;
    bonusCells = []; // 初期化
    trapCells = [];  // 初期化
    message = document.getElementById('message');
    turnIndicator = document.getElementById('turnIndicator');

    if (message) {
        message.textContent = '';
    }
    if (turnIndicator) {
        turnIndicator.textContent = `現在のターン: ${currentPlayer}`;
    }

    createGrid();

    gameState = Array(gridSize * gridSize).fill('');
    
    // 特殊マスのUIを初期化
    updateSpecialCellsUI();

    // 最大値を更新
    const maxCells = gridSize * gridSize;
    const bonusCountElement = document.getElementById('bonusCount');
    const trapCountElement = document.getElementById('trapCount');

    if (bonusCountElement) {
        bonusCountElement.max = maxCells;
    }
    if (trapCountElement) {
        trapCountElement.max = maxCells;
    }
}

// 特殊マスのインデックスを生成する関数
export function generateSpecialCells() {
    const totalCells = gridSize * gridSize;
    const bonusCount = parseInt(document.getElementById('bonusCount').value);
    const trapCount = parseInt(document.getElementById('trapCount').value);

    // ボーナスマスとトラップマスの数がセルの数を超える場合のチェック
    if (bonusCount + trapCount > totalCells) {
        message.textContent = 'ボーナスマスとトラップマスの合計はセルの数を超えてはいけません！';
        return; // 処理を中断
    }

    let attempts = 0; // 試行回数をカウント
    const maxAttempts = 100; // 最大試行回数を設定

    // ボーナスマスの生成
    bonusCells = [];
    while (bonusCells.length < bonusCount && attempts < maxAttempts) {
        let randomIndex = Math.floor(Math.random() * totalCells);
        if (!bonusCells.includes(randomIndex) && !trapCells.includes(randomIndex)) {
            bonusCells.push(randomIndex);
        }
        attempts++;
    }

    // トラップマスの生成
    attempts = 0;// 再度試行回数を初期化
    trapCells = [];
    while (trapCells.length < trapCount && attempts < maxAttempts) {
        let randomIndex = Math.floor(Math.random() * totalCells);
        if (!trapCells.includes(randomIndex) && !bonusCells.includes(randomIndex)) {
            trapCells.push(randomIndex);
        }
        attempts++;
    }
}

// グリッドを生成する関数
function createGrid() {
    const grid = document.getElementById('grid');
    if (grid){
        grid.innerHTML = ''; // 初期化
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    }

    if (specialCellsEnabled) {
        generateSpecialCells(); // 特殊マスを生成
    }

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);

        // 特殊マスのスタイルを適用
        if (bonusCells.includes(i)) {
            cell.classList.add('bonus');
            if (document.getElementById('visibleSpecials').value === 'false') {
                cell.classList.add('hidden');
            }
        }
        if (trapCells.includes(i)) {
            cell.classList.add('trap');
            if (document.getElementById('visibleSpecials').value === 'false') {
                cell.classList.add('hidden');
            }
        }

        cell.addEventListener('click', handleCellClick);
        if (grid) {
            grid.appendChild(cell);
        }
    }
}

// デフォルトは3x3マスで開始
setGridSize(3);
