// @ts-check
// http://www.usacheckers.com/downloads/WCDF_Revised_Rules.doc

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const trackLength = 8;
const cellSize = canvas.width / trackLength;


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

canvas.addEventListener('click', e => {
    const boundingRect = canvas.getBoundingClientRect();
    const viewCellSize = boundingRect.width / trackLength;
    const i = Math.floor(e.offsetY / viewCellSize);
    const j = Math.floor(e.offsetX / viewCellSize);

    position[i][j] = 1;
    drawPosition();

})

function drawPosition() {
    for (let i = 0; i < trackLength; i++) {
        for (let j = 0; j < trackLength; j++) {
            drawCell(i, j, position[i][j]);
        }
    }
}

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

function drawLightRect(x, y) {
    drawRect(x, y, '#FFFFFF');
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



drawPosition();