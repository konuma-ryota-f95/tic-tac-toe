このコードをhtml、css、javascriptごとにファイルを分けてください

もちろん、HTML、CSS、JavaScriptをそれぞれ別のファイルに分ける方法をご紹介します。

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
    <div class="grid" id="grid">
        <div class="cell" data-index="0"></div>
        <div class="cell" data-index="1"></div>
        <div class="cell" data-index="2"></div>
        <div class="cell" data-index="3"></div>
        <div class="cell" data-index="4"></div>
        <div class="cell" data-index="5"></div>
        <div class="cell" data-index="6"></div>
        <div class="cell" data-index="7"></div>
        <div class="cell" data-index="8"></div>
    </div>
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
    grid-template-columns: repeat(3, 100px);
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
```

### ファイル構成

これらのファイルを以下のように同じディレクトリに保存してください。

```
/your-project-directory
│
├── index.html
├── styles.css
└── script.js
```

この構成で、`index.html` をブラウザで開くことで、○×ゲームを実行できます。他に質問があればお知らせください！