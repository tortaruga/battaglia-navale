import { player2Map, player2Ships, size, state } from "./variables.js";
import { handleComputerMove } from "./computerMove.js"; 

export function handleHitOrMiss(hit, map, cell, x, y) {
    // visual feedback;
    if (hit) {
        cell.classList.add('sunk');
    } else {
       cell.classList.add('empty'); 
    }

    soundEffect(hit); // play sound
    map[x][y] = 'X'; // update virtual map

}

export function sinkShip(ship, shipId) {
    const p = Array.from(document.querySelectorAll('.ship')).find(p => p.id  === shipId);
    p.classList.add('completed');
    ship.sunk = true; // update sunk state in ship object
}

// handle turns
export function changeTurn(player) {
    document.querySelector(`.container.${player}`).classList.remove('player-turn');
    document.querySelector(`.container.${player}`).classList.add('deactivated');
    state.playerTurn = player === 'player-1' ? 'player-2' : 'player-1';

    document.querySelector(`.container.${state.playerTurn}`).classList.add('player-turn');
    document.querySelector(`.container.${state.playerTurn}`).classList.remove('deactivated');

    handleKeyboardInteractions();

    if (state.playerTurn === 'player-2' && state.mode === 'computer') {
        document.querySelector(`.container.player-2`).classList.add('deactivated');

        setTimeout(() => {
            handleComputerMove(player2Map, size, player2Ships);
        }, 1000);
    }
}

// game over
export function gameOver(ships) {
    return ships.every(ship => ship.sunk); // game ends when all ships are sunk
}

export function handleGameOver() {
    document.getElementById('game-over').classList.remove('hide');
    document.getElementById('winner').textContent = state.playerTurn.replace('-', ' ');
}

// audio 
export function soundEffect(hit) {
    let audio = hit ? new Audio('../assets/audio/hit.mp3') : new Audio('../assets/audio/miss.mp3');
    
    if (isAudioOn()) audio.play();
}

function isAudioOn() {
    return document.getElementById('sound-toggle').checked;
}

// keyboard interactions
function handleKeyboardInteractions() {
    document.querySelectorAll('.container:not(.player-turn) .cell').forEach(cell => cell.disabled = true);
    document.querySelectorAll('.container.player-turn .cell').forEach(cell => cell.disabled = false);
}

