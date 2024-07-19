const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    return {
        getBoard,
        resetBoard,
        setCell,
    };
})();

const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
};

const GameController = (() => {
    let player1, player2, currentPlayer;
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        Gameboard.resetBoard();
        DisplayController.updateBoard();
        DisplayController.setMessage(`${currentPlayer.getName()}'s turn`);
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        DisplayController.setMessage(`${currentPlayer.getName()}'s turn`);
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes("") ? null : "Tie";
    };

    const playTurn = (index) => {
        if (Gameboard.setCell(index, currentPlayer.getMarker())) {
            DisplayController.updateBoard();
            const winner = checkWinner();
            if (winner) {
                DisplayController.setMessage(winner === "Tie" ? "It's a Tie!" : `${currentPlayer.getName()} wins!`);
            } else {
                switchPlayer();
            }
        }
    };

    return {
        startGame,
        playTurn,
    };
})();

const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const gameInfo = document.getElementById("game-info");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");

    cells.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            GameController.playTurn(index);
        });
    });

    startButton.addEventListener("click", () => {
        const player1Name = document.getElementById("player1").value || "Player 1";
        const player2Name = document.getElementById("player2").value || "Player 2";
        GameController.startGame(player1Name, player2Name);
    });

    restartButton.addEventListener("click", () => {
        GameController.startGame(player1.getName(), player2.getName());
    });

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const setMessage = (message) => {
        gameInfo.textContent = message;
    };

    return {
        updateBoard,
        setMessage,
    };
})();
