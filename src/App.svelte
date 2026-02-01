<script>
  import Board from './lib/components/Board.svelte';
  import Controls from './lib/components/Controls.svelte';
  import VictoryModal from './lib/components/VictoryModal.svelte';
  import GameOverModal from './lib/components/GameOverModal.svelte';
  import { game, DIFFICULTIES } from './lib/stores/game.js';
  import { currentHighScore } from './lib/stores/highscores.js';
  import { isMuted } from './lib/stores/sounds.js';

  let showInstructions = false;

  const difficultyKeys = Object.keys(DIFFICULTIES);

  function handleDifficultyChange(event) {
    game.setDifficulty(event.target.value);
  }

  function toggleMute() {
    isMuted.toggle();
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
      class="mute-btn"
      class:muted={$isMuted}
      on:click={toggleMute}
      aria-label={$isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {#if $isMuted}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      {/if}
    </button>
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
      <strong>Difficulty:</strong> Choose your challenge level from the dropdown. Harder difficulties
      give fewer moves and bombs, while easier levels are more forgiving.
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

  .mute-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #333;
    background: transparent;
    color: #333;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .mute-btn svg {
    width: 16px;
    height: 16px;
  }

  .mute-btn:hover {
    background: #333;
    color: #fff;
  }

  .mute-btn.muted {
    background: #e74c3c;
    border-color: #e74c3c;
    color: #fff;
  }

  .mute-btn.muted:hover {
    background: #c0392b;
    border-color: #c0392b;
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
