import { player1Map, player1Ships, player2Map, player2Ships, size, state } from "./variables.js";
import { reset } from "./reset.js";

document.querySelector('.mode').addEventListener('click', (e) => {
    if (e.target.id === 'solo') {
        state.mode = 'solo';
    } else if (e.target.id === '2-players') {
        state.mode = '2-players';
    } else if (e.target.id === 'computer') {
        state.mode = 'computer';
    } else {
        return;
    }

    // reset board if mode gets changed during a game
    reset(player1Map, player1Ships, size);
    reset(player2Map, player2Ships, size);

    handleMode(state.mode);
}) 


function handleMode(mode) {
    // show / hide player 2 board depending on mode selected
    if (mode === 'solo') {
        document.querySelector('.container.player-2').classList.add('hide');
    } else {
        document.querySelector('.container.player-2').classList.remove('hide');
    }    
}
