const map = [];
const size = 10;

function initializeEmptyBoard() {

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push('-');
        }
        map.push(row);
    }

}

initializeEmptyBoard();


const ships = [
  { name: "Portaerei", length: 5},
  { name: "Incrociatore", length: 4},
  { name: "Sottomarino", length: 3},
  { name: "Cacciatorpediniere", length: 2}
];

// for each ship in ships:
//   do:
//     orientation = random horizontal or vertical
//     startX, startY = random starting point based on orientation and ship length
//     cells = calculate all coordinates the ship would occupy
//   if none of those cells is already occupied
//   place ship

function placeShips(ships) {
    const orientations = ['horizontal', 'vertical'];

    for (let ship of ships) {
        const orientation = orientations[Math.floor(Math.random() * orientations.length)];
        let startX;
        let startY;

        do {
            startX = Math.floor(Math.random() * size);
            startY = Math.floor(Math.random() * size);
        } while (!canPlaceShip(map, startX, startY, orientation, ship.length));

        if (orientation === 'vertical') {
            for (let i = startX; i < startX + ship.length; i++) {
                map[i][startY] = 'S';
            }
        } else {
            for (let i = startY; i < startY + ship.length; i++) {
                map[startX][i] = 'S';
            }
        }
    }
}

placeShips(ships)

function canPlaceShip(map, startX, startY, orientation, shipLength) {
    // if all cells the ship would occupy are free return true
    if (orientation === 'vertical') {
        // x goes from startX to startX + shipLength
        // y is always startY
        if (startX + shipLength > size) return false;
        for (let i = startX; i < startX + shipLength; i++) {
            if (map[i][startY] !== '-') return false;
        } 
    } else {
        // x is always startX 
        // y goes from startY to startY + shipLength
        if (startY + shipLength > size) return false;
        for (i = startY; i < startY + shipLength; i++) {
            if (map[startX][i] !== '-') return false;
        }
    }

    return true;
}
