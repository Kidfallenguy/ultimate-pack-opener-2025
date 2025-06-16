import React, { useState, useContext, useCallback } from 'react'; // Agregamos useCallback
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Agregamos useFocusEffect
import { GameContext } from '../context/GameContext';
import { BETA_MINIGAMES } from '../utils/constants'; // <--- VERIFICA ESTA RUTA CAREFULLY!


const DesafioCarreraToquesScreen = ({ route }) => {
  // Definimos gameId aquí para que esté disponible en las dependencias del effect
  const { gameId = 'beta_toques' } = route.params || {}; // Cambié a 'beta_toques' ya que es el desafío de toques
  const [toques, setToques] = useState(0);
  const [mejorMarca, setMejorMarca] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  // Asegúrate de que updateBetaGameProgress realmente viene del contexto
  const { updateBetaGameProgress } = useContext(GameContext);

  const navigation = useNavigation();

  const hacerToque = () => {
    if (toques < 10) {
      const nuevosToques = toques + 1;
      setToques(nuevosToques);
      if (nuevosToques > mejorMarca) {
        setMejorMarca(nuevosToques);
      }
    }
    // Usamos el valor *actualizado* que está a punto de establecerse (nuevosToques)
    if (toques + 1 === 10) {
      setHasWon(true);
      console.log('¡Carrera de Toques completada!');
    }
  };

  const reiniciarToques = () => {
    setToques(0);
    setHasWon(false);
  };

  // --- SOLUCIÓN PARA ACTUALIZAR PROGRESO AL SALIR (cualquier método) ---
  useFocusEffect(
    // Usamos useCallback para optimizar y evitar que el efecto se cree innecesariamente
    useCallback(() => {
      // Esta función se ejecuta cuando la pantalla se enfoca

      // La función de limpieza se ejecuta cuando la pantalla pierde el foco
      // (al navegar hacia atrás, hacia otra pantalla, etc.)
      return () => {
        console.log('Saliendo de la pantalla Carrera de Toques.');
        // Solo actualizamos el progreso si el jugador ganó el desafío
        if (hasWon) {
          console.log('El jugador ganó Carrera de Toques, actualizando progreso para:', gameId);
          // --- VERIFICACIÓN IMPORTANTE: ¿Es updateBetaGameProgress realmente una función? ---
          if (typeof updateBetaGameProgress === 'function') {
            updateBetaGameProgress(gameId);
          } else {
            // Si ves este error en la consola, el problema está en tu GameContext
            // o cómo se provee la función updateBetaGameProgress
            console.error('Error: updateBetaGameProgress NO ES UNA FUNCIÓN en el contexto. No se pudo actualizar el progreso.');
            // Considera qué hacer aquí: ¿mostrar un mensaje al usuario?
          }
        } else {
          console.log('El jugador salió de Carrera de Toques sin completar (vía retroceso o navegación).');
        }
      };
    }, [hasWon, gameId, updateBetaGameProgress]) // Dependencias: el efecto se re-crea si hasWon, gameId o updateBetaGameProgress cambian
  );

  // --- SOLUCIÓN PARA EL BOTÓN "SALIR" ---
  // Este handler ahora solo se encarga de navegar, la actualización del progreso
  // la maneja el useFocusEffect cleanup.
  const handleExitGame = () => {
    console.log('Botón Salir presionado en Carrera de Toques. Navegando a BienvenidaBetaScreen.');
    // La lógica de actualización ya está en useFocusEffect.
    // Este botón solo aparece si hasWon es true, así que no necesitamos chequearlo aquí de nuevo.
    navigation.navigate('BienvenidaBetaScreen');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎯 Desafío: Toques</Text>
      <Text style={styles.texto}>Toques actuales: {toques}</Text>
      <Text style={styles.texto}>Mejor marca: {mejorMarca}</Text>

      {/* El botón de la pelota se deshabilita si toques >= 10 */}
      <TouchableOpacity onPress={hacerToque} disabled={toques >= 10}>
        <Image
          source={require('../assets/ball.png')}
          style={styles.pelota}
        />
      </TouchableOpacity>

      {/* Renderizado condicional del botón */}
      {!hasWon ? (
        <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciarToques}>
          <Text style={styles.textoReiniciar}>🔄 Reiniciar</Text>
        </TouchableOpacity>
      ) : (
        // El botón "Salir" solo se muestra si hasWon es true
        <TouchableOpacity style={styles.botonSalir} onPress={handleExitGame}>
          <Text style={styles.textoSalir}>🚪 Salir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  texto: {
    color: '#ddd',
    fontSize: 18,
    marginBottom: 10,
  },
  pelota: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  botonReiniciar: {
    marginTop: 10,
    backgroundColor: '#ff595e',
    padding: 10,
    borderRadius: 10,
  },
  textoReiniciar: {
    color: '#fff',
    fontSize: 16,
  },
  botonSalir: {
    marginTop: 30,
    backgroundColor: '#38b000',
    padding: 15,
    borderRadius: 10,
  },
  textoSalir: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default DesafioCarreraToquesScreen;