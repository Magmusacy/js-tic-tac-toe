const player = (name, mark) => {
    return {name, mark};
};

const stupidAi = (mark) => {
    const makeMove = () => {
        const availablePositions = gameBoard.getEmptyCells();
        const {row, col} = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        return gameBoard.addMark(row, col, mark);
    };

    return {makeMove};
};

const smartAi = () => {
    const MIN_MARK = 'O';
    const MAX_MARK = 'X';

    const makeMove = () => {
        const originalState = gameBoard.getBoard();
        let bestScore = Infinity;
        let bestMove;
        for (const possibleMove of gameBoard.getEmptyCells()) {
            const copyBoardState = copyBoardMove(originalState, possibleMove.row, possibleMove.col, MIN_MARK)
            let score = minimax(copyBoardState, true);
            gameBoard.setBoard(originalState);
            if (score < bestScore) {
                bestScore = score;
                bestMove = possibleMove;
            }
        };

        return gameBoard.addMark(bestMove.row, bestMove.col, MIN_MARK);
    };
    
    const minimax = (boardState, maximizingPlayer) => {
        gameBoard.setBoard(boardState)

        // Check for terminal state
        if (gameBoard.checkForWinner(MAX_MARK)) {
            return 1;
        } else if (gameBoard.checkForWinner(MIN_MARK)) {
            return -1;
        } else if (gameBoard.isBoardFull()) {
            return 0;
        };

        if (maximizingPlayer) {
            let bestScore = -Infinity;
            for (const possibleMove of gameBoard.getEmptyCells()) {
                const copyBoardState = copyBoardMove(boardState, possibleMove.row, possibleMove.col, MAX_MARK);
                let score = minimax(copyBoardState, false);
                bestScore = Math.max(score, bestScore);
            }

            return bestScore;
        } else {
            let bestScore = Infinity;
            for (const possibleMove of gameBoard.getEmptyCells()) {
                const copyBoardState = copyBoardMove(boardState, possibleMove.row, possibleMove.col, MIN_MARK);
                let score = minimax(copyBoardState, true);
                bestScore = Math.min(score, bestScore);
            }

            return bestScore;
        };
    };

    const copyBoardMove = (state, row, col, mark) => {
        gameBoard.setBoard(cloneBoardState(state));
        gameBoard.addMark(row, col, mark)
        return gameBoard.getBoard();
    };

    const cloneBoardState = state => state.map(row => [...row]);
    
    return {makeMove};
};

const playerAi = (name, mark, aiType) => {
    const prototype = player(name, mark);
    const isAi = true;
    let aiModel;

    if (aiType === 'ai-stupid') {
        aiModel = stupidAi(mark);
    } else if (aiType === 'ai-smart') {
        aiModel = smartAi(mark);
    };

    return Object.assign({}, aiModel, prototype, {isAi});
};

const gameBoard = (() => {
    let board;

    const getBoard = () => board;

    const setBoard = newBoard => board = newBoard;

    const initializeNewBoard = () => {
        board = 
           [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
           ];
    };

    const addMark = (row, col, mark) => {
        if (
            row >= 0 && row < 3 &&
            col >= 0 && col < 3 &&
            board[row][col] === ''
           ) {
            board[row][col] = mark;
            return true;
        };
        return false;
    };

    const isBoardFull = () => {
        return board.filter(row => row.filter(col => col === '').length).length === 0;
    };

    const checkForWinner = (playerMark) => {
        // Check rows
        for (const row of board) {
            if (row[0] === playerMark && row[1] === playerMark && row[2] === playerMark) {
                return true;
            };
        };

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] === playerMark && board[1][col] === playerMark && board[2][col] === playerMark) {
                return true;
            };
        };

        // Check diagonally
        if (
            board[0][0] === playerMark && board[1][1] === playerMark && board[2][2] === playerMark ||
            board[0][2] === playerMark && board[1][1] === playerMark && board[2][0] === playerMark
           ) {
                return true;
            };

        return false;
    };

    const getEmptyCells = () => {
        const emptyCells = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') emptyCells.push({row, col});
            };
        };

        return emptyCells;
    };

    initializeNewBoard()

    return {getBoard, setBoard, addMark, isBoardFull, checkForWinner, initializeNewBoard, getEmptyCells};
})();

const displayController = (() => {
    const boardDiv = document.querySelector('#board');
    const gameAlertDiv = document.querySelector('#game-alert');
    const gameStartForm = document.querySelector('.initialize-game');
    const restartGameButton = document.querySelector('#restart-game');
    const gamemodeSelector = document.querySelector('#gamemode');

    // Since we update after current user made his move, the color of that user is correct if he's made winning move :)
    const updateGameTurn = (playerName, mark) => {
        gameAlertDiv.textContent = `${playerName}'s turn`;
        if (mark === 'X') {
            gameAlertDiv.classList.add('player-one')
            gameAlertDiv.classList.remove('player-two')
        } else {
            gameAlertDiv.classList.add('player-two')
            gameAlertDiv.classList.remove('player-one')
        }
    };
    
    const displayWin = (playerName) => {
        gameAlertDiv.textContent = `${playerName} won!`;
    };

    const displayTie = () => {
        gameAlertDiv.textContent = 'Tie!';
    };
    
    const drawBoard = () => {
        const board = gameBoard.getBoard();
        let colorClass;
        boardDiv.innerHTML = "";
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === 'X') colorClass = 'player-one';
                else if (board[row][col] === 'O') colorClass = 'player-two';
                const newElement = `<button class="cell unselectable ${colorClass}" data-col="${col}" data-row="${row}">${board[row][col]}</button>`;
                boardDiv.insertAdjacentHTML("beforeend", newElement);
            };
        };
    };

    const displayRestartButton = () => {
        restartGameButton.classList.remove('hide');
    };

    const hideRestartButton = () => {
        restartGameButton.classList.add('hide');
    }

    function boardClickHandler(e) {
        const clickedCol = e.target.dataset.col;
        const clickedRow = e.target.dataset.row;

        // Check whether the user clicked on a legal cell
        if (clickedCol && clickedRow) {
            gameFlow.playRound(clickedRow, clickedCol);
            displayController.drawBoard();
        } 
    }

    function gameStartFormHandler(e) {
        e.preventDefault();
        const playerOneName = this.elements['player-one'].value;
        const playerTwoName = this.elements['player-two'].value;
        const selectedGamemode = this.elements['gamemode'].value;
        if (selectedGamemode === 'default') {
            gameFlow.startGame(playerOneName, playerTwoName);
        } else {
            gameFlow.startGame(playerOneName, playerTwoName, selectedGamemode);
        };
        gameStartForm.classList.add('fade-out')
        boardDiv.classList.add('fade-in');
    };

    function restartGameHandler() {
        gameFlow.restartGame();
    };

    function gamemodeSelectorHandler(e) {
        const playerTwo = document.querySelector('#player-two');
        if (this.value === 'default') {
            playerTwo.removeAttribute('disabled');
            return;
        };
        playerTwo.setAttribute('disabled', '');
    };

    boardDiv.addEventListener('click', boardClickHandler);
    gameStartForm.addEventListener('submit', gameStartFormHandler);
    restartGameButton.addEventListener('click', restartGameHandler);
    gamemodeSelector.addEventListener('change', gamemodeSelectorHandler);

    return {drawBoard, updateGameTurn, displayWin, displayTie, displayRestartButton, hideRestartButton};
})();

const gameFlow = (() => {
    let playerOne;
    let playerTwo; 
    let gameEnded;
    let currentPlayer;

    const setupGame = () => {
        gameEnded = false;
        currentPlayer = playerOne;
        displayController.drawBoard();
        displayController.updateGameTurn(currentPlayer.name, currentPlayer.mark);
        displayController.hideRestartButton();
    };
    
    const startGame = (playerOneName, playerTwoName, aiType = null) => {
        playerOne = player(playerOneName, 'X');
        if (aiType === null) {
            playerTwo = player(playerTwoName, 'O');
        } else {
            playerTwo = playerAi('AI', 'O', aiType);
        };
        setupGame();
    };

    const endGame = () => {
        gameEnded = true;
        displayController.displayRestartButton();
    };

    const restartGame = () => {
        gameBoard.initializeNewBoard();
        console.log(gameBoard.board)
        setupGame();
    };

    const changeCurrentPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne; 
    };

    const playRound = (row, col) => {
        if (gameEnded) return;
        const move = currentPlayer.isAi ? currentPlayer.makeMove() : gameBoard.addMark(row, col, currentPlayer.mark);

        if (gameBoard.checkForWinner(currentPlayer.mark)) {
            displayController.displayWin(currentPlayer.name, currentPlayer.mark);
            endGame();
        } else if (gameBoard.isBoardFull()) {
            displayController.displayTie();
            endGame();
        } else if (move) {
            changeCurrentPlayer();
            displayController.updateGameTurn(currentPlayer.name, currentPlayer.mark);
            if (currentPlayer.isAi) {
                // Don't have to supply row and col arguments since AI hsa it's own method of choosing those
                playRound();
            };
        };
    };

    return {startGame, playRound, restartGame};
})();
