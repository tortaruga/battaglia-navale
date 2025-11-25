export let player1Map = [];
export const size = 10;

export const state = {
    mode: 'solo',
    playerTurn: 'player-1',
};

export const player1Ships = [
  { name: "Portaerei", length: 5, positions: [], hits: 0, sunk: false},
  { name: "Incrociatore", length: 4, positions: [], hits: 0, sunk: false},
  { name: "Sottomarino", length: 3, positions: [], hits: 0, sunk: false},
  { name: "Cacciatorpediniere", length: 2, positions: [], hits: 0, sunk: false}
];

export let player2Map = [];
export const player2Ships = [
  { name: "Portaerei", length: 5, positions: [], hits: 0, sunk: false},
  { name: "Incrociatore", length: 4, positions: [], hits: 0, sunk: false},
  { name: "Sottomarino", length: 3, positions: [], hits: 0, sunk: false},
  { name: "Cacciatorpediniere", length: 2, positions: [], hits: 0, sunk: false}
];
