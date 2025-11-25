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
  { name: "Portaerei", length: 5, positions: [], hits: 0, sunk: false},
  { name: "Incrociatore", length: 4, positions: [], hits: 0, sunk: false},
  { name: "Sottomarino", length: 3, positions: [], hits: 0, sunk: false},
  { name: "Cacciatorpediniere", length: 2, positions: [], hits: 0, sunk: false}
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
                ship.positions.push(`${i}-${startY}`);
            }
        } else {
            for (let i = startY; i < startY + ship.length; i++) {
                map[startX][i] = 'S';
                ship.positions.push(`${startX}-${i}`);
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


function renderGameboard() {
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `${Math.floor(i / size)}-${i % size}`;
        document.querySelector('.container').appendChild(cell);
        cell.onclick = handleCell;  
    }
}
renderGameboard(); 

function handleCell(e) { 
    const id = e.target.id;
    const x = id.split('-')[0];
    const y = id.split('-')[1];

    if (map[x][y] === '-') {
        e.target.classList.add('empty');
    } else if (map[x][y] === 'S') {
        e.target.classList.add('sunk');
        map[x][y] = 'X';
        const ship = ships.find(ship => ship.positions.includes(id));
        ship.hits++;

        if (ship.hits === ship.length) {
            const p = Array.from(document.querySelectorAll('.ship')).find(p => p.id === ship.name);
            p.classList.add('completed');
            ship.sunk = true;

            if (gameOver()) {
                document.getElementById('game-over').classList.remove('hide');
            }
        };
    } else if (map[x][y] = 'X') {
        return;
    }
}

function scoreBoard() {
    ships.forEach(ship => {
        const p = document.createElement('div');
        p.innerHTML = `${ship.name}: ${ship.length}`;
        p.id = ship.name;
        p.classList.add('ship');
        document.querySelector('.ships').appendChild(p);
    })
}

scoreBoard(); 

function gameOver() {
    return ships.every(ship => ship.sunk);
}
