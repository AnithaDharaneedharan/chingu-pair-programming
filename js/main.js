"use strict";
let $all = expression => document.querySelectorAll(expression);
let $single = expression => document.querySelector(expression);

let displayer = $single("#calculator-display");
let displayerHistory = $single('#calculator-display-history');
let btns = $all("[class*='btn-']");


let shouldClearDisplay = false;

class History {
    _history = []
    
    constructor (size) {
        this.size = size;
    }

    push(value) {
        if (this._history.length < this.size) {
            this._history.push(value)
        } else {
            // Perform a L-SHIFT
            this._history.splice(0, 1);
            this._history = [...this._history, value];
        }
    }

    get history() {
        return this._history;
    }

}


class HistoryRenderer extends History {
    constructor(size, attachTo) {
        super(size);
        this.attachTo = attachTo;

    }

    render() {
        // clear the attachTo
        this.#removeAllChildrens();

        for (let history of this._history) {
            this.attachTo.appendChild(
                this.#buildFromTuple(history)
            );
        }
    }

    #buildFromTuple(tuple) {
        const [calculation, result] = tuple;
        let container = document.createElement('div');
        container.setAttribute('class', 'history-group');

        let span0 = document.createElement('span');
        let span1 = document.createElement('span');
        span0.innerHTML = calculation;
        span1.innerHTML = `= ${result}`;
        container.appendChild(span0);
        container.appendChild(span1);

        return container;
    }
    #removeAllChildrens() {
        while (this.attachTo.firstChild) {
            this.attachTo.removeChild(this.attachTo.firstChild);
        }
    }
}

// display up to 3 history
let HISTORY_SIZE = 3;
const history = new HistoryRenderer(HISTORY_SIZE, displayerHistory);

btns.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    
    let value = e.target
                    .innerHTML
                    .trim()
                    .toUpperCase();

    // clear the display value
    if (value === 'AC') {
        displayer.value = '';
    }
    else if (value === 'DELETE') {
        if (!!displayer.value){
            displayer.value = displayer.value.slice(0, -1);
        }
    }else if (value === '=') {
        // compute expression and display result 
        const displayerCurrentValue = displayer.value
        try {
            let result = calculatorEval(displayer.value);
            displayer.value = result;
            history.push([displayerCurrentValue, result]);
            // rerender history 
            history.render();
        } catch(e) {
            console.log(e.message)
            displayer.value = 'Error';
            shouldClearDisplay = true;
        }
    } else {
        if (shouldClearDisplay) {
            displayer.value = '';
            shouldClearDisplay = false;
        } 
        displayer.value += value;
        
    }
  });
});
