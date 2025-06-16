import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveBetaProgress = async (progress) => {
  try {
    await AsyncStorage.setItem('betaEventProgress', JSON.stringify(progress));
    console.log('Progreso del evento Beta guardado correctamente.');
  } catch (error) {
    console.error('Error al guardar el progreso del evento Beta:', error);
  }
};

export const loadBetaProgress = async () => {
  try {
    const eventProgressString = await AsyncStorage.getItem('betaEventProgress');
    return eventProgressString ? JSON.parse(eventProgressString) : {};
  } catch (error) {
    console.error('Error al cargar el progreso del evento Beta:', error);
    return {};
  }
};