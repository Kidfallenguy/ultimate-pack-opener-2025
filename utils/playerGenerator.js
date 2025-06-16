// utils/playerGenerator.js

import { playersData } from '../data/players';

export const generateRandomPlayer = () => {
  const randomIndex = Math.floor(Math.random() * playersData.length);
  const randomPlayer = playersData[randomIndex];

  // Retornamos una copia para evitar mutaciones
  return { ...randomPlayer };
};
