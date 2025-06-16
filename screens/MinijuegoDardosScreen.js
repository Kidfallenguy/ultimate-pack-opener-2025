import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addCoins } from '../utils/monedas'; // Asegúrate de que esta función esté en tu proyecto
import { updateBetaEventProgress } from '../utils/functions'; // Asegúrate de que esta función esté en tu proyecto

const MinijuegoDardosScreen = () => {
  const [hits, setHits] = useState(0); // Cuántos dardos acertados
  const [isGameFinished, setIsGameFinished] = useState(false); // Para bloquear el juego cuando llegue a 4
  const [targetPosition, setTargetPosition] = useState(0); // Posición aleatoria de la diana
  const [targetVisible, setTargetVisible] = useState(true); // Controla la visibilidad de la diana
  const navigation = useNavigation();

  // Función para generar una nueva posición aleatoria para la diana
  const generateRandomTargetPosition = () => {
    return Math.floor(Math.random() * 3); // 0, 1, o 2 (3 posiciones posibles)
  };

  useEffect(() => {
    if (!isGameFinished) {
      // Cambiar la posición de la diana cada 1.5 segundos
      const intervalId = setInterval(() => {
        setTargetPosition(generateRandomTargetPosition());
        setTargetVisible(true);
      }, 1500); // 1.5 segundos para cambiar la posición

      return () => clearInterval(intervalId); // Limpiar intervalo cuando el juego termine
    }
  }, [isGameFinished]);

  const handleHit = () => {
    if (isGameFinished) {
      console.log('El juego ya está terminado.');
      return;
    }

    setHits((prevHits) => {
      const newHits = prevHits + 1;

      if (newHits >= 4) {
        setIsGameFinished(true);
        addCoins(5); // Otorgamos 5 monedas
        updateBetaEventProgress(); // Actualizamos el progreso del evento Beta
        Alert.alert('¡Desafío completado!', 'Ganaste 5 monedas. ¡Nivel desbloqueado!', [
          {
            text: 'Ir al siguiente nivel',
            onPress: () => navigation.navigate('ProximoNivelScreen'),
          },
          {
            text: 'Volver',
            onPress: () => navigation.navigate('EventosScreen'),
          },
        ]);
      }

      return newHits;
    });
  };

  const closeGame = () => {
    navigation.navigate('EventosScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minijuego de Dardos</Text>
      <Text style={styles.subtitle}>Dardos acertados: {hits}/4</Text>

      {isGameFinished ? (
        <TouchableOpacity style={styles.button} onPress={closeGame}>
          <Text style={styles.buttonText}>Cerrar y Volver</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <Text style={styles.targetText}>¡Tira el dardo al objetivo!</Text>
          <View style={styles.targetContainer}>
            <TouchableOpacity
              style={[styles.target, targetPosition === 0 && targetVisible ? styles.targetActive : null]}
              onPress={handleHit}
              disabled={!targetVisible}
            >
              <Text style={styles.targetButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.target, targetPosition === 1 && targetVisible ? styles.targetActive : null]}
              onPress={handleHit}
              disabled={!targetVisible}
            >
              <Text style={styles.targetButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.target, targetPosition === 2 && targetVisible ? styles.targetActive : null]}
              onPress={handleHit}
              disabled={!targetVisible}
            >
              <Text style={styles.targetButtonText}>3</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, color: 'white', marginBottom: 20 },
  subtitle: { fontSize: 18, color: 'white', marginBottom: 10 },
  targetText: { fontSize: 18, color: 'white', marginBottom: 20 },
  targetContainer: { flexDirection: 'row', marginBottom: 20 },
  target: {
    backgroundColor: '#1abc9c',
    width: 80,
    height: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  targetActive: {
    backgroundColor: '#e74c3c', // Color cuando el objetivo está activo
  },
  targetButtonText: { color: 'white', fontSize: 22 },
  button: { marginTop: 20, backgroundColor: '#555', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 22 },
});

export default MinijuegoDardosScreen;