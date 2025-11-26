import { player2Map, player2Ships, size, state } from "./variables.js";

const currentShipHits = [];

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
        map[x][y] = 'X'; // update virtual map
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
    e.target.disabled = true;
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
    currentShipHits.length = 0;
    handleGameOver(); // hide gameover message
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

    handleKeyboardInteractions();

    if (state.playerTurn === 'player-2' && state.mode === 'computer') {
        document.querySelector(`.container.player-2`).classList.add('deactivated');

        setTimeout(() => {
            handleComputerMove(player2Map, size, player2Ships);
        }, 1000);
    }
}

function handleKeyboardInteractions() {
    document.querySelectorAll('.container:not(.player-turn) .cell').forEach(cell => cell.disabled = true);
    document.querySelectorAll('.container.player-turn .cell').forEach(cell => cell.disabled = false);

}

function huntMode(map, size) {
    let randomX;
    let randomY; 

    do {
        randomX = Math.floor(Math.random() * size);
        randomY = Math.floor(Math.random() * size);
    } while (map[randomX][randomY] === 'X');

    return [randomX, randomY];
}

function targetMode(map, size) {
    let randomX;
    let randomY;

    const lastHitX = currentShipHits[0][0]; 
    const lastHitY = currentShipHits[0][1]; 

    // 4 adject cells to the last hit 
    const possibleMoves = [[lastHitX + 1, lastHitY],
                            [lastHitX - 1, lastHitY],
                            [lastHitX, lastHitY - 1],
                            [lastHitX, lastHitY + 1]];

    // filter 4 adject cells to remove those out of map boundaries                        
    const validMoves = possibleMoves.filter(([x, y]) => {
           return (x >= 0 && x < size && y >= 0 && y < size);
    });

    do {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        randomX = randomMove[0];
        randomY = randomMove[1];
    } while (!map[randomX][randomY] || map[randomX][randomY] === 'X');

    return [randomX, randomY];
}

function orientationMode(map, size) {
    let randomX;
    let randomY;

    if (currentShipHits[0][0] === currentShipHits[1][0]) {
        // hit cells share the same X coordinate --> ship is horizontal
        // only possible moves are [x, firstY - 1] and [x, lastY + 1]
        const firstHitY = currentShipHits[0][1]; 
        const x = currentShipHits[0][0]; 
        const lastHitY = currentShipHits[currentShipHits.length - 1][1]; 

        const possibleMoves = [[x, firstHitY - 1], [x, lastHitY + 1]];
        const validMoves = possibleMoves.filter(([x, y]) => x < size && x >= 0 && y < size && y >= 0 && map[x][y] !== 'X');
    
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        randomX = randomMove[0];
        randomY = randomMove[1];
        
    } else if (currentShipHits[0][1] === currentShipHits[1][1]) {
        // hit cells share the same Y coordinate --> ship is vertical
        // only possible moves are [lastX + 1, y] and [firsX - 1, y];
        const firstHitX = currentShipHits[0][0]; 
        const y = currentShipHits[0][1]; 
        const lastHitX = currentShipHits[currentShipHits.length - 1][0]; 

        const possibleMoves = [[firstHitX - 1, y], [lastHitX + 1, y]];
        // filter moves out of boundaries
        const validMoves = possibleMoves.filter(([x, y]) => x < size && x >= 0 && y < size && y >= 0 && map[x][y] !== 'X');

        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        randomX = randomMove[0];
        randomY = randomMove[1];
    }

    return [randomX, randomY];
}

function handleComputerMove(map, size, ships) {
    let x; 
    let y;
    let move;

    // hunt mode: random moves until you get a hit
    if (currentShipHits.length === 0) move = huntMode(map, size);

    // target mode: one hit --> select random adjacent cell until you get second hit
    if (currentShipHits.length === 1) move = targetMode(map, size);

    // orientation mode: now we know the orientation (how??) --> keep guessing in 2 directions 
    if (currentShipHits.length > 1) move = orientationMode(map, size);

    
    x = move[0];
    y = move[1];

    const cellSelected = document.querySelector(`.container.player-2 .cell[data-id="${x}-${y}"]`);

    if (map[x][y] === '-') {
        // computer misses
        map[x][y] = 'X'; // update virtual map;
        cellSelected.classList.add('empty'); // visual feedback;
        soundEffect(false); // play sound;
        setTimeout(() => {
            changeTurn('player-2');
        }, 800);
    } else if (map[x][y] === 'S') {
        // computer hits;
        currentShipHits.push([x, y]); // add move to current hits
        sortArray(currentShipHits); // sort current hits by index
        map[x][y] = 'X'; // update virtual map
        soundEffect(true); // play sound
        cellSelected.classList.add('sunk');

        const ship = ships.find(ship => ship.positions.includes(`${x}-${y}`));
        ship.hits++;

        if (ship.hits === ship.length) {
            const p = Array.from(document.querySelectorAll('.ship')).find(p => p.id  === `${ship.name}-player-2`);
            p.classList.add('completed');
            ship.sunk = true; // update sunk state in ship object
        
            currentShipHits.length = 0;

            if (gameOver(ships)) {
                setTimeout(() => {
                    document.getElementById('game-over').classList.remove('hide');
                    document.getElementById('winner').textContent = state.playerTurn.replace('-', ' ');
                }, 700);
            }
        };

        if (!gameOver(ships)) {
            setTimeout(() => {
                changeTurn('player-1');
            }, 800);
        }
    }
}


// keep track of last move
// select a random possible corner move
// keep track of vertical or horizontal
// keep track of whether whole ship was sunk

function sortArray(arr) {
    arr.sort((a, b) => {
  if (a[0] === b[0]) {
    // if x is the same, sort by y
    return a[1] - b[1];
  }
  // otherwise sort by x
  return a[0] - b[0];
});
}