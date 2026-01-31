import { writable, derived } from 'svelte/store';

const GRID_SIZE = 20;
const COLORS = ['red', 'green', 'blue', 'yellow'];

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
          row.map((cell) => ({ ...cell }))
        );

        // Change all controlled cells to the new color
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            if (newGrid[i][j].controlled) {
              newGrid[i][j].color = color;
            }
          }
        }

        // Expand to adjacent cells that match the color
        let changed = true;
        while (changed) {
          changed = false;
          for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
              if (!newGrid[i][j].controlled && newGrid[i][j].color === color) {
                if (hasControlledNeighbor(newGrid, i, j)) {
                  newGrid[i][j].controlled = true;
                  changed = true;
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
export { GRID_SIZE };
