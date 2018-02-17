export class Square {
    constructor(x, y, canvas, gridSize, color, piece) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.gridSize = gridSize;
        this.size = this.canvas.width / this.gridSize;
        this.color = color;
        this.piece = piece;
    }

    draw() {
        const xPos = this.x * this.size;
        const yPos = this.y * this.size;
        const radius = this.size / 2;

        this.context.beginPath()

        this.context.fillStyle = this.color;

        this.context.fillRect(
            xPos,
            yPos,
            this.size,
            this.size
        );

        if (this.piece) {

            this.context.fillStyle = this.piece === 1 ? '#FF0000' : '#0000FF';
            this.context.ellipse(
                xPos + radius,
                yPos + radius,
                radius * 0.7,
                radius * 0.7,
                0,
                0,
                2 * Math.PI
            );

            this.context.fill();
        }


        this.context.closePath()
    }
}

// [
//     [0],
//     [0, 1, 2],
//     [0, 1, 2, 3, 4],
//     [0, 1, 2, 3, 4, 5, 6],

//     [0, 1, 2, 3, 4, 5, 6],
//     [0, 1, 2, 3, 4],
//     [0, 1, 2],
//     [0],
// ]