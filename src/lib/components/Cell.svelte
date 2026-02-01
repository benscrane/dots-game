<script>
  import { ANIMATION_WAVE_DELAY } from '../stores/game.js';

  export let color;
  export let controlled;
  export let animationWave = null;
  export let hasBomb = false;
  export let hasColorConverter = false;

  const colorMap = {
    red: '#e74c3c',
    green: '#27ae60',
    blue: '#3498db',
    yellow: '#f1c40f',
  };

  $: shouldAnimate = animationWave !== null;
  $: animationDelay = animationWave !== null ? animationWave * ANIMATION_WAVE_DELAY : 0;
  $: cellColor = colorMap[color] || color;
</script>

<div
  class="cell"
  class:controlled
  class:capturing={shouldAnimate}
  class:has-bomb={hasBomb}
  class:has-converter={hasColorConverter}
  style="--cell-color: {cellColor}; --animation-delay: {animationDelay}ms"
>
  {#if hasBomb}
    <svg class="bomb-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="14" r="8" fill="#2c3e50"/>
      <rect x="10" y="2" width="4" height="6" rx="1" fill="#2c3e50"/>
      <path d="M14 4 L18 2 L17 5 L14 5" fill="#e74c3c"/>
      <ellipse cx="9" cy="12" rx="2" ry="2.5" fill="#5d6d7e" opacity="0.5"/>
    </svg>
  {:else if hasColorConverter}
    <svg class="converter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="#2c3e50"/>
      <rect x="6" y="8" width="4" height="4" rx="1" fill="#e74c3c"/>
      <rect x="14" y="8" width="4" height="4" rx="1" fill="#3498db"/>
      <rect x="6" y="14" width="4" height="2" rx="0.5" fill="#27ae60"/>
      <rect x="14" y="14" width="4" height="2" rx="0.5" fill="#f1c40f"/>
      <path d="M10.5 11 L13.5 11 M13.5 11 L12 9.5 M13.5 11 L12 12.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
    </svg>
  {/if}
</div>

<style>
  .cell {
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--cell-color);
    transition: background-color 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .controlled {
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  .capturing {
    animation: captureRipple 0.4s ease-out forwards;
    animation-delay: var(--animation-delay);
  }

  .bomb-icon,
  .converter-icon {
    width: 60%;
    height: 60%;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  @keyframes captureRipple {
    0% {
      transform: scale(0.6);
      box-shadow:
        inset 0 0 0 2px rgba(255, 255, 255, 0.3),
        0 0 0 4px rgba(255, 255, 255, 0.8);
    }
    50% {
      transform: scale(1.15);
      box-shadow:
        inset 0 0 0 2px rgba(255, 255, 255, 0.5),
        0 0 0 6px rgba(255, 255, 255, 0.4);
    }
    100% {
      transform: scale(1);
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.3);
    }
  }
</style>
