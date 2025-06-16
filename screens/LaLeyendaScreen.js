import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addCoins } from '../utils/monedas';


const LaLeyendaScreen = () => {
  const [correct, setCorrect] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkCooldown = async () => {
      const active = await isCooldownActive('leyenda');
      setCooldownActive(active);
    };
    checkCooldown();
  }, []);

  const handleAnswer = async (isCorrect) => {
    if (isCorrect) {
      addCoins(10);
      updateBetaEventProgress();
      await setCooldown('leyenda');
      Alert.alert('¡Correcto!', 'Ganaste 10 monedas.', [
        { text: 'Volver', onPress: () => navigation.navigate('EventosScreen') },
      ]);
    } else {
      Alert.alert('Incorrecto', 'Inténtalo de nuevo');
    }
  };

  if (cooldownActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>La Leyenda</Text>
        <Text style={styles.cooldownText}>Ya jugaste. Vuelve en 24 horas.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventosScreen')}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Quién es la leyenda?</Text>
      <Text style={styles.question}>Jugó en el Barcelona, fue balón de oro y es ícono de Brasil.</Text>

      <TouchableOpacity style={styles.option} onPress={() => handleAnswer(true)}>
        <Text style={styles.optionText}>Ronaldinho</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => handleAnswer(false)}>
        <Text style={styles.optionText}>Cafu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => handleAnswer(false)}>
        <Text style={styles.optionText}>Neymar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, color: 'white', marginBottom: 20, textAlign: 'center' },
  question: { fontSize: 18, color: 'white', marginBottom: 20, textAlign: 'center' },
  cooldownText: { fontSize: 18, color: 'red', textAlign: 'center', margin: 20 },
  option: { backgroundColor: '#e67e22', padding: 15, marginVertical: 10, borderRadius: 10, width: '100%' },
  optionText: { color: 'white', fontSize: 20, textAlign: 'center' },
  button: { marginTop: 20, backgroundColor: '#555', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 22 },
});

export default LaLeyendaScreen;