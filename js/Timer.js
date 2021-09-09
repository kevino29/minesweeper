class Timer {
    constructor(id) {
        this._time = 0;
        this._wrapper = document.querySelector(id);
    }

    getTime() {
        return this._time;
    }

    getFormattedTime() {
        return this.#convert(this.getTime());
    }

    start() {
        this.stop();
        let wrapper = this._wrapper;
        this._timer = setInterval(() => {
            this._time += 1;
            let time = this.#convert(this._time).toString();
            wrapper.innerText = time;
        }, 1000, this);
    }

    stop() {
        if (this._timer) {
            clearInterval(this._timer); 
            this._timer = null; 
        }
    }

    reset() {
        this.stop();
        this._time = 0;
        this._wrapper.innerText = this.#zeroPad(this._time) + ':' + this.#zeroPad(this._time);
    }

    #convert(num) {
        if (num === undefined || num === null) return this.#zeroPad(0) + this.#zeroPad(0);

        if (num >= 60) {
            let mins = Math.floor(num / 60);
            let secs = num - (mins * 60);

            if (mins >= 60) {
                let hours = Math.floor(mins / 60);
                mins -= (hours * 60);
                secs -= (mins * 60);

                return this.#zeroPad(hours) + ':' + this.#zeroPad(mins) + ':' + this.#zeroPad(secs);
            }
            else return this.#zeroPad(mins) + ':' + this.#zeroPad(secs);
        }
        else return this.#zeroPad(0) + ':' + this.#zeroPad(num);
    }

    #zeroPad(num) {
        let number;
        try {
            number = parseInt(num);
        } catch (e) {
            console.log(e);
            console.log('Error parsing ' + num.toString() + ' to an integer!');
        }

        if (number < 10) return '0' + number.toString();
        else return number.toString();
    }
}

export default Timer;