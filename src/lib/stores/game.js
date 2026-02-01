import { writable, derived } from 'svelte/store';

const GRID_SIZE = 20;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const COLORS = ['red', 'green', 'blue', 'yellow'];
const ANIMATION_WAVE_DELAY = 50; // ms delay between each wave

// Difficulty configurations
export const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    moveLimit: 40,
    bombCount: 12,
    bombRadius: 3,
    colorConverterCount: 3,
  },
  medium: {
    name: 'Medium',
    moveLimit: 30,
    bombCount: 8,
    bombRadius: 2,
    colorConverterCount: 2,
  },
  hard: {
    name: 'Hard',
    moveLimit: 22,
    bombCount: 4,
    bombRadius: 2,
    colorConverterCount: 1,
  },
};

const DEFAULT_DIFFICULTY = 'medium';

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createInitialGrid(bombCount, colorConverterCount = 0) {
  const grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push({
        color: randomColor(),
        controlled: i === 0 && j === 0,
        animationWave: null, // Track which wave this cell was captured in
        hasBomb: false,
        hasColorConverter: false,
      });
    }
    grid.push(row);
  }

  // Ensure adjacent cells to the starting cell (0,0) don't have the same color
  const startColor = grid[0][0].color;
  const adjacentCells = [
    [0, 1], // right
    [1, 0], // below
  ];
  for (const [i, j] of adjacentCells) {
    if (grid[i][j].color === startColor) {
      // Pick a different color
      const otherColors = COLORS.filter((c) => c !== startColor);
      grid[i][j].color = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
  }

  // Randomly place bombs (not on the starting cell)
  let bombsPlaced = 0;
  while (bombsPlaced < bombCount) {
    const i = Math.floor(Math.random() * GRID_SIZE);
    const j = Math.floor(Math.random() * GRID_SIZE);
    // Don't place bomb on starting cell or where one already exists
    if (!(i === 0 && j === 0) && !grid[i][j].hasBomb) {
      grid[i][j].hasBomb = true;
      bombsPlaced++;
    }
  }

  // Randomly place color converters (not on starting cell, not on bombs)
  let convertersPlaced = 0;
  while (convertersPlaced < colorConverterCount) {
    const i = Math.floor(Math.random() * GRID_SIZE);
    const j = Math.floor(Math.random() * GRID_SIZE);
    // Don't place on starting cell, bombs, or existing converters
    if (!(i === 0 && j === 0) && !grid[i][j].hasBomb && !grid[i][j].hasColorConverter) {
      grid[i][j].hasColorConverter = true;
      convertersPlaced++;
    }
  }

  return grid;
}

function createGameStore() {
  const initialDifficulty = DIFFICULTIES[DEFAULT_DIFFICULTY];
  const { subscribe, set, update } = writable({
    grid: createInitialGrid(initialDifficulty.bombCount, initialDifficulty.colorConverterCount),
    moveCount: 0,
    difficulty: DEFAULT_DIFFICULTY,
    lastMoveHadExplosion: false,
    lastMoveCapturedCells: 0,
    pendingColorConverter: false, // True when a converter was captured and modal should show
  });

  return {
    subscribe,

    selectColor: (color) => {
      update((state) => {
        const difficultyConfig = DIFFICULTIES[state.difficulty];
        const bombRadius = difficultyConfig.bombRadius;

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

        // Track bombs that need to explode and converters captured
        const bombsToExplode = [];
        let totalCaptured = 0;
        let hadExplosion = false;
        let capturedConverter = false;

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
            totalCaptured++;
            // Check if this cell has a bomb
            if (newGrid[i][j].hasBomb) {
              bombsToExplode.push({ i, j, wave });
              newGrid[i][j].hasBomb = false; // Bomb is consumed
              hadExplosion = true;
            }
            // Check if this cell has a color converter
            if (newGrid[i][j].hasColorConverter) {
              newGrid[i][j].hasColorConverter = false; // Converter is consumed
              capturedConverter = true;
            }
          }

          wave++;
        }

        // Process bomb explosions (can cause chain reactions)
        while (bombsToExplode.length > 0) {
          const bomb = bombsToExplode.shift();
          const explosionWave = bomb.wave + 1;

          // Capture all cells within blast radius
          for (let di = -bombRadius; di <= bombRadius; di++) {
            for (let dj = -bombRadius; dj <= bombRadius; dj++) {
              const ni = bomb.i + di;
              const nj = bomb.j + dj;

              // Check bounds and Manhattan distance
              if (
                ni >= 0 &&
                ni < GRID_SIZE &&
                nj >= 0 &&
                nj < GRID_SIZE &&
                Math.abs(di) + Math.abs(dj) <= bombRadius
              ) {
                if (!newGrid[ni][nj].controlled) {
                  newGrid[ni][nj].controlled = true;
                  newGrid[ni][nj].color = color;
                  newGrid[ni][nj].animationWave = explosionWave;
                  totalCaptured++;

                  // Chain reaction: if this cell has a bomb, add it to the queue
                  if (newGrid[ni][nj].hasBomb) {
                    bombsToExplode.push({ i: ni, j: nj, wave: explosionWave });
                    newGrid[ni][nj].hasBomb = false;
                    hadExplosion = true;
                  }
                  // Check if this cell has a color converter
                  if (newGrid[ni][nj].hasColorConverter) {
                    newGrid[ni][nj].hasColorConverter = false;
                    capturedConverter = true;
                  }
                }
              }
            }
          }
        }

        return {
          ...state,
          grid: newGrid,
          moveCount: state.moveCount + 1,
          lastMoveHadExplosion: hadExplosion,
          lastMoveCapturedCells: totalCaptured,
          pendingColorConverter: capturedConverter,
        };
      });
    },

    applyColorConverter: (fromColor, toColor) => {
      update((state) => {
        const newGrid = state.grid.map((row) =>
          row.map((cell) => {
            // Change all uncontrolled cells of fromColor to toColor
            if (!cell.controlled && cell.color === fromColor) {
              return { ...cell, color: toColor };
            }
            return cell;
          })
        );

        return {
          ...state,
          grid: newGrid,
          pendingColorConverter: false,
        };
      });
    },

    dismissColorConverter: () => {
      update((state) => ({
        ...state,
        pendingColorConverter: false,
      }));
    },

    setDifficulty: (difficulty) => {
      const config = DIFFICULTIES[difficulty];
      set({
        grid: createInitialGrid(config.bombCount, config.colorConverterCount),
        moveCount: 0,
        difficulty: difficulty,
        lastMoveHadExplosion: false,
        lastMoveCapturedCells: 0,
        pendingColorConverter: false,
      });
    },

    reset: () => {
      update((state) => {
        const config = DIFFICULTIES[state.difficulty];
        return {
          grid: createInitialGrid(config.bombCount, config.colorConverterCount),
          moveCount: 0,
          difficulty: state.difficulty,
          lastMoveHadExplosion: false,
          lastMoveCapturedCells: 0,
          pendingColorConverter: false,
        };
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

// Derived store to check if all cells are controlled (game won)
export const isGameWon = derived(game, ($game) => {
  let controlledCount = 0;
  for (const row of $game.grid) {
    for (const cell of row) {
      if (cell.controlled) {
        controlledCount++;
      }
    }
  }
  return controlledCount === TOTAL_CELLS;
});

// Derived store to check if player has run out of moves (game lost)
export const isGameLost = derived(game, ($game) => {
  const config = DIFFICULTIES[$game.difficulty];
  let controlledCount = 0;
  for (const row of $game.grid) {
    for (const cell of row) {
      if (cell.controlled) {
        controlledCount++;
      }
    }
  }
  // Lost if out of moves and not all cells are controlled
  return $game.moveCount >= config.moveLimit && controlledCount < TOTAL_CELLS;
});

export const GAME_COLORS = COLORS;
export { GRID_SIZE, ANIMATION_WAVE_DELAY };
