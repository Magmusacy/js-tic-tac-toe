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
        for (let row = 0; row < 3; row++) {
            if (board[row][0] === playerMark && board[row][1] === playerMark && board[row][2] === playerMark) {
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

    boardDiv.addEventListener('click', boardClickHandler);

    return {drawBoard};
})();

const gameFlow = (() => {
    const playerOne = player('player_one', 'X');
    const playerTwo = player('player_two', 'O');
    let currentPlayer = playerOne;

    const changeCurrentPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne; 
    };

    const playRound = (row, col) => {
        gameBoard.addMark(row, col, currentPlayer.mark);
        console.log(gameBoard.checkForWinner(currentPlayer.mark), gameBoard.isBoardFull());
        changeCurrentPlayer();
    };

    const startGame = () => {
        displayController.drawBoard();
    };

    return {startGame, playRound};
})();

gameFlow.startGame();