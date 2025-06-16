import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importa el GameContext
import { GameContext } from '../context/GameContext';

// ***************************************************************************
// ** NOTA IMPORTANTE: Este código ASUME que tu GameContext proporciona: **
// ** - addCoins (función para añadir monedas)                           **
// ** - updateBetaGameProgress (función para actualizar progreso Beta)    **
// ** - isCooldownActive (función asíncrona para chequear si un juego está en cooldown) **
// ** - setCooldown (función asíncrona para establecer cooldown a un juego) **
// ***************************************************************************

// Define el número de regates necesarios para completar el desafío
const REGATES_REQUERIDOS = 100;
const RECOMPENSA_MONEDAS = 6; // Monedas que se otorgan al completar

const DesafioRegateScreen = ({ route }) => {
    const navigation = useNavigation();

    // --- Obtener funciones y estado necesarios del GameContext ---
    const {
        addCoins,
        updateBetaGameProgress, // Obtiene la función para actualizar el progreso Beta
        isCooldownActive,
        setCooldown,
        // Puedes obtener otros estados o funciones del contexto si los necesitas aquí
    } = useContext(GameContext);

    // Obtén el gameId pasado como parámetro de navegación (debería ser 'beta_regate')
    const { gameId } = route.params || {};

    // --- Verificación Crucial: Asegúrate de que el gameId llegó correctamente ---
    if (!gameId) {
        console.error('Error Crítico: DesafioRegateScreen no recibió el gameId. No se puede iniciar.');
        Alert.alert("Error", "No se pudo cargar el desafío. Falta información.");
        return (
             <View style={styles.container}>
                 <Text style={styles.title}>Error</Text>
                 <Text style={styles.text}>No se pudo iniciar el desafío sin ID.</Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BienvenidaBetaScreen')}>
                    <Text style={styles.buttonText}>Volver</Text>
                 </TouchableOpacity>
             </View>
         );
    }
    // --- Fin Verificación gameId ---


    const [regates, setRegates] = useState(0);
    // Inicializa en true y luego verifica el estado real en useEffect
    const [cooldownActive, setCooldownActive] = useState(true);


    // --- useEffect para chequear Cooldown al cargar la pantalla ---
    useEffect(() => {
         console.log(`DesafioRegateScreen (${gameId}) montado. Chequeando cooldown.`);
        if (typeof isCooldownActive === 'function') {
             const checkCooldownStatus = async () => {
                 try {
                     const active = await isCooldownActive(gameId);
                     setCooldownActive(active);
                     console.log(`Cooldown para ${gameId}: ${active ? 'Activo' : 'Inactivo'}.`);
                 } catch (e) {
                     console.error(`Error al chequear cooldown para ${gameId}:`, e);
                      Alert.alert("Error de Carga", "No se pudo verificar el estado del desafío.");
                 }
             };
             checkCooldownStatus();
        } else {
            console.error('Error de Configuración: isCooldownActive no es una función en el contexto.');
             Alert.alert("Error", "El juego no está configurado correctamente (función de cooldown falta).");
             setCooldownActive(true); // Deshabilita el desafío si no se puede chequear cooldown
        }

        return () => {
             console.log(`DesafioRegateScreen (${gameId}) se va a desmontar.`);
        };

    }, [gameId, isCooldownActive]); // Dependencias


    // --- useFocusEffect para manejar la salida de la pantalla (opcional) ---
    // Este hook es útil si quieres hacer algo CADA VEZ que la pantalla pierde foco (ej. guardar progreso)
    // En este desafío simple de Regate, la lógica principal ocurre al completar, no al salir sin completar.
    // Lo dejamos aquí como estructura, puedes añadir lógica si decides que salir sin completar pierda progreso, etc.
    useFocusEffect(
        useCallback(() => {
            // console.log(`DesafioRegateScreen (${gameId}) GANÓ foco.`);
            return () => {
                // console.log(`DesafioRegateScreen (${gameId}) PERDIÓ foco.`);
                // Lógica al salir/perder foco (if applies)
                // If you want to update the Beta Event progress *on exit*, you'd do it here
                // if (regates >= REGATES_REQUERIDOS) { // Check if completed before exiting
                //     if (typeof updateBetaGameProgress === 'function') {
                //          console.log(`Actualizando progreso Beta para ${gameId} al salir.`);
                //          updateBetaGameProgress(gameId);
                //     }
                // }
            };
        }, [gameId, regates, updateBetaGameProgress]) // Dependencias relevantes
    );


    // --- Handler para el toque de Regate ---
    const handleRegate = async () => {
        // Si está en cooldown o ya se completaron los regates requeridos, no hacer nada
        if (cooldownActive || regates >= REGATES_REQUERIDOS) {
            if (cooldownActive) {
                 Alert.alert('En Cooldown', 'Ya jugaste este desafío. Vuelve en 24 horas.');
            } else {
                 // Esto no debería pasar si el botón se deshabilita correctamente al llegar a 100
                 console.warn("handleRegate llamado después de completar los regates.");
            }
            return;
        }

        const nextRegates = regates + 1;
        setRegates(nextRegates); // Actualiza el estado local de regates

        console.log(`Regate: ${nextRegates}`); // Log para verificar el contador

        // Lógica al completar los regates requeridos (exactamente 100 o más)
        if (nextRegates >= REGATES_REQUERIDOS) {
            console.log(`¡Desafío Regate (${gameId}) completado con ${nextRegates} regates!`);

            // --- Otorgar Recompensas y Establecer Cooldown ---

            // 1. Añade monedas usando la función del contexto
            if (typeof addCoins === 'function') {
                addCoins(RECOMPENSA_MONEDAS);
                console.log(`${RECOMPENSA_MONEDAS} monedas añadidas.`);
            } else {
                console.error('Error de Configuración: addCoins no es una función en el contexto.');
            }

            // 2. Establece el cooldown para este juego usando la función del contexto
            if (typeof setCooldown === 'function') {
                 try {
                    await setCooldown(gameId);
                    setCooldownActive(true); // Actualiza el estado local para que la pantalla cambie inmediatamente
                    console.log(`Cooldown establecido para ${gameId}.`);
                 } catch (e) {
                     console.error(`Error al establecer cooldown para ${gameId}:`, e);
                     Alert.alert("Error", "No se pudo guardar el estado de completado.");
                 }
            } else {
                 console.error('Error de Configuración: setCooldown no es una función en el contexto.');
            }

            // 3. Actualiza el progreso del Evento Beta para marcar este juego como completado
            // ESTA LLAMADA ES NECESARIA para que BienvenidaBetaScreen sepa que este juego se completó
            // y pueda desbloquear el siguiente en el camino de recompensas.
            if (typeof updateBetaGameProgress === 'function') {
                 console.log(`Actualizando progreso Beta para ${gameId} (Completación de desafío).`);
                 updateBetaGameProgress(gameId); // Llama con el gameId correcto ('beta_regate')
             } else {
                 console.error('Error de Configuración: updateBetaGameProgress no es una función en el contexto.');
             }


            // 4. Muestra la alerta final y navega de regreso
            Alert.alert('¡Desafío completado!', `Ganaste ${RECOMPENSA_MONEDAS} monedas.`, [
                { text: 'Volver', onPress: () => navigation.navigate('BienvenidaBetaScreen') },
            ]);

        }
    };

    // --- Renderizado condicional basado en cooldown ---

    // Si está en cooldown, muestra la pantalla de cooldown
    if (cooldownActive) {
        console.log(`DesafioRegateScreen (${gameId}): Renderizando pantalla de cooldown.`);
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Desafío de Regate</Text>
                <Text style={styles.cooldown}>Ya jugaste este desafío. Vuelve en 24 horas.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BienvenidaBetaScreen')}>
                    <Text style={styles.buttonText}>Volver</Text>
                 </TouchableOpacity>
            </View>
        );
    }

    // Si NO está en cooldown, muestra la pantalla del desafío
     console.log(`DesafioRegateScreen (${gameId}): Renderizando pantalla de desafío.`);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Desafío de Regate</Text>
            {/* Muestra el progreso actual hacia los regates requeridos */}
            <Text style={styles.text}>Regates completados: {regates} / {REGATES_REQUERIDOS}</Text>
            {/* El botón se deshabilita automáticamente si regates >= REGATES_REQUERIDOS */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegate}
                disabled={regates >= REGATES_REQUERIDOS} // Deshabilita el botón al completar
            >
                <Text style={styles.buttonText}>Regatear (+1)</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#006400', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, color: 'white', marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
    text: { fontSize: 20, color: 'white', marginBottom: 20, textAlign: 'center' },
    cooldown: { color: '#FFD700', fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    button: { backgroundColor: '#32CD32', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 10, marginTop: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default DesafioRegateScreen;
