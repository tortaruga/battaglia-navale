## overview

Game of Battleship made with JS. 
I got the idea because I was solving [a coding challenge on freeCodeCamp](https://www.freecodecamp.org/learn/daily-coding-challenge/2025-10-24) that reminded me of battleship, so of course I got obsessed with the idea of coding my own Battleship game.
I had fond memories of the game before this project, but during testing I played so many times that I never want to hear about this game again for at least another twenty years.

#### made with

- JS
- HTML5
- CSS (SASS)

#### features

- **Solo** mode play
- **2 players** mode play (on the same device)
- **play against computer**
- **sound effects**: a splashing sound for misses, and a ship breaking sound for hits
- **accessible through keyboard**: the cells are buttons, so the game can be played without mouse as well
- during one player's turn, **the other player's cells are disabled** so they can't be clicked until the turn changes again

**The game selects random positions for both players' ships.**

### instructions

In case you're not familiar with the game, the goal is to find and sink all the opponent's ships.
Click on any cell and discover if you hit a ship or just water. In this version of the game you need to find 4 ships: a 5-cell-long aircraft carrier, a 4-cell-long cruiser, a 3-cell-long submarine, and a 2-cell-long destroyer. The first player to sink all the opponent's ships wins.

##### how the game works 

The game uses a 2D array to represent a map for each player:

```
const map = [
    ['-', 'S', '-'],
    ['-', 'S', '-'],
    ['-', '-', '-'],
]
```

This, for example, is what a 3x3 map would look like. **'-' represents an empty cell, while 'S' represents a cell containing part of a ship.**

Each player also has an array of ships to keep track of their ships' state: each ship is an object with properties like:
- name
- length 
- hit count
- positions 
- condition (sunk or not sunk);

The ships are placed on this virtual map randomly, by following these steps: 
1. choose a random orientation for the ship (horizontal or vertical);
2. select a pair of random X and Y coordinates to act as starting point for the ship;
3. if the spot represented by map[x][y] is not empty, or if the ship we're trying to place is too long to fit in the grid, select a new pair of coordinates;
4. If all the spots we need for our ship are available, replace those spots with 'S' and save the coordinates in the ship's position property (we will need them to check which ships are sunk).  

#### UI gameboard

In addition to the virtual map, each player also has a gameboard made up of cells, each with a data-id attribute corresponding to its coordinates. When clicking a cell, the coordinates are retrieved from the data-id, and we check whether the cell corresponds to a hit or miss:

1. **Miss**: if the corresponding map[x][y] === '-', the player missed.
   - update map[x][y] to 'X' (to keep track of cells that were already clicked);
   - pass turn to other player (if not in solo mode);
2. **Hit**: if the corresponding map[x][y] === 'S', the player hit a part of ship.
    - update the virtual map with 'X', 
    - increase the hit count for that ship,
    - check whether all cells of that ship have been sunk;
3. **Ship sunk**: if all cells of a ship were hit 
    - update the condition in the ship's object
    - cross out the ship's name in the scoreboard, to let the user know it has been found;
4. **game over check**: after a ship has been completely sunk, we check whether all ships have been found: in that case the game is over;
5. **continue game**: if the player hits but they have not found all ships, they keep selecting cells until the miss;
    - when they miss, the turn passes to the next player. 

#### play against computer mode

If the player is facing the computer, the computer move is chosen following this strategy: 

1. **No hit last turn**: if the previous move was a miss, the computer selects a random cell among all unclicked cells (`map[x][y] !== 'X'`);
2. **First hit on a ship**: if the previous move was a hit and it’s the *first* cell of a new ship, the computer chooses randomly among the four adjacent cells (up, down, left, right);
3. **Ship orientation found**: once the computer hits a second cell of the same ship, it knows the ship’s orientation.  
   - It then continues attacking along that line, choosing cells on either side of the discovered segment.  
   - This continues until the ship is completely sunk, or until the computer misses and the turn passes back to the player.
