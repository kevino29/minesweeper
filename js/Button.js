class Button {
    constructor(id, hasBomb) {
        this._id = id;
        this._hasBomb = hasBomb;
        this._number = 0;
        this._clicked = false;
        this._marked = false;

        // Parse the id string to get row and col
        let parsedId = this._id.split('c');
        this._row = parseInt(parsedId[0].split('r')[1]);
        this._col = parseInt(parsedId[1]);
    }

    getId() {
        if (this._id) return this._id;
    }

    setNumber(number) {
        this._number = number;
    }

    getRow() {
        if (this._row) return this._row;
    }

    getCol() {
        if (this._col) return this._col;
    }

    getButton() {
        if (this._button) return this._button;
    }

    clicked() {
        return this._clicked;
    }

    hasBomb() {
        return this._hasBomb;
    }

    hasNumber() {
        return this._number > 0;
    }

    create(wrapper) {
        // Creates the button then adds the required classes
        this._button = document.createElement('div');
        this._button.classList.add('button', 'btn', 'btn-light', 'border', 'rounded-0');

        // Adds the button to the wrapper
        wrapper.appendChild(this._button);
    }

    click() {
        if (this._marked) this.flag();
        if (this._hasBomb) this.showBomb();
        
        else {
            this._button.classList.add('disabled');
            this.showNumber();
        }
        this._clicked = true;
        return this.hasBomb();
    }

    flag() {
        if (!this._marked) {
            this._marked = true;
            this._button.innerHTML = '<i class="far fa-flag fa-lg"></i>';
            this._button.classList.remove('btn-light');
            this._button.classList.add('btn-success');
            console.log('Button ' + this.getId() + ' was marked!');
        }
        else {
            this._marked = false;
            this._button.innerHTML = '';
            this._button.classList.remove('btn-success');
            this._button.classList.add('btn-light');
            console.log('Button ' + this.getId() + ' was unmarked!');
        }
    }

    showNumber() {
        if (this._button && this._number !== 0) this._button.innerText = this._number;
    }

    showBomb() {
        if (this._hasBomb) {
            this._button.innerHTML = '<i class="fas fa-bomb fa-lg"></i>';
            this._button.classList.remove('btn-light');
            this._button.classList.add('btn-danger');
        }
    }

    equals(other) {
        return other.getRow() === this.getRow() && other.getCol() === this.getCol();
    }
}

export default Button;