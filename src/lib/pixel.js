export class Pixel {
    constructor({ canvas, index, size, color, offset } = {}) {
        this.canvas = canvas; // canvas element
        this.index = index; // index of the pixel
        this.size = size; // size of each pixel
        this.color = color; // color of pixels
        this.offset = offset; // position of the container block from the canvas
        this.gutter = Pixel.getGutterSize(size);

        // set pixel position
        this.setPosition();

        // blink interval
        this.blinkInterval = null;
        this.isVisible = false;
    }

    /*****************************************/

    // get gutter size : separation between each pixels
    static getGutterSize(pixelSize) {
        return Math.ceil(pixelSize / 4);
    }

    /*****************************************/

    // get position of the pixel relative to the block
    setPosition() {
        // horizontal and vertical index
        const hIndex = this.index % 5;
        const vIndex = Math.floor(this.index / 5);

        // relative X position to the block = (horizontal index * size) + (horizontal index * gutter)
        const posX = hIndex * this.size + hIndex * this.gutter;

        // relative Y position to the block = (vertical index * size) + (vertical index * gutter)
        const posY = vIndex * this.size + vIndex * this.gutter;

        // absolute position to the canvas
        this.x = this.offset.x + posX;
        this.y = this.offset.y + posY;
    }

    // render pixel based on `isActive` value
    render(isActive = true) {
        const ctx = this.canvas.getContext("2d");

        // set fill style (color)
        ctx.fillStyle = this.color;

        if (isActive) {
            ctx.fillRect(this.x, this.y, this.size, this.size);
            this.isVisible = true;
        } else {
            ctx.clearRect(this.x, this.y, this.size, this.size);
            ctx.fillStyle = "rgba(0,0,0,0.025)"; // dim backlight effecr
            ctx.fillRect(this.x, this.y, this.size, this.size);
            this.isVisible = false;
        }
    }

    // blink pixel
    blink(stop = false) {
        if (stop && this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
            this.render(false); // hide pixel
        } else {
            if (!this.blinkInterval) {
                this.blinkInterval = setInterval(() => {
                    if (this.isVisible) {
                        this.render(false); // show pixel
                    } else {
                        this.render(true); // hide pixel
                    }
                }, 300);
            }
        }
    }
}