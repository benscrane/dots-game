<script>
  import Board from './lib/components/Board.svelte';
  import Controls from './lib/components/Controls.svelte';
</script>

<header class="navbar">
  <div class="navbar-brand">Dots</div>
  <div class="navbar-actions">
    <button class="btn btn-primary">Sign Up</button>
    <button class="btn btn-outline">Login</button>
  </div>
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

  .navbar-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-primary {
    background: #2185d0;
    color: white;
    border: none;
  }

  .btn-primary:hover {
    background: #1678c2;
  }

  .btn-outline {
    background: transparent;
    color: #2185d0;
    border: 1px solid #2185d0;
  }

  .btn-outline:hover {
    background: #2185d0;
    color: white;
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
