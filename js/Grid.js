import Button from "./Button.js";
import Timer from "./Timer.js";

class Grid {
    constructor(wrapper, rows, cols, bombCount) {
        this._grid = document.createElement('div');
        this._wrapper = wrapper;
        this._rows = parseInt(rows);
        this._cols = parseInt(cols);
        this._bombCount = bombCount;
        this._cells = [];
        this._bombs = [];
    }

    getCells() {
        if (this._cells.length > 0) return this._cells;
        return null;
    }

    init() {
        // Initialize the bombs
        let totalCells = this._rows * this._cols;

        for (let i = 0; i < this._bombCount; i++) {
            let randomNum = Math.floor(Math.random() * totalCells) + 1;
            let alreadyExists = false;

            this._bombs.map(e => { if (e === randomNum) alreadyExists = true; });
            if (alreadyExists) { i--; continue; }
            
            this._bombs.push(randomNum);
        }

        // Sort the bomb array from least to greatest
        this._bombs.sort((a, b) => a - b);

        // Show how many bombs there are
        document.querySelector('#bombCount').innerText = this._bombCount;

        // For testing --------------------------------
        console.dir(this._bombs);
    }

    create() {
        // Initialize the bombs, if it hasn't been yet
        if (this._bombs.length === 0) this.init();

        // Create the buttons or 'land'
        let count = 0;
        for (let i = 1; i <= this._rows; i++) {
            // Create the elements and add styling
            let row = document.createElement('div');
            row.classList.add('row', 'm-0', 'p-0');
            let col = document.createElement('div');
            col.classList.add('col', 'd-flex', 'm-0', 'p-0', 'justify-content-center');

            for (let j = 1; j <= this._cols; j++) {
                // Set the bombs to the buttons accordingly
                let hasBomb = false;
                count++;
                this._bombs.map(e => { if (e == count) hasBomb = true; });

                // Create the button object
                let id = 'r' + i.toString() + 'c' + j.toString();
                let button = new Button(id, hasBomb);
                button.create(col);

                // Add the button to the cells array, for keeping track
                this._cells.push(button);

                // Attach a click event listener to the button
                button.getButton().addEventListener('click', () => {
                    console.log('Button ' + button.getId() + ' was clicked!');
                    if (button.click()) {
                        alert('Game Over! You hit a mine!');
                        return;
                    }

                    if (!button.hasNumber() && !button.hasBomb()) { 
                        this.explode(button);

                        // Shake the game a bit
                        this._wrapper.classList.remove('shake');
                        this._wrapper.classList.add('shake');
                    }

                    // Count how many cells without bombs are left
                    let cellsLeft = 0;
                    this._cells.map(cell => {
                        if (!cell.hasBomb() && !cell.clicked()) cellsLeft++;
                    });

                    // For testing ------------------------
                    console.log('Cells left to find: ' + cellsLeft);

                    if (cellsLeft === 0) this.#gameOver();
                });

                // Attack a right-click event listener to the button
                button.getButton().addEventListener('contextmenu', e => {
                    e.preventDefault();
                    button.flag();
                })
            }

            // Combine all the elements
            row.appendChild(col);
            this._wrapper.appendChild(row);
        }

        // Set up the count of bombs for each button
        this._cells.map(this.#checkCellSurrounding, this);

        // For testing ----------------------
        // this._cells.map(cell => cell.click());
    }

    explode(curr) {
        let top = this.getTopMiddleBtn(curr);
        let topRight = this.getTopRightBtn(curr);
        let right = this.getMiddleRightBtn(curr);
        let bottomRight = this.getBottomRightBtn(curr);
        let bottom = this.getBottomMiddleBtn(curr);
        let bottomLeft = this.getBottomLeftBtn(curr);
        let left = this.getMiddleLeftBtn(curr);
        let topLeft = this.getTopLeftBtn(curr);

        if (!curr.clicked()) curr.click();

        if (!curr.hasNumber()) {
            if (top !== null && !top.clicked()) this.explode(top);
            if (topRight !== null && !topRight.clicked()) this.explode(topRight);
            if (right !== null && !right.clicked()) this.explode(right);
            if (bottomRight !== null && !bottomRight.clicked()) this.explode(bottomRight);
            if (bottom !== null && !bottom.clicked()) this.explode(bottom);
            if (bottomLeft !== null && !bottomLeft.clicked()) this.explode(bottomLeft);
            if (left !== null && !left.clicked()) this.explode(left);
            if (topLeft !== null && !topLeft.clicked()) this.explode(topLeft);
        }
    }

    #gameOver() {
        alert('Game Over! You found all the mines!');
    }

    reset() {
        this._wrapper.innerHTML = '';
        this._cells = [];
        this._bombs = [];
        this.create();
    }

    #checkCellSurrounding(cell) {
        let count = 0;

        // Check top left
        let topLeft = this.getTopLeftBtn(cell);
        if (topLeft !== null && topLeft.hasBomb()) count++;

        // Check top middle
        let topMiddle = this.getTopMiddleBtn(cell)
        if (topMiddle !== null && topMiddle.hasBomb()) count++;

        // Check top right
        let topRight = this.getTopRightBtn(cell);
        if (topRight !== null && topRight.hasBomb()) count++;

        // Check middle left
        let middleLeft = this.getMiddleLeftBtn(cell);
        if (middleLeft !== null && middleLeft.hasBomb()) count++;

        // Check middle right
        let middleRight = this.getMiddleRightBtn(cell);
        if (middleRight !== null && middleRight.hasBomb()) count++;

        // Check bottom left
        let bottomLeft = this.getBottomLeftBtn(cell)
        if (bottomLeft !== null && bottomLeft.hasBomb()) count++;

        // Check bottom middle
        let bottomMiddle = this.getBottomMiddleBtn(cell)
        if (bottomMiddle !== null && bottomMiddle.hasBomb()) count++;

        // Check bottom right
        let bottomRight = this.getBottomRightBtn(cell)
        if (bottomRight !== null && bottomRight.hasBomb()) count++;
        
        cell.setNumber(count);
    }

    getTopLeftBtn(cell) {
        if (cell.getRow() !== 1 && cell.getCol() !== 1)
            return this.getButton(cell.getRow() - 1, cell.getCol() - 1);
        return null;
    }

    getTopMiddleBtn(cell) {
        if (cell.getRow() !== 1)
            return this.getButton(cell.getRow() - 1, cell.getCol());
        return null;
    }

    getTopRightBtn(cell) {
        if (cell.getRow() !== 1 && cell.getCol() !== this._cols)
            return this.getButton(cell.getRow() - 1, cell.getCol() + 1);
        return null;
    }

    getMiddleLeftBtn(cell) {
        if (cell.getCol() !== 1)
            return this.getButton(cell.getRow(), cell.getCol() - 1);
        return null;
    }

    getMiddleRightBtn(cell) {
        if (cell.getCol() !== this._cols)
            return this.getButton(cell.getRow(), cell.getCol() + 1);
        return null;
    }

    getBottomLeftBtn(cell) {
        if (cell.getRow() !== this._rows && cell.getCol() !== 1)
            return this.getButton(cell.getRow() + 1, cell.getCol() - 1);
        return null;
    }

    getBottomMiddleBtn(cell) {
        if (cell.getRow() !== this._rows)
            return this.getButton(cell.getRow() + 1, cell.getCol());
        return null;
    }

    getBottomRightBtn(cell) {
        if (cell.getRow() !== this._rows && cell.getCol() !== this._cols)
            return this.getButton(cell.getRow() + 1, cell.getCol() + 1);
        return null;
    }

    getButton(row, col) {
        let button;

        if (this._cells.length > 0) {
            this._cells.map(cell => {
                if (cell.getRow() === row && cell.getCol() === col) button = cell;
            });
        }
        return button;
    }
}

export default Grid;