# Claude.md

## Project Overview

This is a **Flood-It** puzzle game built with Svelte and Vite. The player captures territory on a grid by selecting colors, starting from the top-left corner and expanding to adjacent cells that match the selected color.

## Tech Stack

- **Framework**: Svelte 4.2
- **Build Tool**: Vite 5.2
- **Language**: JavaScript (ES6+)
- **Deployment**: GitHub Pages via GitHub Actions

## Quick Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Board.svelte      # Grid display using CSS Grid
│   │   ├── Cell.svelte       # Individual colored cell
│   │   └── Controls.svelte   # Color buttons and move counter
│   └── stores/
│       └── game.js           # Game state and logic (Svelte stores)
├── App.svelte                # Main layout with navbar
└── main.js                   # Entry point
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/stores/game.js` | Core game logic: grid creation, color selection, flood fill expansion |
| `src/lib/components/Board.svelte` | Renders the NxN grid, handles color selection clicks |
| `src/lib/components/Controls.svelte` | Color palette buttons, move counter, new game button |
| `spec.md` | Detailed gameplay specification |

## Game Architecture

### State Management

Game state uses Svelte's `writable` store:

```javascript
{
  grid: Cell[][],     // 2D array of {color: string, controlled: boolean}
  moveCount: number   // Number of moves taken
}
```

### Store Actions

- `game.selectColor(color)` - Execute a move
- `game.reset()` - Start new game

### Configuration Constants

Located in `src/lib/stores/game.js`:
- `GRID_SIZE` = 20
- `COLORS` = ['red', 'green', 'blue', 'yellow']

## Coding Patterns

### Svelte Components

- Components are in `src/lib/components/`
- Use `<script>`, template, and `<style>` sections
- Import stores with `import { game } from '../stores/game.js'`
- Subscribe to stores using `$game` syntax

### CSS

- Scoped styles in component `<style>` blocks
- Global styles use `:global()` selector in `App.svelte`
- Responsive design with `@media (min-width: 768px)` breakpoint
- CSS Grid for board layout, Flexbox for general layout

### State Updates

Always create new objects/arrays when updating state (immutability):
```javascript
const newGrid = state.grid.map(row => row.map(cell => ({ ...cell })));
```

## Common Tasks

### Adding a New Color
1. Add color to `COLORS` array in `game.js`
2. Color automatically appears in Controls component

### Changing Grid Size
1. Modify `GRID_SIZE` constant in `game.js`
2. Board component auto-adjusts via CSS Grid

### Adding New Game Features
1. Update state shape in `createGameStore()`
2. Add new actions to the store's return object
3. Update components to use new state/actions

## Testing

No test framework currently configured. To add tests:
1. Install vitest: `npm install -D vitest`
2. Add test script to package.json
3. Create `*.test.js` files alongside source files
