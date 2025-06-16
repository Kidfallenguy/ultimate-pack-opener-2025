// utils/updateBetaEventProgress.js
import { saveBetaProgress } from './betaEventStorage';
import { BETA_REWARD_PATH_GAMES } from '../constants/BETA_REWARD_PATH_GAMES';

export const updateBetaEventProgress = (gameId, currentBetaEventProgress, setBetaEventProgress) => {
  console.log('Actualizando progreso del minijuego:', gameId);

  const updatedProgress = {
    ...currentBetaEventProgress,
    [gameId]: {
      ...currentBetaEventProgress[gameId],
      count: (currentBetaEventProgress[gameId]?.count || 0) + 1,
      lastCompleted: new Date().toISOString(),
      unlocked: true,
    }
  };

  const currentIndex = BETA_REWARD_PATH_GAMES.findIndex(g => g.id === gameId);
  if (currentIndex !== -1 && currentIndex < BETA_REWARD_PATH_GAMES.length - 1) {
    const nextGame = BETA_REWARD_PATH_GAMES[currentIndex + 1];
    updatedProgress[nextGame.id] = {
      ...(updatedProgress[nextGame.id] || {}),
      unlocked: true,
    };
    console.log('Desbloqueado siguiente juego:', nextGame.id);
  }

  const allCompleted = BETA_REWARD_PATH_GAMES.every(
    g => updatedProgress[g.id]?.count > 0
  );

  if (allCompleted) {
    updatedProgress.finalRewardUnlocked = true;
    console.log('¡Recompensa final desbloqueada!');
  }

  saveBetaProgress(updatedProgress);
  setBetaEventProgress(updatedProgress); // Actualiza el estado del contexto
};
