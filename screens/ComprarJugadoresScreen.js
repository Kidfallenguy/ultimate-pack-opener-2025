import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ImageBackground, Modal, Image } from 'react-native';
import GameContext from '../context/GameContext';
import Card from '../components/Card';
import { playersData } from '../data/players';
import { playerImages, genericImages } from '../assets/playerImages'; // Importa playerImages y genericImages
import ConfettiCannon from 'react-native-confetti-cannon'; // Importa ConfettiCannon

const ComprarJugadoresScreen = () => {
  const { coins, subtractCoins, addCard } = useContext(GameContext);
  const [searchText, setSearchText] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPositionFilter, setShowPositionFilter] = useState(false);

  // Estados para la modal de compra
  const [modalVisible, setModalVisible] = useState(false);
  const [boughtPlayer, setBoughtPlayer] = useState(null);
  const [boughtPrice, setBoughtPrice] = useState(0);

  // Ref para el cañón de confeti
  const confettiRef = useRef(null);

  // Esta función calcula el precio de la carta con los nuevos rangos
  const calculatePrice = useCallback((grl) => {
    if (grl >= 96) { // GRL 96-97 y superior
      return Math.min(1500, Math.floor(grl * 15 + (grl - 95) * 50)); // Escalado para 96+
    } else if (grl === 95) { // GRL 95
      return Math.min(1000, Math.floor(grl * 12)); // Ajuste para 95
    } else if (grl >= 93 && grl <= 94) { // GRL 93-94
      return Math.min(850, Math.floor(grl * 10)); // Ajuste para 93-94
    } else if (grl >= 91 && grl <= 92) { // GRL 91-92
      return Math.min(550, Math.floor(grl * 8)); // Ajuste para 91-92
    } else if (grl === 90) { // GRL 90
      return Math.min(400, Math.floor(grl * 7)); // Ajuste para 90
    } else if (grl >= 88 && grl <= 89) { // GRL 88-89
      return Math.min(350, Math.floor(grl * 6)); // Ajuste para 88-89
    } else if (grl >= 85 && grl <= 87) { // GRL 85-87
      return Math.min(250, Math.floor(grl * 4)); // Ajuste para 85-87
    } else if (grl >= 80 && grl <= 84) { // GRL 80-84
      return Math.min(100, Math.floor(grl * 2)); // Ajuste para 80-84
    } else if (grl >= 75 && grl <= 79) { // GRL 75-79
      return Math.min(50, Math.floor(grl * 1)); // Ajuste para 75-79
    } else { // GRL 0-74
      return Math.min(20, Math.floor(grl * 0.5 + 5)); // Ajuste para GRL bajos, con un mínimo
    }
  }, []);

  useEffect(() => {
    // Primero, filtra cualquier elemento que no sea un objeto o que no tenga las propiedades mínimas
    const validPlayers = playersData.filter(player =>
        player && typeof player === 'object' &&
        typeof player.rating === 'number' && // Asegura que 'rating' existe y es un número
        player.id // Asegura que 'id' existe
    );

    const processedPlayers = validPlayers.map(player => ({
      ...player,
      precio: calculatePrice(player.rating),
    }));
    let filtered = processedPlayers;

    if (searchText) {
      filtered = filtered.filter(player =>
        player.name && typeof player.name === 'string' &&
        player.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterPosition) {
      filtered = filtered.filter(player => player.position === filterPosition);
    }

    // Ordena solo si 'rating' está presente para evitar errores
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Usa 0 si 'rating' falta por alguna razón

    setFilteredPlayers(filtered);
  }, [searchText, filterPosition, calculatePrice, playersData]); // Agrega playersData a las dependencias si playersData puede cambiar

  const handleComprarJugador = (jugador) => {
    const precio = jugador.precio;
    const monedasFaltantes = precio - coins;

    if (coins >= precio) {
      subtractCoins(precio);
      addCard({ ...jugador });

      // Configura la modal y muestra el confeti
      setBoughtPlayer(jugador);
      setBoughtPrice(precio);
      setModalVisible(true);
      if (confettiRef.current) {
        confettiRef.current.start(); // Dispara el confeti
      }

    } else {
      Alert.alert(
        'Fondos Insuficientes',
        `¡Oh no! Te faltan ${monedasFaltantes} monedas para comprar a ${jugador.name}. ¡Sigue jugando para conseguir más!`,
        [{ text: 'Entendido' }]
      );
    }
  };

  // Función para obtener la fuente de la imagen del jugador (necesaria para la modal)
  const getPlayerImageSource = (player) => {
    if (player?.imageUri && playerImages && playerImages[player.imageUri]) {
      return playerImages[player.imageUri];
    } else if (genericImages?.placeholder_player) {
      return genericImages.placeholder_player;
    }
    return null;
  };

  const renderJugadorEnVenta = ({ item }) => (
    <TouchableOpacity onPress={() => handleComprarJugador(item)} style={styles.jugadorContainer}>
      <Card player={item} showPrice={true} />
      <View style={styles.botonComprarContainer}>
        <TouchableOpacity style={styles.comprarBoton} onPress={() => handleComprarJugador(item)}>
          <Text style={styles.comprarTexto}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const togglePositionFilter = () => {
    setShowPositionFilter(!showPositionFilter);
  };

  const selectPosition = (position) => {
    setFilterPosition(position);
    setShowPositionFilter(false);
  };

  const allPositions = ['', 'GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'];

  return (
    <ImageBackground
      source={{ uri: 'http://googleusercontent.com/image_collection/image_retrieval/10894386456498430629' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Comprar Jugadores</Text>

        <View style={styles.filterContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.positionFilterContainer}>
            <TouchableOpacity style={styles.positionFilterButton} onPress={togglePositionFilter}>
              <Text style={styles.positionFilterButtonText}>
                {filterPosition ? `Posición: ${filterPosition}` : 'Filtrar por posición'}
              </Text>
            </TouchableOpacity>
            {showPositionFilter && (
              <View style={styles.positionDropdown}>
                {allPositions.map(position => (
                  <TouchableOpacity
                    key={position}
                    style={styles.positionItem}
                    onPress={() => selectPosition(position)}
                  >
                    <Text style={styles.positionItemText}>
                      {position === '' ? 'Todas' : position}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={filteredPlayers}
          renderItem={renderJugadorEnVenta}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {boughtPlayer && (
              <>
                <Text style={styles.modalTitle}>¡Felicidades!</Text>
                <Text style={styles.modalText}>
                  ¡Compraste a **{boughtPlayer.name}** por {boughtPrice} monedas!
                </Text>
                <Image
                  source={getPlayerImageSource(boughtPlayer)}
                  style={styles.modalPlayerImage}
                  resizeMode="contain"
                />
              </>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Genial</Text>
            </TouchableOpacity>
          </View>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: -10 }}
            autoStart={false}
            ref={confettiRef}
            explosionSpeed={500}
            fallSpeed={3000}
            fadeOut={true}
          />
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  filterContainer: {
    marginBottom: 15,
  },
  searchInput: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#333',
  },
  positionFilterContainer: {
    position: 'relative',
  },
  positionFilterButton: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  positionFilterButtonText: {
    fontSize: 16,
    color: '#333',
  },
  positionDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 200,
    overflow: 'hidden',
  },
  positionItem: {
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  positionItemText: {
    fontSize: 16,
    color: '#333',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  jugadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  botonComprarContainer: {
    // Estilos del contenedor del botón de comprar
  },
  comprarBoton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  comprarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos para la Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
  modalPlayerImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ComprarJugadoresScreen;