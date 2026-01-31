<script>
  import { game, GAME_COLORS, isGameWon, isGameLost, DIFFICULTIES } from '../stores/game.js';

  const colorMap = {
    red: '#e74c3c',
    green: '#27ae60',
    blue: '#3498db',
    yellow: '#f1c40f',
  };

  $: difficultyConfig = DIFFICULTIES[$game.difficulty];
  $: moveLimit = difficultyConfig.moveLimit;
  $: isGameOver = $isGameWon || $isGameLost;
</script>

<div class="controls-panel">
  <div class="controls-header">
    <span class="moves-display">Moves: {$game.moveCount} / {moveLimit}</span>
  </div>
  <div class="control-buttons">
    {#each GAME_COLORS as color}
      <button
        class="color-btn"
        class:disabled={isGameOver}
        style="background-color: {colorMap[color]}"
        aria-label={color}
        disabled={isGameOver}
        on:click={() => game.selectColor(color)}
      ></button>
    {/each}
  </div>
</div>

<style>
  .controls-panel {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    box-sizing: border-box;
  }

  .controls-header {
    display: flex;
    align-items: center;
  }

  .moves-display {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }

  .control-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }

  .color-btn {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    -webkit-tap-highlight-color: transparent;
  }

  .color-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .color-btn:active {
    transform: scale(0.95);
  }

  .color-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .color-btn.disabled:hover {
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 768px) {
    .controls-panel {
      flex-direction: column;
      width: auto;
      max-width: none;
      padding: 1.5rem;
      margin-bottom: 0;
      position: sticky;
      top: 1rem;
    }

    .control-buttons {
      flex-direction: column;
    }

    .color-btn {
      width: 56px;
      height: 56px;
    }

    .moves-display {
      font-size: 1.125rem;
    }
  }

  @media (min-width: 1024px) {
    .color-btn {
      width: 64px;
      height: 64px;
    }
  }

  @media (max-width: 360px) {
    .controls-panel {
      flex-direction: column;
      gap: 0.5rem;
    }

    .color-btn {
      width: 40px;
      height: 40px;
    }
  }
</style>
