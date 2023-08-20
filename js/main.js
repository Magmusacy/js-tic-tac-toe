const Player = (name, mark) => {
    return {name, mark}
}

const gameBoard = (() => {
    let board = [
                // Populated for testing purposes
                 ['', '', 'X'],
                 ['O', 'X', 'X'],
                 ['X', '', '']
                ];

    const addMark = (row, col, mark) => {
        if (
            row >= 0 && row < 3 &&
            col >= 0 && col < 3 &&
            board[row][col] === ''
           ) {
            board[row][col] = mark;
            return true
        };
        return false
    };

    const isBoardFull = () => {
        return board.filter(row => row.filter(col => col === '').length).length === 0;
    };

    const checkForWinner = (playerMark) => {
        // Check rows
        for (const row of board) {
            if (row[0] === playerMark && row[1] === playerMark && row[2] === playerMark) {
                return true;
            }
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

    return {board, addMark, isBoardFull, checkForWinner};
})();

const displayController = (() => {
    const drawBoard = () => {
        const board = document.querySelector('#board');
        board.innerHTML = "";
        for (const row of gameBoard.board) {
            for (const column of row) {
                const newElement = `<button class="cell unselectable">${column}</button>`
                board.insertAdjacentHTML("beforeend", newElement);
            };
        };
    };

    return {drawBoard};
})();

const gameFlow = (() => {
    const startGame = () => {
        displayController.drawBoard();
    };

    return {startGame};
})();

gameFlow.startGame();