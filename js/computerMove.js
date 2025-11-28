import { handleHitOrMiss, sinkShip, handleGameOver, changeTurn, gameOver } from "./func.js";
import { computerLogicVars } from "./variables.js";

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

    const lastHitX = computerLogicVars.currentShipHits[0][0]; 
    const lastHitY = computerLogicVars.currentShipHits[0][1]; 

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

    if (computerLogicVars.currentShipHits[0][0] === computerLogicVars.currentShipHits[1][0]) {
        // hit cells share the same X coordinate --> ship is horizontal
        // only possible moves are [x, firstY - 1] and [x, lastY + 1]
        const firstHitY = computerLogicVars.currentShipHits[0][1]; 
        const x = computerLogicVars.currentShipHits[0][0]; 
        const lastHitY = computerLogicVars.currentShipHits[computerLogicVars.currentShipHits.length - 1][1]; 

        const possibleMoves = [[x, firstHitY - 1], [x, lastHitY + 1]];
        const validMoves = possibleMoves.filter(([x, y]) => x < size && x >= 0 && y < size && y >= 0 && map[x][y] !== 'X');
    
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        randomX = randomMove[0];
        randomY = randomMove[1];
        
    } else if (computerLogicVars.currentShipHits[0][1] === computerLogicVars.currentShipHits[1][1]) {
        // hit cells share the same Y coordinate --> ship is vertical
        // only possible moves are [lastX + 1, y] and [firsX - 1, y];
        const firstHitX = computerLogicVars.currentShipHits[0][0]; 
        const y = computerLogicVars.currentShipHits[0][1]; 
        const lastHitX = computerLogicVars.currentShipHits[computerLogicVars.currentShipHits.length - 1][0]; 

        const possibleMoves = [[firstHitX - 1, y], [lastHitX + 1, y]];
        // filter moves out of boundaries
        const validMoves = possibleMoves.filter(([x, y]) => x < size && x >= 0 && y < size && y >= 0 && map[x][y] !== 'X');

        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        randomX = randomMove[0];
        randomY = randomMove[1];
    }

    return [randomX, randomY];
}

export function handleComputerMove(map, size, ships) {
    let x; 
    let y;
    let move;

    // hunt mode: random moves until you get a hit
    if (computerLogicVars.currentShipHits.length === 0) move = huntMode(map, size);

    // target mode: one hit --> select random adjacent cell until you get second hit
    if (computerLogicVars.currentShipHits.length === 1) move = targetMode(map, size);

    // orientation mode: now we know the orientation --> keep guessing in 2 directions 
    if (computerLogicVars.currentShipHits.length > 1) move = orientationMode(map, size);

    x = move[0];
    y = move[1];

    const cellSelected = document.querySelector(`.container.player-2 .cell[data-id="${x}-${y}"]`);

    if (map[x][y] === '-') {
        // computer misses
        handleHitOrMiss(false, map, cellSelected, x, y);

        setTimeout(() => {
            changeTurn('player-2');
        }, 800);
    } else if (map[x][y] === 'S') {
        // computer hits;
        const ship = ships.find(ship => ship.positions.includes(`${x}-${y}`)); // retrieve the hit ship

        handleHitOrMiss(true, map, cellSelected, x, y);
      
        if (!computerLogicVars.currentShip) {
            computerLogicVars.currentShip = ship;
        }

        // if the cell is a hit but not of the same ship as last hit
        // instead of pushing the move to current ship hit we push to next ship hits
        if (ship === computerLogicVars.currentShip) {
            computerLogicVars.currentShipHits.push([x, y]);
            sortArray(computerLogicVars.currentShipHits);
        } else {
            if (!computerLogicVars.newShipHits[ship.name]) {
                computerLogicVars.newShipHits[ship.name] = [];
            }
            computerLogicVars.newShipHits[ship.name].push([x, y]);
        }

        ship.hits++;

        if (ship.hits === ship.length) {
            sinkShip(ship, `${ship.name}-player-2`);
        
            computerLogicVars.currentShipHits = [];
            computerLogicVars.currentShip = null;

            // Switch focus to next queued ship if any
            const nextShipName = Object.keys(computerLogicVars.newShipHits)[0];
            if (nextShipName) {
                computerLogicVars.currentShip = ships.find(s => s.name === nextShipName);
                computerLogicVars.currentShipHits = computerLogicVars.newShipHits[nextShipName];
                delete computerLogicVars.newShipHits[nextShipName];
            }

            if (gameOver(ships)) {
                setTimeout(handleGameOver, 700);
            }
        };

        if (!gameOver(ships)) {
            setTimeout(() => {
                changeTurn('player-1');
            }, 800);
        }
    }
}

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
