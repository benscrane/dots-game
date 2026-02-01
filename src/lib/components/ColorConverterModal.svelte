<script>
  import { game, GAME_COLORS } from '../stores/game.js';
  import { fade, scale } from 'svelte/transition';

  const colorMap = {
    red: '#e74c3c',
    green: '#27ae60',
    blue: '#3498db',
    yellow: '#f1c40f',
  };

  let fromColor = null;
  let toColor = null;

  $: showModal = $game.pendingColorConverter;

  // Reset selections when modal opens
  $: if (showModal) {
    fromColor = null;
    toColor = null;
  }

  $: canApply = fromColor !== null && toColor !== null && fromColor !== toColor;

  function handleApply() {
    if (canApply) {
      game.applyColorConverter(fromColor, toColor);
    }
  }

  function handleSkip() {
    game.dismissColorConverter();
  }
</script>

{#if showModal}
  <div class="overlay" transition:fade={{ duration: 200 }}>
    <div class="modal" transition:scale={{ duration: 300, delay: 50 }}>
      <div class="icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="3" fill="#2c3e50"/>
          <rect x="4" y="6" width="5" height="5" rx="1" fill="#e74c3c"/>
          <rect x="15" y="6" width="5" height="5" rx="1" fill="#3498db"/>
          <rect x="4" y="13" width="5" height="3" rx="0.5" fill="#27ae60"/>
          <rect x="15" y="13" width="5" height="3" rx="0.5" fill="#f1c40f"/>
          <path d="M10 9.5 L14 9.5 M14 9.5 L12 7.5 M14 9.5 L12 11.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <h2>Color Converter!</h2>
      <p class="description">Change all uncontrolled cells of one color to another</p>

      <div class="color-selection">
        <div class="selection-group">
          <span class="label">From:</span>
          <div class="color-options">
            {#each GAME_COLORS as color}
              <button
                class="color-btn"
                class:selected={fromColor === color}
                class:disabled={toColor === color}
                style="background-color: {colorMap[color]}"
                aria-label="From {color}"
                disabled={toColor === color}
                on:click={() => fromColor = color}
              ></button>
            {/each}
          </div>
        </div>

        <div class="arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </div>

        <div class="selection-group">
          <span class="label">To:</span>
          <div class="color-options">
            {#each GAME_COLORS as color}
              <button
                class="color-btn"
                class:selected={toColor === color}
                class:disabled={fromColor === color}
                style="background-color: {colorMap[color]}"
                aria-label="To {color}"
                disabled={fromColor === color}
                on:click={() => toColor = color}
              ></button>
            {/each}
          </div>
        </div>
      </div>

      <div class="buttons">
        <button class="apply-btn" class:disabled={!canApply} disabled={!canApply} on:click={handleApply}>
          Apply
        </button>
        <button class="skip-btn" on:click={handleSkip}>
          Skip
        </button>
      </div>
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
  }

  .modal {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    width: 360px;
  }

  .icon {
    width: 70px;
    height: 70px;
    margin: 0 auto 1rem;
  }

  .icon svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 0.5rem;
    font-weight: 700;
  }

  .description {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 1.5rem;
    line-height: 1.4;
  }

  .color-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .selection-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #555;
  }

  .color-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
  }

  .color-btn {
    width: 36px;
    height: 36px;
    border: 3px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .color-btn:hover:not(.disabled) {
    transform: scale(1.1);
  }

  .color-btn.selected {
    border-color: #333;
    transform: scale(1.1);
  }

  .color-btn.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .arrow {
    width: 24px;
    height: 24px;
    color: #999;
    margin-top: 1.25rem;
  }

  .arrow svg {
    width: 100%;
    height: 100%;
  }

  .buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .apply-btn {
    background: linear-gradient(135deg, #9b59b6, #8e44ad);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
    box-shadow: 0 4px 15px rgba(155, 89, 182, 0.4);
  }

  .apply-btn:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(155, 89, 182, 0.5);
  }

  .apply-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .skip-btn {
    background: #f8f9fa;
    color: #666;
    border: 2px solid #e0e0e0;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .skip-btn:hover {
    background: #e9ecef;
    border-color: #ccc;
  }

  @media (max-width: 360px) {
    .modal {
      padding: 1.5rem;
    }

    .icon {
      width: 50px;
      height: 50px;
    }

    h2 {
      font-size: 1.25rem;
    }

    .color-btn {
      width: 30px;
      height: 30px;
    }

    .buttons {
      flex-direction: column;
    }

    .apply-btn,
    .skip-btn {
      width: 100%;
    }
  }
</style>
