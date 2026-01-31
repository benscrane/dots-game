# Flood-It Game Specification

A single-player puzzle game where the player progressively captures territory on a grid by changing colors. The goal is to flood the entire board with a single color within a limited number of moves.

## Game Overview

Starting from the top-left corner, the player selects colors to expand their territory. When a color is selected, all controlled cells change to that color, and any adjacent cells matching the new color are absorbed into the player's territory. This continues until the entire board is captured or the move limit is reached.

## Game Configuration

| Parameter | Default Value | Description |
|-----------|---------------|-------------|
| Grid Size | 20 x 20 | Number of rows and columns |
| Colors | 4 | red, green, blue, yellow |
| Move Limit | 25 | Maximum moves allowed (optional) |
| Origin | Top-left (0,0) | Starting cell for player territory |
| Bomb Count | 8 | Number of bomb powerups on the board |
| Bomb Radius | 2 | Blast radius (Manhattan distance) |

## Game State

### Board

- An N x N grid of cells
- Each cell has:
  - `color`: One of the available colors
  - `controlled`: Boolean indicating if the cell is part of player territory
  - `hasBomb`: Boolean indicating if the cell contains a bomb powerup
- Colors are randomly assigned at game start
- Bombs are randomly distributed (excluding the starting cell)

### Player Territory

- A contiguous region of cells starting from the origin (top-left corner)
- All cells in the player's territory share the same color
- Territory expands by absorbing adjacent matching cells

### Move Counter

- Tracks the number of color selections made
- Increments after each valid move
- Used to determine win/loss condition when move limit is enabled

## Gameplay Loop

1. **Initialize**: Generate grid with random colors; mark origin cell as controlled
2. **Player selects a color** from the palette (excluding current territory color)
3. **Territory expansion**:
   - All controlled cells change to the selected color
   - Adjacent uncontrolled cells matching the selected color are absorbed
   - Absorption cascades recursively until no more matches are found
4. **Increment move counter**
5. **Check win/loss condition**:
   - **Win**: All cells on the board are controlled
   - **Loss**: Move limit reached before capturing all cells
   - **Continue**: Return to step 2

## Adjacency Rules

Two cells are adjacent if they share an edge (orthogonal neighbors only):
- Up: `(row - 1, col)`
- Down: `(row + 1, col)`
- Left: `(row, col - 1)`
- Right: `(row, col + 1)`

Diagonal neighbors are **not** considered adjacent.

## Bomb Powerups

Bombs are special powerups randomly distributed across the board that help the player capture territory faster.

### Configuration

| Parameter | Default Value | Description |
|-----------|---------------|-------------|
| Bomb Count | 8 | Number of bombs placed on the board |
| Blast Radius | 2 | Manhattan distance of explosion effect |

### Behavior

- Bombs are randomly placed during board initialization (never on the starting cell)
- Each bomb is displayed as an icon inside its cell
- When a cell containing a bomb is captured (through normal flood-fill expansion), the bomb explodes
- The explosion captures all cells within the blast radius, **regardless of their color**
- Captured cells are converted to the player's current color
- The bomb is consumed after exploding

### Chain Reactions

- If an explosion captures a cell containing another bomb, that bomb also explodes
- Chain reactions continue until no more bombs are triggered
- Each explosion in a chain uses incrementing animation waves for visual effect

### Blast Radius

The blast radius uses Manhattan distance (not Euclidean):
- A radius of 2 means cells up to 2 steps away (orthogonally) are affected
- Example pattern for radius 2:
  ```
      X
    X X X
  X X B X X
    X X X
      X
  ```
  Where B = bomb location, X = affected cells

## Expansion Algorithm

```
function expandTerritory(grid, newColor):
    // Phase 1: Change all controlled cells to the new color
    for each cell in grid:
        if cell.controlled:
            cell.color = newColor

    // Phase 2: Iteratively absorb matching adjacent cells
    bombsToExplode = []
    repeat:
        changed = false
        for each cell in grid:
            if not cell.controlled and cell.color == newColor:
                if hasControlledNeighbor(cell):
                    cell.controlled = true
                    changed = true
                    if cell.hasBomb:
                        bombsToExplode.add(cell)
                        cell.hasBomb = false
    until not changed

    // Phase 3: Process bomb explosions (with chain reactions)
    while bombsToExplode is not empty:
        bomb = bombsToExplode.pop()
        for each cell within BOMB_RADIUS (Manhattan distance) of bomb:
            if not cell.controlled:
                cell.controlled = true
                cell.color = newColor
                if cell.hasBomb:
                    bombsToExplode.add(cell)
                    cell.hasBomb = false
```

## Win/Loss Conditions

| Condition | Trigger | Result |
|-----------|---------|--------|
| Win | All cells are controlled | Display victory message with move count |
| Loss | Move count >= move limit | Display game over, offer restart |
| Continue | Neither condition met | Continue gameplay |

## Scoring

- **Primary metric**: Number of moves to complete the board
- **Fewer moves = better score**
- **Par calculation** (optional): `floor(gridSize * 1.5)` for standard difficulty

## UI Components

### Board (`Board.svelte`)
- Renders the grid using CSS Grid
- Responsive sizing based on viewport
- Displays all cells with their current colors

### Cell (`Cell.svelte`)
- Individual colored cell
- Visual indicator for controlled cells (e.g., white shadow/border)
- Non-interactive (clicks handled at board level)

### Controls (`Controls.svelte`)
- Color palette buttons for player selection
- Current move count display
- New game / reset button
- Optional: Move limit indicator

## State Management

Game state is managed via Svelte stores (`src/lib/stores/game.js`):

```javascript
{
  grid: Cell[][],      // 2D array of {color, controlled, hasBomb}
  moveCount: number,   // Current number of moves
}
```

### Store Actions

| Action | Description |
|--------|-------------|
| `selectColor(color)` | Execute a move with the given color |
| `reset()` | Start a new game with fresh random grid |

### Derived State

| State | Derivation |
|-------|------------|
| `isWon` | All cells have `controlled: true` |
| `isLost` | `moveCount >= moveLimit` (if limit enabled) |
| `currentColor` | Color of the origin cell |
| `controlledCount` | Number of cells with `controlled: true` |

## File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Board.svelte      # Grid display
│   │   ├── Cell.svelte       # Individual cell
│   │   └── Controls.svelte   # Color buttons & stats
│   └── stores/
│       └── game.js           # Game state & logic
├── App.svelte                # Main layout
└── main.js                   # Entry point
```

## Future Enhancements

- [ ] Move limit enforcement with loss condition
- [ ] Victory detection and celebration
- [ ] Difficulty levels (grid size / color count)
- [ ] Move history and undo functionality
- [ ] Best score tracking (localStorage)
- [ ] Hint system showing optimal next move
- [ ] Colorblind-friendly palette options
