<script>
  import Board from './lib/components/Board.svelte';
  import Controls from './lib/components/Controls.svelte';
  import VictoryModal from './lib/components/VictoryModal.svelte';

  let showInstructions = false;
</script>

<header class="navbar">
  <div class="navbar-brand">Dots</div>
  <button
    class="help-btn"
    class:active={showInstructions}
    on:click={() => (showInstructions = !showInstructions)}
    aria-label="How to play"
    aria-expanded={showInstructions}
  >
    ?
  </button>
</header>

{#if showInstructions}
  <div class="instructions">
    <h3>How to Play</h3>
    <p>
      <strong>Goal:</strong> Fill the entire board with one color.
    </p>
    <p>
      <strong>Starting point:</strong> You control the dot in the top-left corner.
    </p>
    <p>
      <strong>Making moves:</strong> Click a color button to change your territory to that color.
      Any adjacent dots matching that color will be captured and added to your territory.
    </p>
    <p>
      <strong>Strategy:</strong> Try to win in as few moves as possible!
    </p>
  </div>
{/if}

<main class="game-wrapper">
  <Controls />
  <Board />
</main>

<VictoryModal />

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
