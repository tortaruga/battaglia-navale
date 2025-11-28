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

