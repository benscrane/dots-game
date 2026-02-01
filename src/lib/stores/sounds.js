import { writable } from 'svelte/store';

const MUTE_STORAGE_KEY = 'dots-game-muted';

function loadMutePreference() {
  try {
    const stored = localStorage.getItem(MUTE_STORAGE_KEY);
    return stored === 'true';
  } catch (e) {
    return false;
  }
}

function saveMutePreference(muted) {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
  } catch (e) {
    console.warn('Failed to save mute preference:', e);
  }
}

// Audio context (created on first user interaction)
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browsers require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Generate a simple tone
function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  if (get(isMuted)) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not supported or blocked
  }
}

// Play a sequence of tones
function playMelody(notes, baseVolume = 0.3) {
  if (get(isMuted)) return;

  try {
    const ctx = getAudioContext();
    let time = ctx.currentTime;

    notes.forEach(({ frequency, duration, type = 'sine' }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(baseVolume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

      oscillator.start(time);
      oscillator.stop(time + duration);

      time += duration * 0.8; // Slight overlap for smoother melody
    });
  } catch (e) {
    // Audio not supported or blocked
  }
}

// Import get from svelte/store for checking mute state
import { get } from 'svelte/store';

// Mute state store
function createMuteStore() {
  const { subscribe, set, update } = writable(loadMutePreference());

  return {
    subscribe,
    toggle: () => {
      update(muted => {
        const newValue = !muted;
        saveMutePreference(newValue);
        return newValue;
      });
    },
    set: (value) => {
      saveMutePreference(value);
      set(value);
    },
  };
}

export const isMuted = createMuteStore();

// Sound effect functions
export const sounds = {
  // Cell capture - quick ascending blip
  capture: () => {
    playTone(440, 0.1, 'sine', 0.2);
  },

  // Bomb explosion - dramatic boom
  explosion: () => {
    if (get(isMuted)) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);

      // Generate white noise for explosion
      for (let i = 0; i < noiseBuffer.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseSource.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // Low rumble
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(80, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      noiseSource.start(ctx.currentTime);
      noiseSource.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Fallback to simple tone
      playTone(80, 0.3, 'sine', 0.4);
    }
  },

  // Victory fanfare - happy ascending melody
  victory: () => {
    playMelody([
      { frequency: 523, duration: 0.15, type: 'sine' }, // C5
      { frequency: 659, duration: 0.15, type: 'sine' }, // E5
      { frequency: 784, duration: 0.15, type: 'sine' }, // G5
      { frequency: 1047, duration: 0.4, type: 'sine' }, // C6
    ], 0.3);
  },

  // Game over - sad descending tones
  gameOver: () => {
    playMelody([
      { frequency: 392, duration: 0.25, type: 'sine' }, // G4
      { frequency: 349, duration: 0.25, type: 'sine' }, // F4
      { frequency: 294, duration: 0.4, type: 'sine' },  // D4
    ], 0.25);
  },

  // New record celebration - extra happy jingle
  newRecord: () => {
    playMelody([
      { frequency: 523, duration: 0.1, type: 'sine' },  // C5
      { frequency: 659, duration: 0.1, type: 'sine' },  // E5
      { frequency: 784, duration: 0.1, type: 'sine' },  // G5
      { frequency: 1047, duration: 0.15, type: 'sine' }, // C6
      { frequency: 784, duration: 0.1, type: 'sine' },  // G5
      { frequency: 1047, duration: 0.3, type: 'sine' }, // C6
    ], 0.35);
  },
};
