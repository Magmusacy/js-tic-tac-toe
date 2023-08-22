const player = (name, mark) => {
    return {name, mark};
};

const playerAi = (name, mark) => {
    const prototype = player(name, mark);
    const isAi = true;

    const makeMove = () => {
        const availablePositions = gameBoard.getEmptyCells();
        const {row, col} = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        return gameBoard.addMark(row, col, mark);
    };

    return Object.assign({}, prototype, {isAi, makeMove});
};

const gameBoard = (() => {
    let board;

    const getBoard = () => board;

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

    return {getBoard, addMark, isBoardFull, checkForWinner, initializeNewBoard, getEmptyCells};
})();

const displayController = (() => {
    const boardDiv = document.querySelector('#board');
    const gameAlertDiv = document.querySelector('#game-alert');
    const gameStartForm = document.querySelector('.initialize-game');
    const restartGameButton = document.querySelector('#restart-game');

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
        playerOneName = this.elements['player-one'].value;
        playerTwoName = this.elements['player-two'].value;
        gameStartForm.classList.add('fade-out')
        boardDiv.classList.add('fade-in');
        gameFlow.startGame(playerOneName, playerTwoName);
    };

    function restartGameHandler() {
        gameFlow.restartGame();
    };

    boardDiv.addEventListener('click', boardClickHandler);
    gameStartForm.addEventListener('submit', gameStartFormHandler);
    restartGameButton.addEventListener('click', restartGameHandler);

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
    
    const startGame = (playerOneName, playerTwoName, enabledAi = false) => {
        playerOne = player(playerOneName, 'X');
        playerTwo = enabledAi ? playerAi('AI', 'O') : player(playerTwoName, 'O');
        setupGame();
    };

    const endGame = () => {
        gameEnded = true;
        displayController.displayRestartButton();
    };

    const restartGame = () => {
        gameBoard.initializeNewBoard();
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
