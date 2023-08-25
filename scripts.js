const Space = () => {
    let value = " ";

    let winning = false;

    const getValue = () => value;

    const getWinning = () => winning;

    const toggleWinning = () => {
        winning = true;
    }
    const isOpen = () => value === " ";

    const addMark = (player) => {
        value = player.getSymbol();
    };

    const reset = () => {
        value = " ";
        winning = false;
    }

    return { getValue, addMark, isOpen, getWinning, toggleWinning, reset };
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
    const board = Gameboard.getBoard();
    const possibleWins = [
        board.slice(0, 3), 
        board.slice(3, 6), 
        board.slice(6), 
        [board[0], board[3], board[6]],
        [board[1], board[4], board[7]],
        [board[2], board[5], board[8]],
        [board[0], board[4], board[8]],
        [board[2], board[4], board[6]]
    ];
    
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkForWin = () => {
        // const win = [activePlayer.getSymbol(), activePlayer.getSymbol(), activePlayer.getSymbol()];
        for (line of possibleWins) {
            if (line.every(space => space.getValue() === activePlayer.getSymbol())) {
                for (space of line) {
                    space.toggleWinning();
                }
                return line;
            }
        }
        return false;
    }

    const playRound = (space) => {
        Gameboard.markSpace(space, getActivePlayer());
        if (!checkForWin()) {
            switchPlayer();
        };
    };

    const reset = () => {
        board.forEach((space) => {
            space.reset();
        })
    }

    return { getActivePlayer, switchPlayer, playRound, checkForWin, reset };

})();

const DisplayController = (() => {
    const boardDiv = document.querySelector(".board");
    const displayDiv = document.querySelector(".display");

    const updateScreen = () => {
        boardDiv.textContent = "";
        displayDiv.textContent = "";

        const board = Gameboard.getBoard();
        const activePlayer = GameController.getActivePlayer();
        const gameOver = GameController.checkForWin();

        const message = document.createElement("h2");
        message.classList.add("message");
        message.textContent = `${activePlayer.getSymbol()}'s turn`;
        displayDiv.appendChild(message);

        board.forEach((space, index) => {
            const spaceButton = document.createElement("button");
            spaceButton.classList.add("space");
            if (space.getWinning()) {
                spaceButton.classList.add("winning");
            }
            spaceButton.dataset.index = index;
            spaceButton.textContent = space.getValue();
            spaceButton.addEventListener("click", clickHandler);
            boardDiv.appendChild(spaceButton);
        });

        if (gameOver) {
            message.textContent = `${activePlayer.getSymbol()} wins!`;
            const spaces = document.querySelectorAll(".space");
            spaces.forEach((space) => {
                space.removeEventListener("click", clickHandler);
            })
            const resetButton = document.createElement("button");
            resetButton.textContent = "Reset";
            resetButton.classList.add("reset");
            resetButton.addEventListener("click", reset);
            displayDiv.appendChild(resetButton);
        };
    };

    function clickHandler(e) {
        const board = Gameboard.getBoard();
        const selectedSpace = board[e.target.dataset.index];

        if (selectedSpace.isOpen()) {
            GameController.playRound(selectedSpace);           
            updateScreen();
        };
    };

    function reset(e) {
        GameController.reset();
        updateScreen();
    }

    updateScreen();
})();