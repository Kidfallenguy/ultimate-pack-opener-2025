import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import GameContext from '../context/GameContext';
import Card from '../components/Card'; // Asegúrate de tener este componente

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 50,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cardPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  cardPreview: {
    margin: 5,
  },
  alertMessage: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const CodigosScreen = () => {
  const { applyCode, addCard } = useContext(GameContext);
  const [code, setCode] = useState('');
  const [codigosUsados, setCodigosUsados] = useState({});
  const [showRewardAlert, setShowRewardAlert] = useState(false);
  const [rewardCards, setRewardCards] = useState([]);

  const cartas = {
    'negreira': { id: 'negreira', name: 'Negreira', rating: 91, club: 'Icon', nation: 'España', position: 'MCO', imageUri: 'negreira.png', type: 'Icono' },
    'matheus-lahoz': { id: 'matheus-lahoz', name: 'Matheus Lahoz', rating: 91, club: 'Icon', nation: 'España', position: 'MCO', imageUri: 'matheus-lahoz.png', type: 'Icono' },
    'teto-utau-90': { id: 'teto-utau-90', name: 'Teto (Utau)', rating: 90, club: 'Icon', nation: 'Utau', position: 'MI', imageUri: 'teto-utau-90', type: 'Icono' },
    'miku-base-91': { id: 'miku-base-91', name: 'Miku (Base)', rating: 91, club: 'Icon', nation: 'Vocaloid', position: 'MCO', imageUri: 'miku-base-91', type: 'Icono' },
    'neru-base-90': { id: 'neru-base-90', name: 'Neru Base', rating: 90, club: 'Icon', nation: 'Vocaloid', position: 'MCO', imageUri: 'neru-base-90', type: 'Icono' },
  };

  const handleApplyCode = () => {
    if (code) {
      if (codigosUsados[code]) {
        Alert.alert('Código ya usado', 'Este código ya ha sido canjeado.');
        setCode('');
        return;
      }

      let rewardedCards = [];
      let alertTitle = '';
      let alertMessage = '';
      let success = false;

      if (code.toUpperCase() === 'ROBOS') {
        const negreira = cartas['negreira'];
        const matheusLahoz = cartas['matheus-lahoz'];
        if (negreira && matheusLahoz) {
          addCard(negreira);
          addCard(matheusLahoz);
          rewardedCards = [negreira, matheusLahoz];
          alertTitle = '¡FELICIDADES!';
          alertMessage = 'Conseguiste las siguientes cartas:';
          success = true;
        } else {
          alertTitle = 'Error';
          alertMessage = 'Hubo un problema al obtener las cartas de recompensa.';
        }
      } else if (code.toUpperCase() === 'TRIPLEBAKA') {
        const teto = cartas['teto-utau-90'];
        const miku = cartas['miku-base-91'];
        const neru = cartas['neru-base-90'];
        if (teto && miku && neru) {
          addCard(teto);
          addCard(miku);
          addCard(neru);
          rewardedCards = [teto, miku, neru];
          alertTitle = '¡Increíble!';
          alertMessage = 'Obtuviste estas cartas especiales:';
          success = true;
        } else {
          alertTitle = 'Error';
          alertMessage = 'Hubo un problema al obtener las cartas especiales.';
        }
      } else {
        const result = applyCode(code); // Mantén tu lógica de otros códigos si la tienes
        Alert.alert(result.title, result.message);
      }

      if (success) {
        setCodigosUsados(prev => ({ ...prev, [code.toUpperCase()]: true }));
        setRewardCards(rewardedCards);
        setShowRewardAlert(true);
      }

      setCode('');
    } else {
      Alert.alert('Error', 'Por favor, introduce un código.');
    }
  };

  const closeRewardAlert = () => {
    setShowRewardAlert(false);
    setRewardCards([]);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.ytimg.com/vi/CL6MTwkI2jw/maxresdefault.jpg' }}
      style={styles.fondo}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Canjear Código</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduce el código aquí"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleApplyCode}>
          <Text style={styles.buttonText}>Canjear</Text>
        </TouchableOpacity>

        {showRewardAlert && (
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>¡RECOMPENSA!</Text>
            <Text style={styles.alertMessage}>{rewardCards.length > 0 ? 'Conseguiste las siguientes cartas:' : 'No se encontraron recompensas.'}</Text>
            <View style={styles.cardPreviewContainer}>
              {rewardCards.map(card => (
                <View key={card.id} style={styles.cardPreview}>
                  <Card player={card} small={true} /> {/* Usa una versión más pequeña de la carta si es necesario */}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeRewardAlert}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default CodigosScreen;