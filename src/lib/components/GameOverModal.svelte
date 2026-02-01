<script>
  import { game, isGameLost, DIFFICULTIES } from '../stores/game.js';
  import { sounds } from '../stores/sounds.js';
  import { fade, scale } from 'svelte/transition';

  $: moveLimit = DIFFICULTIES[$game.difficulty].moveLimit;

  let hasPlayedSound = false;

  // Play game over sound when game is lost
  $: if ($isGameLost && !hasPlayedSound) {
    sounds.gameOver();
    hasPlayedSound = true;
  }

  // Reset sound flag when game resets
  $: if (!$isGameLost) {
    hasPlayedSound = false;
  }

  function handleRestart() {
    game.reset();
  }
</script>

{#if $isGameLost}
  <div class="overlay" transition:fade={{ duration: 300 }}>
    <div class="modal" transition:scale={{ duration: 400, delay: 100 }}>
      <div class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15s1.5-2 4-2 4 2 4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3" stroke-linecap="round" />
          <line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3" stroke-linecap="round" />
        </svg>
      </div>
      <h2>Out of Moves!</h2>
      <p class="stats">You used all <strong>{moveLimit}</strong> moves</p>
      <button class="restart-btn" on:click={handleRestart}>
        Try Again
      </button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    overflow: hidden;
  }

  .modal {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    width: 320px;
    z-index: 1;
  }

  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: #e74c3c;
    animation: icon-shake 0.6s ease-out;
  }

  .icon svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 8px rgba(231, 76, 60, 0.4));
  }

  @keyframes icon-shake {
    0%, 100% {
      transform: rotate(0deg);
    }
    20% {
      transform: rotate(-10deg);
    }
    40% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(-5deg);
    }
    80% {
      transform: rotate(5deg);
    }
  }

  h2 {
    font-size: 2rem;
    color: #333;
    margin: 0 0 0.75rem;
    font-weight: 700;
  }

  .stats {
    font-size: 1.125rem;
    color: #666;
    margin: 0 0 1.5rem;
  }

  .stats strong {
    color: #333;
    font-size: 1.5rem;
  }

  .restart-btn {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  }

  .restart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.5);
  }

  .restart-btn:active {
    transform: translateY(0);
  }

  @media (max-width: 360px) {
    .modal {
      padding: 1.5rem;
    }

    .icon {
      width: 60px;
      height: 60px;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
</style>
