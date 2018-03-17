import { Square } from "./square.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gridSize = 8;
const squares = createSquares();

let selectedSquare = null;
let turn = true;

function createSquares() {
    const squares = [];

    for (let i = 0; i < gridSize; i++) {
        squares[i] = [];
        for (let j = 0; j < gridSize; j++) {
            squares[i][j] = new Square(
                i,
                j,
                canvas,
                gridSize,
                (i + j) % 2 === 0 ? '#FFFF00' : '#00CC00',
                null
            );
        }
    }

    return squares;
}

function initializePieces() {

    for (let i = 0; i < gridSize; i++) {
        for (let j = (i % 2 === 0 ? 1 : 0); j < gridSize; j += 2) {

            if (i < 3) {
                squares[i][j].piece = 1;
            } else if (i >= squares.length - 3) {
                squares[i][j].piece = -1;
            }
        }
    }
}

function draw() {

    for (let i = 0; i < gridSize; i++) {
        for (let j = (i % 2 === 0 ? 1 : 0); j < gridSize; j += 2) {
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
        to.piece !== null ||
        !isPossible(from.x, from.y, to.x, to.y)
    ) {
        return;
    }

    to.piece = from.piece;
    from.piece = null;
    turn = !turn;
}

function isPossible(fromX, fromY, toX, toY) {
    const possibleMoves = getPossibleMoves(squares, turn);

    console.log(fromX, fromY, toX, toY);
    console.log(possibleMoves);

    for (const move of possibleMoves) {
        if (
            move.fromX === fromX &&
            move.fromY === fromY &&
            move.toX === toX &&
            move.toY === toY
        ) {
            return true;
        }
    }

    return false;
}

function getPossibleMoves(squares, turn) {
    let possibleMoves = [];

    for (let i = 0; i < gridSize; i++) {
        for (let j = (i % 2 === 0 ? 1 : 0); j < gridSize; j += 2) {
            if (
                squares[i][j].piece === null ||
                (turn && squares[i][j].piece === 1) ||
                (!turn && squares[i][j].piece === -1)
            ) {
                continue;
            }

            possibleMoves = possibleMoves.concat(getPossibleMovesFrom(i, j, squares));
        }
    }

    return possibleMoves;
}

function getPossibleMovesFrom(i, j, squares) {
    const possibleMoves = [];
    const pieceValue = squares[i][j].piece;

    const firstPossibility = squares[i + pieceValue][j - 1];
    const secondPossibility = squares[i + pieceValue][j + 1];

    checkPossibilities(pieceValue, i, j, firstPossibility, squares, possibleMoves, -1);
    checkPossibilities(pieceValue, i, j, secondPossibility, squares, possibleMoves, 1);

    return possibleMoves;
}

function checkPossibilities(pieceValue, i, j, possibility, squares, possibleMoves, offset) {
    if (possibility) {
        if (possibility.piece === null) {
            possibleMoves.push({
                fromX: i,
                fromY: j,
                toX: possibility.x,
                toY: possibility.y
            });
        } else if (possibility.piece !== pieceValue) {
            possibility =
                (squares[possibility.x + pieceValue] ||
                    [])[possibility.y + offset];
            if (
                possibility &&
                possibility.piece === null
            ) {
                possibleMoves.push({
                    fromX: i,
                    fromY: j,
                    toX: possibility.x,
                    toY: possibility.y
                });
            }
        }
    }
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