import { saveBetaProgress, loadBetaProgress } from './betaEventStorage';
import { BETA_REWARD_PATH_GAMES } from '../constants/BETA_REWARD_PATH_GAMES.js';

export const unlockNextLevel = async (currentGameId, currentLevelId) => {
  try {
    const currentProgress = await loadBetaProgress() || {};
    const currentGameIndex = BETA_REWARD_PATH_GAMES.findIndex(game => game.id === currentGameId);

    if (currentGameIndex !== -1) {
      const currentGame = BETA_REWARD_PATH_GAMES[currentGameIndex];

      if (currentGame.levels && currentGame.levels.length > 0) {
        const currentLevelIndex = currentGame.levels.findIndex(level => level.id === currentLevelId);

        if (currentLevelIndex !== -1 && currentLevelIndex < currentGame.levels.length - 1) {
          // Desbloquear el siguiente nivel dentro del mismo juego
          const nextLevelId = currentGame.levels[currentLevelIndex + 1].id;
          currentProgress[currentGameId] = {
            ...currentProgress[currentGameId],
            unlockedLevel: nextLevelId,
            completedLevels: [...(currentProgress[currentGameId]?.completedLevels || []), currentLevelId],
          };
          await saveBetaProgress(currentProgress);
          console.log(`Desbloqueado nivel ${nextLevelId} en ${currentGameId}`);
          return true;
        } else {
          // Se completó el último nivel (o el único nivel) de este juego, intentar desbloquear el siguiente juego
          if (currentGameIndex < BETA_REWARD_PATH_GAMES.length - 1) {
            const nextGame = BETA_REWARD_PATH_GAMES[currentGameIndex + 1];
            if (nextGame.levels && nextGame.levels.length > 0) {
              currentProgress[nextGame.id] = {
                ...currentProgress[nextGame.id],
                unlockedLevel: nextGame.levels[0].id,
              };
              await saveBetaProgress(currentProgress);
              console.log(`Desbloqueado el juego ${nextGame.id}, nivel ${nextGame.levels[0].id}`);
              return true;
            }
          }
          console.log(`Completado el último juego diario.`);
          return true; // Indica que se completó el último juego
        }
      } else {
        // El juego no tiene niveles definidos (esto no debería pasar con tu estructura actual)
        console.log(`El juego ${currentGameId} no tiene niveles definidos.`);
        return false;
      }
    } else {
      console.log(`No se encontró el juego ${currentGameId}`);
      return false;
    }
  } catch (error) {
    console.error('Error al desbloquear el siguiente nivel/juego:', error);
    return false;
  }
};