import { initializeEmptyBoard, placeShips, renderGameboard, reset, scoreBoard } from "./func.js";

let map = [];
const size = 10;
const ships = [
  { name: "Portaerei", length: 5, positions: [], hits: 0, sunk: false},
  { name: "Incrociatore", length: 4, positions: [], hits: 0, sunk: false},
  { name: "Sottomarino", length: 3, positions: [], hits: 0, sunk: false},
  { name: "Cacciatorpediniere", length: 2, positions: [], hits: 0, sunk: false}
];

initializeEmptyBoard(map, size); // create empty virtual board

placeShips(ships, map, size); // place ships on random positions of virtual board
 
renderGameboard(size, document.querySelector('.container'), map, ships); // render visual board

scoreBoard(ships); // keep track of which ships have been sunk

document.getElementById('reset').addEventListener('click', () => reset(map, ships, size)); // reset game
document.getElementById('play-again').addEventListener('click', () => reset(map, ships, size)); 

 