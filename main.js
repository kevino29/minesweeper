import Grid from './js/Grid.js';

window.addEventListener('load', () => {
    let game = document.querySelector('#game');
    let resetButton = document.querySelector('#resetButton');
    
    let grid = new Grid(game,20,20,50);
    grid.create();

    resetButton.addEventListener('click', () => {grid.reset()} );
});