'use strict';

// let selector = document.querySelector;

let displayer = document.querySelector('#displayer');
let btns = document.querySelectorAll('.btn')

btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(e.target.innerHTML);
        let value = e.target.innerHTML;
        displayer.value = value;
    });
})
