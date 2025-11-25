import { state } from "./variables.js";

export function initializeEmptyBoard(map, size) {
    // create 2d array to represent game board
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push('-');
        }
        map.push(row);
    }
}

export function placeShips(ships, map, size) {
    const orientations = ['horizontal', 'vertical'];

    for (let ship of ships) {
        // select random orientation
        const orientation = orientations[Math.floor(Math.random() * orientations.length)];
        let startX;
        let startY;

        do {
            // select random x and y coordinates
            // and check if they can be starting points for placing the ship
            startX = Math.floor(Math.random() * size);
            startY = Math.floor(Math.random() * size);
        } while (!canPlaceShip(map, startX, startY, orientation, ship.length, size));

        
        // mark map[x][y] with 'S' to indicate a ship is present
        // and push the coordinates to ship.position for future reference 
        if (orientation === 'vertical') {
            // coordinate y is always startY
            // coordinate x goes from startX to startX plus the length of the ship
            for (let i = startX; i < startX + ship.length; i++) {
                map[i][startY] = 'S';
                ship.positions.push(`${i}-${startY}`);
            }
        } else {
            // coordinate x is always startX
            // coordinate y goes from startY to startY plus the length of the ship
            for (let i = startY; i < startY + ship.length; i++) {
                map[startX][i] = 'S';
                ship.positions.push(`${startX}-${i}`);
            }
        }
    }
}

function canPlaceShip(map, startX, startY, orientation, shipLength, size) {
    // given a random empty cell taken as starting point: 
    // if all cells the ship would occupy (based on its length) are free return true

    if (orientation === 'vertical') {
        if (startX + shipLength > size) return false; // ship is too long to fit in the board
        
        // x goes from startX to startX + shipLength
        // y is always startY
        for (let i = startX; i < startX + shipLength; i++) {
            if (map[i][startY] !== '-') return false;
        } 
    } else {
        if (startY + shipLength > size) return false; // ship is too long to fit in the board
        
        // x is always startX 
        // y goes from startY to startY + shipLength
        for (let i = startY; i < startY + shipLength; i++) {
            if (map[startX][i] !== '-') return false;
        }
    }

    return true;
}


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
        e.target.classList.add('empty'); // visual feedback
        soundEffect(false);
        if (state.mode !== 'solo') {
            setTimeout(() => {
                changeTurn(player);
            }, 800);
        };
    } else if (map[x][y] === 'S') {
        e.target.classList.add('sunk');  // visual feedback
        soundEffect(true); 
        map[x][y] = 'X'; // update virtual map
        // increase hit count in the corresponding ship object
        const ship = ships.find(ship => ship.positions.includes(id));
        ship.hits++;

        // if ship is completely sunk cross it out from score board
        if (ship.hits === ship.length) {
            const p = Array.from(document.querySelectorAll('.ship')).find(p => p.id  === `${ship.name}-${player}`);
            p.classList.add('completed');
            ship.sunk = true; // update sunk state in ship object

            if (gameOver(ships)) {
                setTimeout(() => {
                    document.getElementById('game-over').classList.remove('hide');
                    document.getElementById('winner').textContent = state.playerTurn.replace('-', ' ');
                }, 700);
            }
        };
    } else if (map[x][y] = 'X') {
        return;
    }
    e.target.classList.add('deactivated');
}

function gameOver(ships) {
    return ships.every(ship => ship.sunk); // game ends when all ships are sunk
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

export function reset(map, ships, size) {
    resetVirtualMap(map, size);
    resetVisualMap();
    resetShips(ships);
    changeTurn('player-2'); // reset to player-1
    
    placeShips(ships, map, size); // place new ships

    resetScoreboard(); 
    handleGameOver(); // hide gameover message
}

function resetVirtualMap(map, size) {
    map.length = 0;
    initializeEmptyBoard(map, size);
}

function resetVisualMap() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
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

function handleGameOver() {
    document.getElementById('game-over').classList.add('hide');
}

function soundEffect(hit) {
    let audio = hit ? new Audio('../assets/audio/hit.mp3') : new Audio('../assets/audio/miss.mp3');
    
    if (isAudioOn()) audio.play();
}

function isAudioOn() {
    return document.getElementById('sound-toggle').checked;
}

function changeTurn(player) {
    document.querySelector(`.container.${player}`).classList.remove('player-turn');
    document.querySelector(`.container.${player}`).classList.add('deactivated');
    state.playerTurn = player === 'player-1' ? 'player-2' : 'player-1';

    document.querySelector(`.container.${state.playerTurn}`).classList.add('player-turn');
    document.querySelector(`.container.${state.playerTurn}`).classList.remove('deactivated');

    if (state.playerTurn === 'player-2' && state.mode === 'computer') {
        document.querySelector(`.container.player-2`).classList.add('deactivated');
        handleComputerMove();
    }
}

function handleComputerMove() {
    // select a random move
    // if miss change turn
    // if hit select one more random move
    // check if any of the 4 corners of the previous move are available
    // if yes select a random one of them (should keep "thinking" like a human... keep going horizontally or vertically... no idea how to do that)
    // else select another random move
}