import { find } from 'lodash';

// import Block class
import { Block } from './block';

export class Canvas {
  constructor({ elem, rows, columns, pixelSize, pixelColor }) {
    this.rows = rows; // total rows of blocks on the canvas
    this.columns = columns; // total columns of blocks on the canvas
    this.pixelSize = pixelSize; // size of each pixel
    this.pixelColor = pixelColor; // color of pixels
    this.elem = elem; // DOM element to render canvas element

    // render canvas element
    this.render();

    // create block
    this.blocks = [...Array(this.rows * this.columns)].map((_, index) => {
      return new Block({
        canvas: this.canvas,
        index,
        rows: this.rows,
        columns: this.columns,
        pixelSize,
        pixelColor
      });
    });

    // active cursor block
    this.activeBlockIndex = null;
  }

  /*****************************************/

  // get size of the canvas
  static getSize(rows, columns, pixelSize) {
    const blockSize = Block.getSize(pixelSize);
    const blockGutterSize = Block.getGutterSize(pixelSize);

    return {
      width: blockSize.width * columns + blockGutterSize * (columns - 1),
      height: blockSize.height * rows + blockGutterSize * (rows - 1)
    };
  }

  /*****************************************/

  // render canvas
  render() {
    // create canvas element
    this.canvas = document.createElement("canvas");

    // get width of height of canvas
    const { width, height } = Canvas.getSize(
      this.rows,
      this.columns,
      this.pixelSize
    );

    // set width and height attributes
    this.canvas.setAttribute("width", width);
    this.canvas.setAttribute("height", height);

    // render canvas
    this.elem.innerHTML = "";
    this.elem.appendChild(this.canvas);
  }

  // write a character in a block using index
  writeCharacter({ charCode, blockIndex = 0 } = {}) {
    const block = find(this.blocks, { index: blockIndex });

    // if block is not found with the block index, return
    if (!block) {
      return;
    }

    // write character
    block.writeCharacter({
      charCode
    });
  }

  // write string of characters
  writeString({ string = "", offset = 0 } = {}) {
    // generate characters from the string
    const characters = string.split("");

    // render each character on blocks
    characters.forEach((character, index) => {
      const charCode = character.charCodeAt(0); // returns a decimal number
      this.writeCharacter({
        charCode,
        blockIndex: index + offset // use block offset to shift the block
      });
    });
  }

  // clear a character
  clearCharacter({ blockIndex = 0 } = {}) {
    const block = find(this.blocks, { index: blockIndex });

    // if block is not found with the block index, return
    if (!block) {
      return;
    }

    // write character
    block.clearCharacter();
  }

  // clear the canvas (screen)
  clearScreen() {
    // for each block, clear character
    this.blocks.forEach(block => {
      this.clearCharacter({ blockIndex: block.index });
    });
  }

  // toggle cursor blink
  blinkCursor({ blockIndex = 0, stop = false } = {}) {
    const block = find(this.blocks, { index: blockIndex });

    // if block is not found with the block index, return
    if (!block) {
      return;
    }

    // if cursor is already active on a block, stop it first
    if (this.activeBlockIndex !== null) {
      const activeBlock = find(this.blocks, { index: this.activeBlockIndex });
      activeBlock.toggleCursorBlink(true);
    }

    // toggle cursor blink on a block
    this.activeBlockIndex = blockIndex;
    block.toggleCursorBlink(stop);
  }
}