import { writable, derived } from 'svelte/store';
import { game, isGameWon, DIFFICULTIES } from './game.js';

const STORAGE_KEY = 'dots-game-highscores';

function loadHighScores() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load high scores:', e);
  }
  return {};
}

function saveHighScores(scores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.warn('Failed to save high scores:', e);
  }
}

function createHighScoreStore() {
  const { subscribe, set, update } = writable(loadHighScores());

  return {
    subscribe,

    // Check and update high score for a difficulty, returns true if new record
    checkAndUpdate: (difficulty, moves) => {
      let isNewRecord = false;

      update(scores => {
        const currentBest = scores[difficulty];
        if (currentBest === undefined || moves < currentBest) {
          isNewRecord = true;
          const newScores = { ...scores, [difficulty]: moves };
          saveHighScores(newScores);
          return newScores;
        }
        return scores;
      });

      return isNewRecord;
    },

    // Get high score for a specific difficulty
    getScore: (difficulty) => {
      const scores = loadHighScores();
      return scores[difficulty] || null;
    },

    // Reset all high scores
    reset: () => {
      saveHighScores({});
      set({});
    },
  };
}

export const highScores = createHighScoreStore();

// Derived store that provides the current difficulty's high score
export const currentHighScore = derived(
  [highScores, game],
  ([$highScores, $game]) => $highScores[$game.difficulty] || null
);
