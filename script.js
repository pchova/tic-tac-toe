/* CreatePlayer() factory function accepts user input for their displayName
** Keeps track of how many moves they've made on the board with score
** numMoves adds to score and returns each players score
*/
function CreatePlayer(name) {
    let displayName = name;
    let score = 0;

    const numMoves = () => {
        score++;
        return `${displayName}'s number of moves: ${score}`;
    }

    return {displayName, numMoves};
}

/* Gameboard() factory function - IIFE to only call the board once 
** getBoard creates the board 
** printBoard displays the board in DOM
** addMove adds a player move to the board
*/

/* DisplayController() factory function - IIFE to only create the game once
*/