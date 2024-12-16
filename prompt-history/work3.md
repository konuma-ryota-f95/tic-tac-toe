3×3マスと4×4マスの○×ゲームを切り替えられるように、以下のコードを修正します。HTMLファイルにボタンを追加して、マスのサイズを選択できるようにし、それに基づいてゲームの状態を更新するようにします。

### 1. HTML ファイル (index.html)

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>○×ゲーム</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div>
        <button onclick="setGridSize(3)">3x3 マス</button>
        <button onclick="setGridSize(4)">4x4 マス</button>
    </div>
    <div class="grid" id="grid"></div>
    <div class="message" id="message"></div>
    <button onclick="resetGame()">リセット</button>

    <script src="script.js"></script>
</body>
</html>
```

### 2. CSS ファイル (styles.css)

```css
.grid {
    display: grid;
    grid-gap: 5px;
}
.cell {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    border: 1px solid #000;
    cursor: pointer;
}
.message {
    margin-top: 20px;
    font-size: 1.5em;
}
```

### 3. JavaScript ファイル (script.js)

```javascript
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
```

### 説明

- **gridSize**: 現在のマスのサイズ（3または4）を保持する変数です。
- **setGridSize**: ボタンがクリックされたときに呼び出され、選択されたサイズでゲームをリセットします。
- **createGrid**: 指定されたサイズに応じてグリッドを生成します。
- **winningConditions**: 各サイズの勝利条件を格納しています。

この構成により、ユーザーは「3x3 マス」と「4x4 マス」を切り替えて遊ぶことができます。他に質問があればお知らせください！