/* CreatePlayer() factory function accepts user input for their displayName
** Keeps track of how many moves they've made on the board with score
** numMoves adds to score and returns each players score
*/
function CreatePlayer(name) {
    let displayName = "@" + name;
    let score = 0;

    const numMoves = () => {
        score++;
        return `${displayName}'s number of moves: ${score}`;
    }

    return {displayName, numMoves};
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
        board[row][column] = token;

        /* if(board[row][column].getValue() !== ""){
            return;
        } else {
            board[row][column] = setValue(token);
        } */
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

    console.log(`user: ${players[0].name} token: ${players[0].token}`);
    console.log(`user: ${players[1].name} token: ${players[1].token}`);
    console.log(`Its ${players[0].name}'s turn first!`);

    /* starting with player 1 on the first round 
    ** switchPlayerTurn() switches between the two players
    ** getActivePlayer() returns whose turn it is 
    */
    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNextRound = () => {
        console.log(Gameboard.getBoard());
        console.log(`It's ${activePlayer.name}'s turn!`);
    }

    const playRound = (r, c) => {
        let row = r;
        let column = c;
        let token = activePlayer.token;
        //change token back to setValue() to fix

        Gameboard.addMove(row, column, token);

        switchPlayerTurn();
        printNextRound();
    };

    return {playRound, getActivePlayer};
})();