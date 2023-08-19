const Player = (name, mark) => {
    return {name, mark}
}

const gameBoard = (() => {
    let board = [
                // Populated for testing purposes
                 ['', '', 'X'],
                 ['O', 'X', ''],
                 ['X', '', '']
                ];
    return {board}
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