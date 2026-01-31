import { writable, derived } from 'svelte/store';

const GRID_SIZE = 20;
const COLORS = ['red', 'green', 'blue', 'yellow'];
const ANIMATION_WAVE_DELAY = 50; // ms delay between each wave

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
      });
    }
    grid.push(row);
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
          }

          wave++;
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
