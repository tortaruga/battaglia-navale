import { computerLogicVars } from "./variables.js";
import { changeTurn } from "./func.js";
import { placeShips, initializeEmptyBoard } from "./initialize.js";

export function reset(map, ships, size) {
    resetVirtualMap(map, size);
    resetVisualMap();
    resetShips(ships);
    changeTurn('player-2'); // reset to player-1
    
    placeShips(ships, map, size); // place new ships

    resetScoreboard(); 
    computerLogicVars.currentShipHits.length = 0;
    hideGameOver(); 
}

function resetVirtualMap(map, size) {
    map.length = 0;
    initializeEmptyBoard(map, size);
}

function resetVisualMap() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
        cell.disabled = false;
    })
}

function resetShips(ships) {
    ships.forEach(ship => { 
        ship.positions = [];
        ship.hits = 0;
        ship.sunk = false;
    })
}

function resetScoreboard() {
    document.querySelectorAll('.ship').forEach(p => p.classList.remove('completed'));
}

function hideGameOver() {
    document.getElementById('game-over').classList.add('hide');
}