//@ts-check

import { Square } from "./square.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gridSize = 8;
const squares = createSquares();
initializePieces();

function createSquares() {
    const squares = [];

    for (let j = 0; j < gridSize; j++) {
        for (let i = 0; i < gridSize / 2; i++) {
            squares.push(new Square(i, j, canvas, gridSize));
        }
    }

    return squares;
}

function initializePieces() {
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        if (i < squares.length / 2 - 4) {
            square.piece = 1;
        } else if (i >= squares.length / 2 + 4) {
            square.piece = 2;
        }
    }
}

function draw() {

    for (const square of squares) {
        square.draw();
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