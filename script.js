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
        } else {
            board[row][column].setValue(token);
        }
    }   

    return {getBoard, addMove};
})();

/* Cell() factory function represent one square on the board 
** Each cell can have one of the following: 
** "": no token
** "♡": PLayer 1's token
** "🌙": Player 2's token
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
            token: "♡"
        },
        {
            name: player2.displayName,
            token: "🌙"
        }
    ]

    console.log(`user: ${players[0].name}, token: ${players[0].token}`);
    console.log(`user: ${players[1].name}, token: ${players[1].token}`);
    console.log(`Its ${players[0].name}'s turn first!`);

    /* switchPlayerTurn() switches between the two players
    ** getActivePlayer() returns whose turn it is 
    */
    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    let count = 0;
    const getCount = () => count;
    const setCount = () => ++count;

    const playRound = (row, column) => {
        console.log(getCount());

        if(Gameboard.addMove(row, column, activePlayer.token) === false) {
            return `${activePlayer.name}, spot (${row},${column}) is taken, please try again.`;
        } else if (getCount() === 8) {
            //add function determineWinner() to determine if someone won!!!
            //add if/else if/else statements to go through each situation
            
            console.log("nobody won. Please play again!");
            return printBoard();
        } else {
            Gameboard.addMove(row, column, activePlayer.token);
            switchPlayerTurn();
            printNextRound();
        }

        setCount();
        console.log("count: " + getCount());
    };

    const printNextRound = () => {
        const board = Gameboard.getBoard();
        const displayBoard = board.map(row => row.map(cell => cell.getValue()));

        console.log(displayBoard);
        console.log(`It's ${activePlayer.name}'s turn!`);
    }

    const printBoard = () => {
        const board = Gameboard.getBoard();
        const displayBoard = board.map(row => row.map(cell => cell.getValue()));
        console.log(displayBoard);
    }

    return {getActivePlayer, playRound, printNextRound};
})();