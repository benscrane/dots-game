import { writable, derived } from 'svelte/store';

const GRID_SIZE = 20;
const COLORS = ['red', 'green', 'blue', 'yellow'];
const ANIMATION_WAVE_DELAY = 50; // ms delay between each wave
const BOMB_COUNT = 8; // Number of bombs to place on the board
const BOMB_RADIUS = 2; // Blast radius (Manhattan distance)

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createInitialGrid() {
  const grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push({
        color: randomColor(),
        controlled: i === 0 && j === 0,
        animationWave: null, // Track which wave this cell was captured in
        hasBomb: false,
      });
    }
    grid.push(row);
  }

  // Randomly place bombs (not on the starting cell)
  let bombsPlaced = 0;
  while (bombsPlaced < BOMB_COUNT) {
    const i = Math.floor(Math.random() * GRID_SIZE);
    const j = Math.floor(Math.random() * GRID_SIZE);
    // Don't place bomb on starting cell or where one already exists
    if (!(i === 0 && j === 0) && !grid[i][j].hasBomb) {
      grid[i][j].hasBomb = true;
      bombsPlaced++;
    }
  }

  return grid;
}

function createGameStore() {
  const { subscribe, set, update } = writable({
    grid: createInitialGrid(),
    moveCount: 0,
  });

  return {
    subscribe,

    selectColor: (color) => {
      update((state) => {
        const newGrid = state.grid.map((row) =>
          row.map((cell) => ({ ...cell, animationWave: null }))
        );

        // Change all controlled cells to the new color
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            if (newGrid[i][j].controlled) {
              newGrid[i][j].color = color;
            }
          }
        }

        // Track bombs that need to explode
        const bombsToExplode = [];

        // Expand to adjacent cells that match the color, tracking waves
        let wave = 0;
        let changed = true;
        while (changed) {
          changed = false;
          const cellsToCapture = [];

          for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
              if (!newGrid[i][j].controlled && newGrid[i][j].color === color) {
                if (hasControlledNeighbor(newGrid, i, j)) {
                  cellsToCapture.push({ i, j });
                  changed = true;
                }
              }
            }
          }

          // Capture all cells in this wave with the wave number for animation
          for (const { i, j } of cellsToCapture) {
            newGrid[i][j].controlled = true;
            newGrid[i][j].animationWave = wave;
            // Check if this cell has a bomb
            if (newGrid[i][j].hasBomb) {
              bombsToExplode.push({ i, j, wave });
              newGrid[i][j].hasBomb = false; // Bomb is consumed
            }
          }

          wave++;
        }

        // Process bomb explosions (can cause chain reactions)
        while (bombsToExplode.length > 0) {
          const bomb = bombsToExplode.shift();
          const explosionWave = bomb.wave + 1;

          // Capture all cells within blast radius
          for (let di = -BOMB_RADIUS; di <= BOMB_RADIUS; di++) {
            for (let dj = -BOMB_RADIUS; dj <= BOMB_RADIUS; dj++) {
              const ni = bomb.i + di;
              const nj = bomb.j + dj;

              // Check bounds and Manhattan distance
              if (
                ni >= 0 &&
                ni < GRID_SIZE &&
                nj >= 0 &&
                nj < GRID_SIZE &&
                Math.abs(di) + Math.abs(dj) <= BOMB_RADIUS
              ) {
                if (!newGrid[ni][nj].controlled) {
                  newGrid[ni][nj].controlled = true;
                  newGrid[ni][nj].color = color;
                  newGrid[ni][nj].animationWave = explosionWave;

                  // Chain reaction: if this cell has a bomb, add it to the queue
                  if (newGrid[ni][nj].hasBomb) {
                    bombsToExplode.push({ i: ni, j: nj, wave: explosionWave });
                    newGrid[ni][nj].hasBomb = false;
                  }
                }
              }
            }
          }
        }

        return {
          grid: newGrid,
          moveCount: state.moveCount + 1,
        };
      });
    },

    reset: () => {
      set({
        grid: createInitialGrid(),
        moveCount: 0,
      });
    },
  };
}

function hasControlledNeighbor(grid, i, j) {
  // Check above
  if (i > 0 && grid[i - 1][j].controlled) return true;
  // Check below
  if (i < GRID_SIZE - 1 && grid[i + 1][j].controlled) return true;
  // Check left
  if (j > 0 && grid[i][j - 1].controlled) return true;
  // Check right
  if (j < GRID_SIZE - 1 && grid[i][j + 1].controlled) return true;
  return false;
}

export const game = createGameStore();
export const GAME_COLORS = COLORS;
export { GRID_SIZE, ANIMATION_WAVE_DELAY };
