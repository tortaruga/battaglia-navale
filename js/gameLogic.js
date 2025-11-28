import { gameOver, changeTurn, handleHitOrMiss, sinkShip, handleGameOver } from "./func.js";
import { state } from "./variables.js";

export function renderGameboard(size, container, map, ships, player) {
    // create cell divs based on grid size
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('button');
        cell.classList.add('cell');
        // create data-id with cell coordinates (matching map coordinates)
        // (using data-id instead of if because player1 and player2 share the same coordinates)
        cell.setAttribute('data-id', `${Math.floor(i / size)}-${i % size}`);
        container.appendChild(cell);
        cell.onclick = (e) => handleCell(e, map, ships, player);  
    }
}

function handleCell(e, map, ships, player) { 
    const id = e.target.dataset.id;
    // retrieve coordinates from id
    const x = id.split('-')[0];
    const y = id.split('-')[1];

    if (map[x][y] === '-') {
        handleHitOrMiss(false, map, e.target, x, y);
    
        if (state.mode !== 'solo') {
            setTimeout(() => {
                changeTurn(player);
            }, 800);
        };
    } else if (map[x][y] === 'S') {
        handleHitOrMiss(true, map, e.target, x, y);

        // increase hit count in the corresponding ship object
        const ship = ships.find(ship => ship.positions.includes(id));
        ship.hits++;

        // if ship is completely sunk cross it out from score board
        if (ship.hits === ship.length) {

            sinkShip(ship, `${ship.name}-${player}`);

            if (gameOver(ships)) {
                setTimeout(handleGameOver, 700);
            }
        };
    } else if (map[x][y] = 'X') {
        return;
    }
    e.target.disabled = true;
}

export function scoreBoard(ships, container, player) {
    // display name and length for each ship in the scoreboard
    ships.forEach(ship => {
        const p = document.createElement('div');
        p.innerHTML = `${ship.name} (${ship.length})`;
        p.id = `${ship.name}-${player}`;
        p.classList.add('ship');
        container.appendChild(p);
    })
}
