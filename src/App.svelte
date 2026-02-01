<script>
  import Board from './lib/components/Board.svelte';
  import Controls from './lib/components/Controls.svelte';
  import VictoryModal from './lib/components/VictoryModal.svelte';
  import GameOverModal from './lib/components/GameOverModal.svelte';
  import ColorConverterModal from './lib/components/ColorConverterModal.svelte';
  import { game, DIFFICULTIES } from './lib/stores/game.js';
  import { currentHighScore } from './lib/stores/highscores.js';

  let showInstructions = false;

  const difficultyKeys = Object.keys(DIFFICULTIES);

  function handleDifficultyChange(event) {
    game.setDifficulty(event.target.value);
  }
</script>

<header class="navbar">
  <div class="navbar-brand">Dots</div>
  <div class="navbar-controls">
    <select
      class="difficulty-select"
      value={$game.difficulty}
      on:change={handleDifficultyChange}
      aria-label="Select difficulty"
    >
      {#each difficultyKeys as key}
        <option value={key}>{DIFFICULTIES[key].name}</option>
      {/each}
    </select>
    <button
      class="help-btn"
      class:active={showInstructions}
      on:click={() => (showInstructions = !showInstructions)}
      aria-label="How to play"
      aria-expanded={showInstructions}
    >
      ?
    </button>
  </div>
</header>

{#if showInstructions}
  <div class="instructions">
    <h3>How to Play</h3>
    <p>
      <strong>Goal:</strong> Fill the entire board with one color before running out of moves.
    </p>
    <p>
      <strong>Starting point:</strong> You control the dot in the top-left corner.
    </p>
    <p>
      <strong>Making moves:</strong> Click a color button to change your territory to that color.
      Any adjacent dots matching that color will be captured and added to your territory.
    </p>
    <p>
      <strong>Bombs:</strong> Some dots contain bombs. When you capture a bomb, it explodes and
      captures all nearby dots regardless of their color!
    </p>
    <p>
      <strong>Color Converters:</strong> Some dots contain color converters. When captured, you can
      change all uncontrolled dots of one color to another color of your choice!
    </p>
    <p>
      <strong>Difficulty:</strong> Choose your challenge level from the dropdown. Harder difficulties
      give fewer moves, bombs, and converters.
    </p>
  </div>
{/if}

{#if $currentHighScore !== null}
  <div class="high-score-banner">
    Best on {DIFFICULTIES[$game.difficulty].name}: {$currentHighScore} moves
  </div>
{/if}

<main class="game-wrapper">
  <Controls />
  <Board />
</main>

<VictoryModal />
<GameOverModal />
<ColorConverterModal />

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
    background: #fff;
    min-height: 100vh;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
  }

  .navbar-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
  }

  .navbar-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .difficulty-select {
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    background: #f8f9fa;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    padding-right: 1.75rem;
  }

  .difficulty-select:hover {
    border-color: #333;
  }

  .difficulty-select:focus {
    outline: none;
    border-color: #333;
    box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.1);
  }

  .help-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #333;
    background: transparent;
    font-size: 1rem;
    font-weight: 700;
    color: #333;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .help-btn:hover {
    background: #333;
    color: #fff;
  }

  .help-btn.active {
    background: #333;
    color: #fff;
  }

  .high-score-banner {
    background: linear-gradient(135deg, #f8f9fa, #fff);
    border-bottom: 1px solid #e0e0e0;
    padding: 0.5rem 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: #666;
    font-weight: 500;
  }

  .instructions {
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .instructions h3 {
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.75rem;
  }

  .instructions p {
    font-size: 0.875rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .instructions p:last-child {
    margin-bottom: 0;
  }

  .instructions strong {
    color: #333;
  }

  .game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    max-width: 100%;
  }

  @media (min-width: 768px) {
    .game-wrapper {
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      gap: 2rem;
      padding: 2rem;
    }
  }
</style>
