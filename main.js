// @ts-check
// http://www.usacheckers.com/downloads/WCDF_Revised_Rules.doc

// Draughts is a board game of skill played between two players who, 
// following a fixed set of rules, attempt to win the game by either 
// removing all of their opponent’s playing pieces from the draughts board, 
// or by rendering their opponent’s pieces immobile.

// The draughtboard is composed of 64 squares, alternately light and dark 
// arranged in a square array of 8 rows and 8 columns and bounded by a neutral border.

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const trackLength = 8;
const cellSize = canvas.width / trackLength;


// The first move in each game is made by the player with the Red men; 
// thereafter the moves are made by each player in turn
let darkPiecesTurn = true;

// The 32 green squares used for play on the draughtboard shall be assigned 
// numbers 1-32 for descriptive purposes. These numbers are the official 
// reference system for notations and recording games.

// From the matrix the square number can be retrieved with the following expression
// n = (((i * trackLength) + j) -1) / 2;

// At the beginning of a game, one player has 12 dark-coloured discs 
// (referred to as “pieces” or “men”), and the other player has 12 light-coloured discs.

// The Red pieces shall be set for beginning play on the first 12 squares of 
// the player playing the Red pieces starting right to left, Nos. 1 thru 12. 
// The White pieces will be on the last 12 squares, Nos. 21 thru 32, 
// with No.32 being the nearest double corner square.

const position = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
];

// There are fundamentally 4 types of move: 
// 1. the ordinary move of a man; 
//   An ordinary move of a man is its transfer diagonally 
//   forward left or right from one square to an immediately neighbouring vacant square.
//
//   When a man reaches the farthest row forward (known as the “king-row” or “crown-head”) 
//   it becomes a king, and this completes the turn of play. 

// 2. the ordinary move of a king; 
//   An ordinary move of a king (crowned man) is from one square diagonally 
//   forward or backward, left or right, to an immediately neighbouring vacant square.

// 3. the capturing move of a man;
//   A capturing move of a man is its transfer from one square over a diagonally 
//   adjacent and forward square occupied by an opponent`s piece (man or king) and 
//   on to a vacant square immediately beyond it. (A capturing move is called a "jump"). 
//   On completion of the jump the captured piece is removed from the board.
//
//   If a jump creates an immediate further capturing opportunity, then the capturing 
//   move of the piece (man or king) is continued until all the jumps are completed. 
//   The only exception is that if a man reaches the king-row by means of a capturing move 
//   it then becomes a king but may not make any further jumps until their opponent has moved.  
//   At the end of the capturing sequence, all captured pieces are removed from the board.
//
//   All capturing moves are compulsory, whether offered actively or passively. 
//   If there are two or more ways to jump, a player may select any one that they wish, 
//   not necessarily that which gains the most pieces. Once started, a multiple jump must 
//   be carried through to completion. A man can only be jumped once during a multiple jumping sequence.

// 4. the capturing move of a king. 
//   A capturing move of a king is similar to that of a man, but may be in a forward or backward direction.


// To register a human move we have to:
//  1. Listen to the mousedown event and if there is a move in progress register 
//     the end of the move with its coordinates and call the treatMove function otherwise register the beginning of the move with its coords
//  2. Listen to the mouseup event and if the coords changed, register the end coords of the move and call the treatMove function
//
function setupListeners() {

    let move = null;

    canvas.addEventListener('mousedown', e => {
        const { i, j } = getCoord(e);

        if (!treatEnd(i, j) && !move) {
            move = { start: { i, j } };
        }
    });

    canvas.addEventListener('mouseup', e => {
        const { i, j } = getCoord(e);

        treatEnd(i, j);
    });

    function treatEnd(i, j) {
        if (move && (move.start.i !== i || move.start.j !== j)) {
            move.end = { i, j };
            treatMove(move);
            move = null;
            return true;
        }
    }
}


function treatMove(move) {
    const value = position[move.start.i][move.start.j];
    position[move.start.i][move.start.j] = 0;
    position[move.end.i][move.end.j] = value;

    drawPosition();
}

function getCoord(e) {
    const boundingRect = canvas.getBoundingClientRect();
    const viewCellSize = boundingRect.width / trackLength;
    const i = Math.floor(e.offsetY / viewCellSize);
    const j = Math.floor(e.offsetX / viewCellSize);

    return { i, j };
}

function drawPosition() {
    for (let i = 0; i < trackLength; i++) {
        for (let j = 0; j < trackLength; j++) {
            drawCell(i, j, position[i][j]);
        }
    }
}

// At the commencement of play the draughtboard is placed between the players 
// in such a way that a green square is to be found on the player’s near left side, 
// and a white square to their right side. The playing squares to the near left side 
// of the draughtboard is referred to as a player’s “Single Corner”, while the playing 
// squares on the near right side is referred to as a player’s “Double Corner” side.

function drawCell(i, j, value) {
    const x = j * cellSize;
    const y = i * cellSize;

    if (isEven(i + j)) {
        drawLightRect(x, y);
    } else {
        drawDarkRect(x, y);
    }

    if (value) {
        drawPiece(x, y, value);
    }

}


function isEven(number) {
    return number % 2 === 0;
}

// The official draughtboard for use in all major events shall be of 
// Green and White (or off white/cream) colours for the dark and light squares.
function drawLightRect(x, y) {
    drawRect(x, y, '#DDDDDD');
}

function drawDarkRect(x, y) {
    drawRect(x, y, '#009900');
}

function drawRect(x, y, color) {
    context.beginPath();
    context.fillStyle = color;
    context.rect(x, y, cellSize, cellSize);
    context.fill();
    context.closePath();
}


// The official draught pieces shall be of RED and WHITE colours 
// for the dark and light pieces, respectively. These are sometimes 
// referred to as “Black” and White” in the games’ literature. 
// The pieces shall be a cylindrical shape of a uniform diameter, ...
function drawPiece(x, y, value) {
    const color = value > 0 ? '#FF0000' : '#FFFFFF';
    drawCircle(x, y, color);
}

function drawCircle(x, y, color) {
    const radius = (cellSize / 2) * 0.8;
    x += cellSize / 2;
    y += cellSize / 2;

    context.beginPath();
    context.fillStyle = color;
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}


// The game is won by the player who can make the last move; that is, 
// no move is available to the opponent on their turn to play, either 
// because all their pieces have been captured or their remaining pieces are all blocked.


setupListeners();
drawPosition();