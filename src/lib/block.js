import { isNumber } from 'lodash';

// import local dependencies
import { Pixel } from './pixel';
import { characterMap } from '../constants/character-map';
import { padLeftZeros } from '../util/common';

export class Block {
    constructor({ canvas, index, rows, columns, pixelSize, pixelColor } = {}) {
        this.canvas = canvas; // canvas element
        this.index = index; // index of the block
        this.rows = rows; // total rows of blocks on the canvas
        this.columns = columns; // total columns of blocks on the canvas
        this.pixelSize = pixelSize; // size of each pixel
        this.pixelColor = pixelColor; // color of pixels

        // set block position
        this.setPosition();

        // create pixel array ( 5 x 8 = 40 pixels )
        this.pixels = [...Array(Block.getPixelCount())].map((_, index) => {
            return new Pixel({
                canvas: this.canvas,
                index,
                size: this.pixelSize,
                color: this.pixelColor,
                offset: { x: this.x, y: this.y }
            });
        });

        // render block
        this.render();
    }

    /*****************************************/

    // number of pixels in row and columns
    static getPixels() {
        return {
            row: 5, // 5 pixels in a row
            column: 8 // 8 pixels in a column
        };
    }

    // get pixel count
    static getPixelCount() {
        const { row, column } = Block.getPixels();
        return row * column;
    }

    // get gutter size : separation between each block
    static getGutterSize(pixelSize) {
        return pixelSize;
    }

    // get size of the block
    static getSize(pixelSize) {
        const { row, column } = Block.getPixels();

        // separation between each pixels
        const pGutter = Pixel.getGutterSize(pixelSize);

        // width and heigh pf entire block
        const width = pixelSize * row + pGutter * (row - 1);
        const height = pixelSize * column + pGutter * (column - 1);

        return { width, height };
    }

    /*****************************************/

    // set position of the block relative to the canvas
    setPosition() {
        // separation between each block
        this.gutter = Block.getGutterSize(this.pixelSize);

        // size of the block
        const { width, height } = Block.getSize(this.pixelSize);

        // horizontal and vertical index
        const hIndex = this.index % this.columns;
        const vIndex = Math.floor(this.index / this.columns);

        // relative X position to the canvas = (horizontal index * width) + (horizontal index * gutter)
        this.x = hIndex * width + hIndex * this.gutter;

        // relative Y position to the canvas = (vertical index * size) + (vertical index * gutter)
        this.y = vIndex * height + vIndex * this.gutter;
    }

    // render block
    render() {
        // render pixels
        this.pixels.forEach(pixel => {
            pixel.render(false);
        });
    }

    // write a character if the `blockIndex` is the current block index
    writeCharacter({ charCode }) {
        // clear character first
        this.clearCharacter();

        // if `charCode` is number, convert to hexadecimal string
        const hexCode = isNumber(charCode) ? Number(charCode).toString(16) : charCode;

        // get rows (containing active pixels values) from `characterMap`
        const { rows } = characterMap[hexCode];

        // for each element in row, convert value to binary number string
        const binaryRows = rows.map(rowValue => {
            // covert number to binary number
            const binaryString = Number(rowValue).toString(2);

            // pad left zero until total length becomes 5
            return padLeftZeros(binaryString, 5);
        });

        // get bit value of each pixels in the block
        const bitPixels = binaryRows.join("").split("");

        // for each pixel, re-render if pixel value is `1`
        this.pixels.forEach(pixel => {
            const pixelValue = bitPixels[pixel.index];
            pixel.render(pixelValue === "1");
        });
    }

    // clear a character if the `blockIndex` is the current block index
    clearCharacter() {
        // for each pixel, re-render
        this.pixels.forEach(pixel => {
            pixel.render(false);
        });
    }

    // toggle cursort blink
    toggleCursorBlink(stop = false) {
        // get last row of pixels
        const { row } = Block.getPixels();
        const pixels = this.pixels.slice(-row);

        pixels.forEach(pixel => {
            pixel.blink(stop);
        });
    }
}