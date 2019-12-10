# dot-matrix-lcd
A JavaScript plugin to emulate Dot Matrix LCD display.

<img src="assets/preview.png" height="100px">

# Install
```bash
npm i -S dot-matrix-lcd
```

# Import in HTML
```html
<!-- LCD Display Container -->
<div id="lcd-container" class="lcd-container"></div>

<!-- Plugin Script -->
<script src="./dist/index.js"></script>
```

> This script exposes `LCD` class on `window` object.

# Import in Node.js
```js
const LCD = require('dot-matrix-lcd');
```

## Plugin API
```js
var lcd = new LCD({
    elem: document.getElementById("lcd-container"),
    rows: 2, // number of character rows on the LCD screen
    columns: 16, // number of character columns on the LCD screen
    pixelSize: 4, // size of each pixel
    pixelColor: "#000", // color of the pixel
});

// Write a character on LCD screen.
// charCode => decimal number or hexadecimal string ASCII code point
// blockIndex => index of the character block (default: 0)
lcd.writeCharacter( { charCode, blockIndex } );

// Write string (text) on LCD screen.
// string => text (default: "")
// offset => offset index from the start of the screen.
lcd.writeString({ string, offset });
    
// Clear a character at a given index on the LCD screen.
// blockIndex => Index of the character block (default: 0)
lcd.clearCharacter({ blockIndex });

// Toggle cursor blink at the given character block.
// blockIndex => index of the character block (default: 0)
// stop => stop cursor blink (default: false)
lcd.blinkCursor({ blockIndex, stop });

// Clear entire LCD screen.
lcd.clearScreen();
```
