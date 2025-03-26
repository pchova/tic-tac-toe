/* CreatePlayer() factory function accepts user input for their displayName
** Keeps track of how many moves they've made on the board with score
** numMoves adds to score and returns each players score
*/
function CreatePlayer(name) {
    let displayName = "@" + name;

    return {displayName};
}

/* Gameboard() factory function - IIFE to only call the board once 
** getBoard creates the board 
** printBoard displays the board in DOM (not there yet)
** addMove adds a player move to the board
*/
const Gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //create a 2D array that will be the state of the gameboard
    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const addMove = (row, column, token) => {
        if(board[row][column].getValue() !== "") {
            return false;
        }
        
        board[row][column].setValue(token);
        return true;
    }   

    return {getBoard, addMove};
})();

/* Cell() factory function represent one square on the board 
** Each cell can have one of the following: 
** "": no token
** "X": PLayer 1's token
** "O": Player 2's token
*/
function Cell() {
    let value = "";

    const setValue = (token) => {
        value = token;
    }

    const getValue = () => value;

    return {setValue, getValue};
}

/* DisplayController() factory function - IIFE to only create the game once
** Controls game flow by creating two players, state of game turns,
** and if anyone has won
*/
const DisplayController = (function() {
    const player1 = CreatePlayer("pchova");
    const player2 = CreatePlayer("anhellll");
    const players = [
        {
            name: player1.displayName,
            token: "X"
        },
        {
            name: player2.displayName,
            token: "O"
        }
    ]

    const displayUsers = document.querySelector(".displayUsers");
    displayUsers.textContent = `user: ${players[0].name} token: ${players[0].token}
    | user: ${players[1].name} token: ${players[1].token}`;

    const displayStatus = document.querySelector(".displayStatus");
    displayStatus.textContent = `it's ${players[0].name}'s turn!`;

    console.log(`user: ${players[0].name}, token: ${players[0].token}`);
    console.log(`user: ${players[1].name}, token: ${players[1].token}`);
    console.log(`Its ${players[0].name}'s turn first!`);

    /* switchPlayerTurn() switches between the two players
    ** getActivePlayer() returns whose turn it is */
    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    /* Variable count is set to 0, setter/getter functions are accessed within
    ** playRound() to keep track of when the board is filled */
    let count = 0;
    const getCount = () => count;
    const setCount = () => count++;

    /* PlayRound() adds token to a cell on the board
    ** Plays more rounds till count = 8, displays winner/tie
    ** Option to restart game  */
    const playRound = (row, column) => {

        if (Gameboard.addMove(row, column, activePlayer.token) === false) {
            return `${activePlayer.name}, spot (${row},${column}) is taken, please try again.`;
        }

        if (getCount() === 8 || determineWinner()) {
            let winner = determineWinner();
            winner ? updateStatus("winnerStatus") : updateStatus("tieStatus");
            restartGame();
            return;
        }

        setCount();
        switchPlayerTurn();
        updateStatus("playerStatus");     
        printNextRound();
        renderBoard();
    }

    /* determineWinner() checks all instances of 3 in a rows on the board 
    ** and returns true if there is a winner */
    const determineWinner = () => {
        const board = Gameboard.getBoard();

        const winningValues = [
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]
        ];

        for (let win of winningValues) {
            const [a,b,c] = win;

            const cellA = board[a[0]][a[1]].getValue();
            const cellB = board[b[0]][b[1]].getValue();
            const cellC = board[c[0]][c[1]].getValue();

            if (cellA !== "" && cellA === cellB && cellB === cellC) {
                return true;
            }
        }

        return false;
    }

    /* printNextRound() displays current board state and active player's turn */
    const printNextRound = () => {
        printBoard();
        console.log(`It's ${activePlayer.name}'s turn!`);
    }

    /* restartGame() switches player and sets count to 0 and clearing board array to be empty */
    const restartGame = () => {
        //switchPlayerTurn();
        updateStatus("restart");

        count = 0;

        const newBoard = Gameboard.getBoard();
        for(let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                newBoard[i][j].setValue("");
            }
        }

        printBoard();
        renderBoard();
    }

    /* printBoard() maps board array and displays all values in Cell */
    const printBoard = () => {
        const displayBoard = Gameboard.getBoard().map(row => row.map(cell => cell.getValue()));
        //console.log(displayBoard);
        return {displayBoard};
    } 

    return {getActivePlayer, playRound, printBoard};
})();


/* ****** DOM/Display Logic Below ****** */
function updateStatus(method) {
    const displayStatus = document.querySelector(".displayStatus");
    const player = DisplayController.getActivePlayer().name;

    switch(method) {
        case "playerStatus":
            displayStatus.textContent = `it's ${player}'s turn!`;
            break;
        case "winnerStatus":
            displayStatus.textContent = `${player} won!`;
            break;
        case "tieStatus":
            displayStatus.textContent = `It's a tie!`;
            break;
        case "restart":
            displayStatus.textContent = `Restarting Game....it's ${player}'s turn!`
            break;
    }
    

}

function renderBoard() {
    //get all gamesquare buttons from the DOM 
    const buttons = document.querySelectorAll(".gameSquare");
    const board = DisplayController.printBoard().displayBoard;
    
    //loop through the 3x3 board
    buttons.forEach((button, index) => {
        let row = Math.floor(index / 3);
        let column = (index % 3);
        button.textContent = board[row][column];
    });
}

function displayGame() {
    const container = document.querySelector(".container");

    /* create 3x3 grid buttons */ 
    for (let i = 0; i < 9; i++){
        let gameSquare = document.createElement("button");
        gameSquare.classList.add("gameSquare");
        container.appendChild(gameSquare);
    }

    /* select each button on board to attach event listeners to call playRound(row, col) */
    document.querySelectorAll(".gameSquare").forEach((button, index) => {
        let row = Math.floor(index / 3);
        let column = (index % 3);

        button.addEventListener('click', () => {
            playRound(row, column);
            /* update the DOM board to reflect each round */
            renderBoard();
        });
    })
}
displayGame();

