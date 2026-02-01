<script>
  import { game, isGameWon, DIFFICULTIES } from '../stores/game.js';
  import { highScores, currentHighScore } from '../stores/highscores.js';
  import { fade, scale } from 'svelte/transition';

  $: moveCount = $game.moveCount;
  $: difficulty = $game.difficulty;
  $: difficultyName = DIFFICULTIES[difficulty].name;

  let isNewRecord = false;

  // Check for new record when game is won
  $: if ($isGameWon) {
    isNewRecord = highScores.checkAndUpdate(difficulty, moveCount);
  }

  // Reset record flag when game resets
  $: if (!$isGameWon) {
    isNewRecord = false;
  }

  function handleRestart() {
    game.reset();
  }
</script>

{#if $isGameWon}
  <div class="overlay" transition:fade={{ duration: 300 }}>
    <div class="confetti-container">
      {#each Array(50) as _, i}
        <div
          class="confetti"
          style="--delay: {Math.random() * 3}s; --x: {Math.random() * 100}vw; --color: {['#e74c3c', '#27ae60', '#3498db', '#f1c40f'][i % 4]}"
        ></div>
      {/each}
    </div>
    <div class="modal" transition:scale={{ duration: 400, delay: 100 }}>
      {#if isNewRecord}
        <div class="new-record-badge">New Record!</div>
      {/if}
      <div class="trophy" class:new-record={isNewRecord}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 21h8m-4-4v4m-5-8a5 5 0 0 1-4-5V4h18v4a5 5 0 0 1-4 5m-5 0v4"/>
          <path d="M5 4v4a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5V4"/>
        </svg>
      </div>
      <h2>You Won!</h2>
      <p class="stats">Completed in <strong>{moveCount}</strong> moves</p>
      {#if $currentHighScore !== null}
        <p class="high-score">
          Best on {difficultyName}: <strong>{$currentHighScore}</strong> moves
        </p>
      {/if}
      <button class="restart-btn" on:click={handleRestart}>
        Play Again
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

  .confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .confetti {
    position: absolute;
    top: -10px;
    left: var(--x);
    width: 10px;
    height: 10px;
    background: var(--color);
    border-radius: 2px;
    animation: confetti-fall 3s ease-in-out infinite;
    animation-delay: var(--delay);
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
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
    position: relative;
  }

  .new-record-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #f1c40f, #e67e22);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(241, 196, 15, 0.4);
    animation: badge-pulse 1s ease-in-out infinite alternate;
  }

  @keyframes badge-pulse {
    0% {
      transform: translateX(-50%) scale(1);
    }
    100% {
      transform: translateX(-50%) scale(1.05);
    }
  }

  .trophy {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: #f1c40f;
    animation: trophy-bounce 0.6s ease-out;
  }

  .trophy.new-record {
    animation: trophy-bounce 0.6s ease-out, trophy-glow 1.5s ease-in-out infinite alternate;
  }

  .trophy svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 8px rgba(241, 196, 15, 0.4));
  }

  @keyframes trophy-bounce {
    0% {
      transform: scale(0) rotate(-20deg);
    }
    50% {
      transform: scale(1.2) rotate(10deg);
    }
    70% {
      transform: scale(0.9) rotate(-5deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes trophy-glow {
    0% {
      filter: drop-shadow(0 4px 8px rgba(241, 196, 15, 0.4));
    }
    100% {
      filter: drop-shadow(0 4px 20px rgba(241, 196, 15, 0.8));
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
    margin: 0 0 0.5rem;
  }

  .stats strong {
    color: #333;
    font-size: 1.5rem;
  }

  .high-score {
    font-size: 0.9rem;
    color: #888;
    margin: 0 0 1.5rem;
  }

  .high-score strong {
    color: #f1c40f;
    font-weight: 700;
  }

  .restart-btn {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
  }

  .restart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.5);
  }

  .restart-btn:active {
    transform: translateY(0);
  }

  @media (max-width: 360px) {
    .modal {
      padding: 1.5rem;
    }

    .trophy {
      width: 60px;
      height: 60px;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
</style>
