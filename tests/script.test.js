import { 
    setGridSize,
    getGridSize,
    handleCellClick, 
    checkResult, 
    resetGame, 
    generateSpecialCells 
} from '../src/resource/script';

describe('Tic-Tac-Toe Game', () => {

    document.body.innerHTML = `
    <div id="turnIndicator"></div>
    <div id="message"></div>
    <div id="grid"></div>
    `; 

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
    }
    
    beforeEach(() => {
        resetGame(); // 各テストの前にゲームをリセット
    });

    test('should set grid size correctly', () => {
        setGridSize(4);
        expect(getGridSize()).toBe(4); // gridSizeが4になっていることを確認
    });

    test('should handle cell click and update game state', () => {
        const mockEvent = { target: { getAttribute: () => 0 } };
        
        handleCellClick(mockEvent);
        
        expect(gameState[0]).toBe('○'); // 先手プレイヤーが'○'を置くことを確認
        expect(currentPlayer).toBe('×'); // 次のプレイヤーが'×'になることを確認
    });

    test('should check winning conditions', () => {
        gameState = ['○', '○', '○', '', '', '', '', '', ''];
        checkResult();
        expect(message.textContent).toBe('プレイヤー ○ の勝ちです！'); // 勝者が正しく表示されることを確認
    });

    test('should reset the game', () => {
        currentPlayer = '×'; // 状態を変更
        gameActive = false;
        resetGame();
        expect(currentPlayer).toBe('○'); // ゲームリセット後、プレイヤーが'○'に戻ることを確認
        expect(gameActive).toBe(true); // ゲームがアクティブになることを確認
        expect(gameState).toEqual(Array(9).fill('')); // グリッドの状態が初期化されることを確認
    });

    test('should generate special cells correctly', () => {
        document.body.innerHTML = `
            <input id="bonusCount" value="1"/>
            <input id="trapCount" value="1"/>
        `;
        generateSpecialCells();
        
        expect(bonusCells.length).toBe(1); // ボーナスマスの数が1であることを確認
        expect(trapCells.length).toBe(1); // トラップマスの数が1であることを確認
    });
});
