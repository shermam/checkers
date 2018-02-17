import { Square } from "./square.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gridSize = 8;
const squares = createSquares();
initializePieces();

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
                (i + j) % 2 === 0 ? '#FFFFFF' : '#00CC00'
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

    //requestAnimationFrame(draw);
};

canvas.addEventListener('mousedown', handler);
canvas.addEventListener('mouseup', handler);

function handler(e) {
    const size = canvas.width / gridSize;
    console.log(Math.floor(e.offsetX / size), Math.floor(e.offsetY / size));
}

draw();