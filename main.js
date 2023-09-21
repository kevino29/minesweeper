import Grid from './js/Grid.js';

const size = 10, bombs = 15;

window.addEventListener('load', () => {
    let game = document.querySelector('#game');
    let resetButton = document.querySelector('#resetButton');
    
    let grid = new Grid(game,size,size,bombs);
    grid.create();

    resetButton.addEventListener('click', () => {grid.reset()} );
});