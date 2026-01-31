<script>
  import { game, GRID_SIZE } from '../stores/game.js';
  import Cell from './Cell.svelte';
</script>

<div class="board" style="--grid-size: {GRID_SIZE}">
  {#each $game.grid as row, i}
    {#each row as cell, j}
      <Cell
        color={cell.color}
        controlled={cell.controlled}
        animationWave={cell.animationWave}
        hasBomb={cell.hasBomb}
      />
    {/each}
  {/each}
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(var(--grid-size), 1fr);
    gap: 1px;
    width: 100%;
    max-width: min(90vw, 90vh, 600px);
    aspect-ratio: 1;
    background: #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .board {
      max-width: min(70vw, 70vh, 600px);
    }
  }

  @media (min-width: 1024px) {
    .board {
      max-width: min(60vw, 70vh, 700px);
    }
  }
</style>
