<script>
  import { ANIMATION_WAVE_DELAY } from '../stores/game.js';

  export let color;
  export let controlled;
  export let animationWave = null;

  $: shouldAnimate = animationWave !== null;
  $: animationDelay = animationWave !== null ? animationWave * ANIMATION_WAVE_DELAY : 0;
</script>

<div
  class="cell"
  class:controlled
  class:capturing={shouldAnimate}
  style="--cell-color: {color}; --animation-delay: {animationDelay}ms"
></div>

<style>
  .cell {
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--cell-color);
    transition: background-color 0.15s ease;
  }

  .controlled {
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  .capturing {
    animation: captureRipple 0.4s ease-out forwards;
    animation-delay: var(--animation-delay);
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
