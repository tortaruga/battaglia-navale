import { initializeEmptyBoard, placeShips, renderGameboard, reset, scoreBoard } from "./func.js";
import './modes.js'; 
import { player1Map, player2Map, player1Ships, player2Ships, size } from "./variables.js";


initializeEmptyBoard(player1Map, size); // create empty virtual board
initializeEmptyBoard(player2Map, size); 

placeShips(player1Ships, player1Map, size); // place ships on random positions of virtual board
placeShips(player2Ships, player2Map, size);
 
renderGameboard(size, document.querySelector('.map.player-1'), player1Map, player1Ships, 'player-1'); // render visual board
renderGameboard(size, document.querySelector('.map.player-2'), player2Map, player2Ships, 'player-2');

scoreBoard(player1Ships, document.querySelector('.ships.player-1'), 'player-1'); // keep track of which ships have been sunk
scoreBoard(player2Ships, document.querySelector('.ships.player-2'), 'player-2'); // keep track of which ships have been sunk

document.getElementById('reset').addEventListener('click', () => {
    reset(player1Map, player1Ships, size);
    reset(player2Map, player2Ships, size); 
}); // reset game

document.getElementById('play-again').addEventListener('click', () => {
    reset(player1Map, player1Ships, size);
    reset(player2Map, player2Ships, size);
}); 


// settings
document.getElementById('settings').addEventListener('click', () => {
    document.querySelector('.settings').classList.toggle('hide');
})