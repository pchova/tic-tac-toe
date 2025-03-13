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

        } else if (determineWinner() === true) {
            console.log(`${activePlayer.name} won!`);
            return restartGame();
            
        } else if (getCount() === 8) {

            if (determineWinner() === true) {
                console.log(`${activePlayer.name} won!`)
                printBoard();
                return restartGame();
            } else {
                console.log("Nobody won. Please play again!");
                printBoard();
                return restartGame();
            }

        } else {
            Gameboard.addMove(row, column, activePlayer.token);
            switchPlayerTurn();
            printNextRound();
        }

        setCount();
    };

    const determineWinner = () => {
        const board = Gameboard.getBoard();

        if (board[0][0].getValue() === 'X' && board[0][1].getValue() === 'X' && board[0][2].getValue() === 'X' || 
            board[0][0].getValue() === 'Y' && board[0][1].getValue() === 'Y' && board[0][2].getValue() === 'Y') {
            return true;
        } else if (board[1][0].getValue() === 'X' && board[1][1].getValue() === 'X' && board[1][2].getValue() === 'X' || 
                   board[1][0].getValue() === 'Y' && board[1][1].getValue() === 'Y' && board[1][2].getValue() === 'Y') {
            return true;
        } else if (board[2][0].getValue() === 'X' && board[2][1].getValue() === 'X' && board[2][2].getValue() === 'X' || 
                   board[2][0].getValue() === 'Y' && board[2][1].getValue() === 'Y' && board[2][2].getValue() === 'Y') {
            return true;
        } else if (board[0][0].getValue() === 'X' && board[1][0].getValue() === 'X' && board[2][0].getValue() === 'X' || 
                   board[0][0].getValue() === 'Y' && board[1][0].getValue() === 'Y' && board[2][0].getValue() === 'Y') {
            return true;
        } else if (board[0][1].getValue() === 'X' && board[1][1].getValue() === 'X' && board[2][1].getValue() === 'X' || 
                   board[0][1].getValue() === 'Y' && board[1][1].getValue() === 'Y' && board[2][1].getValue() === 'Y') {
            return true;
        } else if (board[0][2].getValue() === 'X' && board[1][2].getValue() === 'X' && board[2][2].getValue() === 'X' || 
                   board[0][2].getValue() === 'Y' && board[1][2].getValue() === 'Y' && board[2][2].getValue() === 'Y') {
            return true;
        } else if (board[0][0].getValue() === 'X' && board[1][1].getValue() === 'X' && board[2][2].getValue() === 'X' || 
                   board[0][0].getValue() === 'Y' && board[1][1].getValue() === 'Y' && board[2][2].getValue() === 'Y') {
            return true;
        } else if (board[0][2].getValue() === 'X' && board[1][1].getValue() === 'X' && board[2][0].getValue() === 'X' || 
                   board[0][2].getValue() === 'Y' && board[1][1].getValue() === 'Y' && board[2][0].getValue() === 'Y') {
            return true;
        } else {
            return false;
        }
    }

    /* Print's current board state and active player's turn */
    const printNextRound = () => {
        const board = Gameboard.getBoard();
        const displayBoard = board.map(row => row.map(cell => cell.getValue()));

        console.log(displayBoard);
        console.log(`It's ${activePlayer.name}'s turn!`);
    }

    /* Restarts game by setting count to 0 and clearing board array to be empty */
    const restartGame = () => {
        switchPlayerTurn();
        console.log(`Restarting Game....it's ${activePlayer.name}'s turn!`);

        count = 0;

        const newBoard = Gameboard.getBoard();
        for(let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                newBoard[i][j].setValue("");
            }
        }

        printBoard();
    }

    const printBoard = () => {
        const board = Gameboard.getBoard();
        const displayBoard = board.map(row => row.map(cell => cell.getValue()));
        console.log(displayBoard);
    } 

    return {getActivePlayer, playRound, printBoard};
})();


// if (/*tokens across in position (0,0) (0,1) (0,2) */) {
//     return true;
// } else if (/* tokens across in position (1,0) (1,1) (1,2) */) {
//     return true;
// } else if (/*tokens across in position (2,0) (2,1) (2,2) */) {
//     return true;
// } else if (/*tokens horizontal in (0,0) (1,0) (2,0) */) {
//     return true;
// } else if (/*tokens horizontal in (0,1) (1,1) (2,1) */) {
//     return true;
// } else if (/*tokens horizontal in (0,2) (1,2) (2,2) */) {
//     return true;
// } else if (/*tokens across in (0,0) (1,1) (2,2) */) {
//     return true;
// } else if (/*tokens across in (0,2) (1,1) (2,0) */) {
//     return true;
// } else {
//     return false;
// }