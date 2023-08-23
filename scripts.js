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

const Space = () => {
    let value = " ";

    const getValue = () => value;

    const addMark = (player) => {
        if (value === " ") {
            value = player.symbol;
        };
    };

    return { getValue, addMark };
};

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
        Gameboard.markSpace(space, getActivePlayer);
        switchPlayer();
    }

    return { getActivePlayer, switchPlayer, playRound };

})();

const DisplayController = (() => {

})();