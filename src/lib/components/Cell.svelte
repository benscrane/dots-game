<script>
  export let color;
  export let controlled;
</script>

<div
  class="cell"
  class:controlled
  style="--cell-color: {color}"
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
</style>
