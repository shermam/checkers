import { Square } from "./square.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gridSize = 8;
const squares = createSquares();

let selectedSquare = null;

function createSquares() {
    const squares = [];

    for (let i = 0; i < gridSize; i++) {
        squares[i] = [];
        for (let j = 0; j < gridSize; j++) {
            squares[i][j] = new Square(
                j,
                i,
                canvas,
                gridSize,
                (i + j) % 2 === 0 ? '#FFFFFF' : '#00CC00',
                null
            );
        }
    }

    return squares;
}

function initializePieces() {

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {

            if (i < 3 && (i + j) % 2 !== 0) {
                squares[i][j].piece = 1;
            } else if (i >= squares.length - 3 && (i + j) % 2 !== 0) {
                squares[i][j].piece = 2;
            }
        }
    }
}

function draw() {

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            squares[i][j].draw();
        }
    }

    requestAnimationFrame(draw);
};


function initializeHandlers() {
    canvas.addEventListener('mousedown', downHandler);
    canvas.addEventListener('mouseup', upHandler);
}

function downHandler(e) {
    selectedSquare = getSquare(e);
}

function upHandler(e) {
    movePiece(selectedSquare, getSquare(e));
}

function movePiece(from, to) {
    if ((from.x + from.y) % 2 === 0 ||
        (to.x + to.y) % 2 === 0 ||
        from.piece === null ||
        from === to ||
        to.piece !== null
    ) {
        return;
    }

    to.piece = from.piece;
    from.piece = null;

}

function getSquare(e) {
    const size = canvas.width / gridSize;
    const i = Math.floor(e.offsetY / size);
    const j = Math.floor(e.offsetX / size);
    return squares[i][j];
}

initializeHandlers();
initializePieces();
draw();