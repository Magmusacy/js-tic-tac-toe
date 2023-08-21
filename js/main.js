const player = (name, mark) => {
    return {name, mark};
};

const gameBoard = (() => {
    let board = [
                 ['', '', ''],
                 ['', '', ''],
                 ['', '', '']
                ];

    const getBoard = () => board;

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

    return {getBoard, addMark, isBoardFull, checkForWinner};
})();

const displayController = (() => {
    const board = gameBoard.getBoard();
    const boardDiv = document.querySelector('#board');
    const gameAlertDiv = document.querySelector('#game-alert');
    const gameStartForm = document.querySelector('.initialize-game');

    const updateGameTurn = (playerName) => {
        gameAlertDiv.textContent = `${playerName}'s turn`;
    };

    const displayWin = (playerName) => {
        gameAlertDiv.textContent = `${playerName} won!`;
    };

    const displayTie = () => {
        gameAlertDiv.textContent = 'Tie!';
    };

    const drawBoard = () => {
        boardDiv.innerHTML = "";
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const newElement = `<button class="cell unselectable" data-col="${col}" data-row="${row}">${board[row][col]}</button>`;
                boardDiv.insertAdjacentHTML("beforeend", newElement);
            };
        };
    };

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

    boardDiv.addEventListener('click', boardClickHandler);
    gameStartForm.addEventListener('submit', gameStartFormHandler);

    return {drawBoard, updateGameTurn, displayWin, displayTie};
})();

const gameFlow = (() => {
    const playerOne = player('', 'X');
    const playerTwo = player('', 'O');
    let gameEnded = false;
    let currentPlayer = playerOne;
    
    const startGame = (playerOneName, playerTwoName) => {
        displayController.drawBoard();
        playerOne.name = playerOneName;
        playerTwo.name = playerTwoName;
    };

    const changeCurrentPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne; 
    };

    const playRound = (row, col) => {
        if (gameEnded) return;

        const move = gameBoard.addMark(row, col, currentPlayer.mark);
        if (gameBoard.checkForWinner(currentPlayer.mark)) {
            displayController.displayWin(currentPlayer.name);
            gameEnded = true;
        } else if (gameBoard.isBoardFull()) {
            displayController.displayTie();
            gameEnded = true;
        } else if (move) {
            displayController.updateGameTurn(currentPlayer.name);
            changeCurrentPlayer();
        };
    };

    return {startGame, playRound};
})();
