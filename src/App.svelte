<script>
  import Board from './lib/components/Board.svelte';
  import Controls from './lib/components/Controls.svelte';
</script>

<header class="navbar">
  <div class="navbar-brand">Dots</div>
</header>

<main class="game-wrapper">
  <Controls />
  <Board />
</main>

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
