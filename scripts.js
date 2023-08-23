const Space = () => {
    let value = " ";

    const getValue = () => value;

    const isOpen = () => value === " ";

    const addMark = (player) => {
        value = player.getSymbol();
    };

    return { getValue, addMark, isOpen };
};


const Gameboard = (() => {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(Space());
    };

    const getBoard = () => board;

    const markSpace = (space, player) => {
        space.addMark(player);
    }

    return { getBoard, markSpace };
})();


const Player = (symbol) => {

    const getSymbol = () => symbol;
    
    return { getSymbol };
};

const GameController = (() => {
    const players = [Player("X"), Player("O")];
    
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (space) => {
        Gameboard.markSpace(space, getActivePlayer());
        switchPlayer();
    }

    return { getActivePlayer, switchPlayer, playRound };

})();

const DisplayController = (() => {
    const boardDiv = document.querySelector(".board");
    const activeDiv = document.querySelector(".active");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = Gameboard.getBoard();
        const activePlayer = GameController.getActivePlayer();

        activeDiv.textContent = `${activePlayer.getSymbol()}'s turn`

        board.forEach((space, index) => {
            const spaceButton = document.createElement("button");
            spaceButton.classList.add("space");
            spaceButton.dataset.index = index;
            spaceButton.textContent = space.getValue();
            spaceButton.addEventListener("click", clickHandler);
            boardDiv.appendChild(spaceButton);
        });
    };

    function clickHandler(e) {
        const board = Gameboard.getBoard();
        const selectedSpace = board[e.target.dataset.index];
        if (selectedSpace.isOpen()) {
            GameController.playRound(selectedSpace);
            updateScreen();
        };
    };

    updateScreen();
})();