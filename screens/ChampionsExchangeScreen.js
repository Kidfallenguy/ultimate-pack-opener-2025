import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, FlatList } from 'react-native'; // Importar FlatList
import { useNavigation } from '@react-navigation/native';

// Importar el GameContext para acceder al inventario y las fichas
import { GameContext } from '../context/GameContext'; // <-- Asegúrate de que la ruta sea correcta

// URL de la imagen de la Ficha Champions (¡ACTUALIZADA!)
const CHAMPIONS_TOKEN_IMAGE_URL = 'http://imgfz.com/i/npgM2sB.png'; // <-- ¡Nueva URL!


const ChampionsExchangeScreen = () => {
  const navigation = useNavigation();
  // Acceder al inventario de jugadores y las fichas desde el contexto
  // Asegúrate de que 'collection', 'championsTokens', 'removePlayersFromInventory', y 'addChampionsTokens' existan en tu GameContext
  const { collection, championsTokens, removePlayersFromInventory, addChampionsTokens } = useContext(GameContext);

  // Estado para guardar los IDs de INSTANCIA de los jugadores seleccionados para canje
  const [selectedPlayerInstanceIds, setSelectedPlayerInstanceIds] = useState([]);
  // Estado para guardar la cantidad total de fichas a obtener
  const [totalTokensToReceive, setTotalTokensToReceive] = useState(0);

  // Efecto para depurar la colección al cargar
  useEffect(() => {
    console.log("--- ChampionsExchangeScreen ---");
    console.log("collection desde Context:", collection);
    if (collection && Array.isArray(collection)) {
      console.log("Número de jugadores en colección:", collection.length);
      if (collection.length > 0) {
        console.log("Primer jugador en colección:", collection[0]);
        // Debugging del instanceId del primer jugador
        console.log("Primer jugador instanceId:", collection[0]?.instanceId); // Usar optional chaining por seguridad
      }
    } else {
      console.log("collection no es un array o es undefined.");
    }
    console.log("-----------------------------");
  }, [collection]);


  // Configurar opciones del header
  useEffect(() => {
    navigation.setOptions({
      title: 'Canjear Jugadores', // Título específico para esta pantalla
      // Puedes añadir headerLeft o headerRight aquí si quieres botones específicos
      // Por ejemplo, para añadir un botón de volver si no aparece por defecto:
      // headerLeft: () => (
      //     <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
      //         <Text style={{ color: '#fff', fontSize: 16 }}>← Volver</Text>
      //     </TouchableOpacity>
      // ),
    });
  }, [navigation]);

  // Efecto para recalcular las fichas a recibir cada vez que cambian los jugadores seleccionados
  useEffect(() => {
    let calculatedTokens = 0;
    // Asegurarse de que 'collection' existe y es un array
    if (collection && Array.isArray(collection)) {
      // Filtrar el inventario para obtener los objetos de los jugadores seleccionados por su INSTANCE ID
      const selectedPlayers = collection.filter(player => selectedPlayerInstanceIds.includes(player.instanceId));

      selectedPlayers.forEach(player => {
        // Pasar el objeto jugador completo a calculateExchangeValue
        calculatedTokens += calculateExchangeValue(player);
      });
    }

    setTotalTokensToReceive(calculatedTokens);
  }, [selectedPlayerInstanceIds, collection]); // Depende de la selección y la colección


  // Función para calcular las fichas obtenidas por GRL (Rating)
  // Se elimina la bonificación por tipo "Champions"
  // Esta función ahora recibe el objeto jugador completo
  const calculateExchangeValue = (player) => {
    // Debugging dentro de la función de cálculo
    // console.log(`Calculando valor para jugador: ${player?.name || player?.id || 'Desconocido'}, Rating: ${player?.rating}`); // Descomentar para depurar cada cálculo

    // Usando player.rating para el cálculo
    const rating = player?.rating; // Usar optional chaining por seguridad
    let baseValue = 0;

    // Reglas basadas ÚNICAMENTE en Rating (GRL)
    if (rating >= 97) baseValue = 70;
    else if (rating >= 96) baseValue = 40; // 96
    else if (rating === 95) baseValue = 35;
    else if (rating >= 93) baseValue = 30; // 93-94
    else if (rating >= 91) baseValue = 25; // 91-92
    else if (rating >= 89) baseValue = 20; // 89-90
    else if (rating >= 86) baseValue = 15; // 86-88
    else if (rating >= 80) baseValue = 10; // 80-85
    else if (rating >= 75) baseValue = 5; // 75-80
    else baseValue = 0; // Rating por debajo de 75

    // Eliminada la lógica de bonificación por tipo "Champions"
    const finalValue = baseValue; // El valor final es solo el valor base

    // Debugging del valor final
    // console.log(`Valor base: ${baseValue}, Valor final (sin bonificación por tipo): ${finalValue}`); // Descomentar para depurar cada cálculo

    return finalValue;
  };

  // Función para manejar la selección/deselección de un jugador
  // Ahora usa el instanceId para la selección
  const togglePlayerSelection = (playerInstanceId) => {
    setSelectedPlayerInstanceIds(prevSelected => {
      if (prevSelected.includes(playerInstanceId)) {
        // Deseleccionar si ya está seleccionado
        return prevSelected.filter(id => id !== playerInstanceId);
      } else {
        // Seleccionar si no está seleccionado
        return [...prevSelected, playerInstanceId];
      }
    });
  };

  // Función para realizar el canje
  const handleExchange = () => {
    // Log al inicio de handleExchange
    console.log("handleExchange: Función iniciada.");

    if (selectedPlayerInstanceIds.length === 0) {
      Alert.alert('Selecciona Jugadores', 'Debes seleccionar al menos un jugador para canjear.');
      console.log("handleExchange: No hay jugadores seleccionados.");
      return;
    }

    // *** MODIFICADO: Saltamos la alerta de confirmación y ejecutamos la lógica directamente ***
    console.log("handleExchange: Saltando alerta de confirmación, ejecutando canje directo.");

    // Lógica para remover jugadores y añadir fichas usando el contexto
    console.log("handleExchange (ejecución directa): Llamando a removePlayersFromInventory con Instance IDs:", selectedPlayerInstanceIds);
    console.log("handleExchange (ejecución directa): Llamando a addChampionsTokens con cantidad:", totalTokensToReceive);

    // Verificación de que las funciones existen antes de llamarlas
    if (typeof removePlayersFromInventory === 'function' && typeof addChampionsTokens === 'function') {
      removePlayersFromInventory(selectedPlayerInstanceIds); // Remover jugadores por sus instanceIds
      addChampionsTokens(totalTokensToReceive); // Añadir fichas

      // Limpiar selección y resetear total después del canje
      setSelectedPlayerInstanceIds([]);
      setTotalTokensToReceive(0);

      // Mostrar una alerta simple de éxito (no la de confirmación)
      Alert.alert('¡Canje Exitoso!', `Has recibido ${totalTokensToReceive} Fichas Champions.`);
      console.log("handleExchange: Canje directo ejecutado, mostrando alerta simple.");

    } else {
      console.error("GameContext functions for exchange are not functions.");
      Alert.alert("Error", "No se pudo completar el canje. Funciones del juego no disponibles o incorrectas.");
    }

    // Log al final de handleExchange
    console.log("handleExchange: Función terminada.");
  };

  // Renderizar cada item de jugador en la lista
  const renderPlayerItem = ({ item }) => {
    // Debugging de cada item de jugador
    // console.log("Rendering player item:", item); // Descomentar para depurar cada item
    // console.log("Player Rating for calculation:", item.rating); // Descomentar para depurar rating
    // Debugging del instanceId del item
    // console.log("Player Instance ID:", item.instanceId); // Descomentar para depurar instanceId

    // Usar el instanceId para verificar si está seleccionado
    const isSelected = selectedPlayerInstanceIds.includes(item.instanceId);
    const tokensForThisPlayer = calculateExchangeValue(item); // Calcular fichas individuales

    return (
      // Usar el instanceId en la key y en el onPress
      <TouchableOpacity
        key={item.instanceId} // Usar instanceId como key
        style={[styles.playerItem, isSelected && styles.selectedPlayerItem]} // Cambiar estilo si está seleccionado
        onPress={() => togglePlayerSelection(item.instanceId)} // Pasar el instanceId
      >
        {/* IMAGEN DEL JUGADOR */}
        {/* Asegúrate de que tu objeto jugador tenga una propiedad 'image' con la ruta */}
        {item.image && (
          <Image
            source={item.image} // Usa la imagen local o remota del jugador
            style={styles.playerImage} // Aplica el estilo
            resizeMode="contain"
          />
        )}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          {/* Mostrar Rating (GRL) y tipo (si existe) */}
          <Text style={styles.playerDetails}>Rating {item.rating} {item.type ? `| ${item.type}` : ''}</Text>
        </View>
        <View style={styles.tokensValueContainer}>
          <Image source={{ uri: CHAMPIONS_TOKEN_IMAGE_URL }} style={styles.tokensValueImage} />
          <Text style={styles.tokensValueText}>{tokensForThisPlayer}</Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      {/* Mostrar la cantidad de Fichas Champions que tiene el usuario */}
      <View style={styles.tokenContainer}>
        <Image source={{ uri: CHAMPIONS_TOKEN_IMAGE_URL }} style={styles.tokenImage} />
        <Text style={styles.tokenText}>Mis Fichas Champions: {championsTokens !== undefined ? championsTokens : 'Cargando...'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Selecciona Jugadores para Canjear:</Text>

      {/* Lista de jugadores en el inventario */}
      {/* Renderizar FlatList solo si 'collection' existe y es un array con elementos */}
      {collection && Array.isArray(collection) && collection.length > 0 ? (
        <FlatList
          data={collection} // Usa la colección de jugadores del contexto
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item.instanceId} // Usar instanceId como keyExtractor
          contentContainerStyle={styles.playerList}
        />
      ) : (
        <Text style={styles.emptyInventoryText}>No tienes jugadores en tu inventario.</Text>
      )}


      {/* Área de resumen y botón de canje */}
      <View style={styles.summaryContainer}>
        {/* Usar el conteo de instanceIds seleccionados */}
        <Text style={styles.summaryText}>Jugadores seleccionados: {selectedPlayerInstanceIds.length}</Text>
        <View style={styles.summaryTokensContainer}>
          <Text style={styles.summaryText}>Recibirás:</Text>
          <Image source={{ uri: CHAMPIONS_TOKEN_IMAGE_URL }} style={styles.summaryTokenImage} />
          <Text style={styles.summaryText}>{totalTokensToReceive}</Text>
          <Text style={styles.summaryText}>Fichas</Text>
        </View>


        <TouchableOpacity
          // Deshabilitar si no hay instanceIds seleccionados
          style={[styles.exchangeButton, selectedPlayerInstanceIds.length === 0 && styles.exchangeButtonDisabled]}
          onPress={handleExchange} // Llama a la función que ahora ejecuta el canje directo
          // Deshabilitar si no hay instanceIds seleccionados
          disabled={selectedPlayerInstanceIds.length === 0}
        >
          <Text style={styles.exchangeButtonText}>Canjear Jugadores</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e', // Fondo azul oscuro de Champions
    padding: 15,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeb3b',
    alignSelf: 'center', // Centrar el contenedor de fichas
  },
  tokenImage: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  tokenText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  playerList: {
    // Estilos para el contenido de la lista si es necesario
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4, // Espacio vertical entre items
    width: '100%', // Ocupa todo el ancho de la lista
    borderWidth: 1,
    borderColor: 'transparent', // Borde transparente por defecto
  },
  selectedPlayerItem: {
    borderColor: '#ffeb3b', // Borde amarillo/dorado cuando está seleccionado
    borderWidth: 2,
  },
  playerImage: {
    width: 40, // Tamaño de la imagen del jugador en la lista
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  playerInfo: {
    flex: 1, // Permite que la info ocupe el espacio restante
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerDetails: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  tokensValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  tokensValueImage: {
    width: 18,
    height: 18,
    marginRight: 3,
    resizeMode: 'contain',
  },
  tokensValueText: {
    fontSize: 16,
    color: '#ffeb3b', // Amarillo/Dorado para el valor de las fichas
    fontWeight: 'bold',
  },
  emptyInventoryText: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 20,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  summaryText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  summaryTokensContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTokenImage: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
  summaryText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  exchangeButton: {
    backgroundColor: '#ff9800', // Naranja
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  exchangeButtonDisabled: {
    backgroundColor: '#757575', // Gris cuando está deshabilitado
  },
  exchangeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChampionsExchangeScreen;

