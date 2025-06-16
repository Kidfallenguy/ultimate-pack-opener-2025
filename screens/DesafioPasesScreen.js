import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'; // Importa useRef
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Image } from 'react-native'; // Importa Dimensions, Image
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BETA_MINIGAMES } from '../utils/constants'; // <--- VERIFICA ESTA RUTA CAREFULLY!
     
// Importa el GameContext
import { GameContext } from '../context/GameContext';

// ***************************************************************************
// ** NOTA IMPORTANTE: Este código ASUME que tu GameContext proporciona: **
// ** - addCoins (función para añadir monedas)                           **
// ** - updateBetaGameProgress (función para actualizar progreso Beta)    **
// ** - isCooldownActive (función asíncrona para chequear si un juego está en cooldown) **
// ** - setCooldown (función asíncrona para establecer cooldown a un juego) **
// ***************************************************************************

// --- Constantes del Juego ---
const GAME_ID_STRING = 'beta_pases'; // El ID string de este minijuego en BETA_MINIGAMES
const PASES_REQUERIDOS = 10; // Número de pases exitosos (taps en el objetivo) necesarios
const RECOMPENSA_MONEDAS = 8; // Monedas que se otorgan al completar

// Configuración del objetivo a tocar
const TARGET_SIZE = 60; // Tamaño del área táctil del objetivo
const TARGET_APPEAR_DELAY = 600; // Tiempo en ms que el objetivo tarda en reaparecer después de ser tocado

// URL de una imagen para el objetivo (ej. una pelota o un icono de jugador)
// Usaremos la misma pelota que en el desafío de tiros por simplicidad
const TARGET_IMAGE_URL = 'https://static.vecteezy.com/system/resources/previews/011/421/474/non_2x/soccer-ball-realistic-png.png';


// Obtiene las dimensiones de la pantalla para calcular el área de juego
const { width, height } = Dimensions.get('window');

const DesafioPasesScreen = ({ route }) => {
    const navigation = useNavigation();

    // --- Obtener funciones y estado necesarios del GameContext ---
    const {
        addCoins,
        updateBetaGameProgress, // Obtiene la función para actualizar el progreso Beta
        isCooldownActive,
        setCooldown,
        // Puedes obtener otros estados o funciones del contexto si los necesitas aquí
    } = useContext(GameContext);

    // Obtén el gameId pasado como parámetro de navegación (debería ser 'beta_pases')
    // Usamos un valor por defecto basado en la constante local por si no se pasa el parámetro
    const { gameId = GAME_ID_STRING } = route.params || {};

    // --- Verificación Crucial: Asegúrate de que el gameId es el esperado ---
    // Esto ayuda a detectar si se navegó a esta pantalla con un gameId incorrecto
    if (gameId !== GAME_ID_STRING) {
        console.error(`Error Crítico: DesafioPasesScreen recibió gameId incorrecto: ${gameId}. Se esperaba ${GAME_ID_STRING}.`);
        Alert.alert("Error", "No se pudo cargar el desafío. ID incorrecto.");
         // Considera navegar de regreso automáticamente
         useEffect(() => { navigation.navigate('BienvenidaBetaScreen'); }, [navigation]);
        return (
             <View style={styles.container}>
                 <Text style={styles.title}>Error</Text>
                 <Text style={styles.text}>ID de desafío incorrecto.</Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BienvenidaBetaScreen')}>
                    <Text style={styles.buttonText}>Volver</Text>
                 </TouchableOpacity>
             </View>
         ); // Renderiza un mensaje de error y sale del componente
    }
    // --- Fin Verificación gameId ---


    const [pasesExitosos, setPasesExitosos] = useState(0);
    const [cooldownActive, setCooldownActive] = useState(true); // Inicializa en true y luego verifica el estado real en useEffect
    const [gameInProgress, setGameInProgress] = useState(false); // Estado para controlar si el juego está activo
    const [targetPosition, setTargetPosition] = useState(null); // Posición {x, y} del objetivo, null si está oculto

    // Referencia para el temporizador de reaparición del objetivo
    const targetTimerRef = useRef(null);


    // --- Lógica para hacer aparecer el objetivo en una posición aleatoria ---
    const showTargetAtRandomPosition = useCallback(() => {
        // Calcula el área de juego disponible (evitando los bordes y el tamaño del objetivo)
        // Asumimos que el contenedor principal (styles.container) usa flex: 1
        // Necesitamos el tamaño real del área de juego después del renderizado
        // Por ahora, usamos las dimensiones de la ventana y restamos un padding
        const playAreaWidth = width - (styles.container.paddingLeft || 0) - (styles.container.paddingRight || 0) - TARGET_SIZE;
        const playAreaHeight = height - (styles.container.paddingTop || 0) - (styles.container.paddingBottom || 0) - TARGET_SIZE;

        // Genera posiciones aleatorias dentro del área de juego
        const randomX = Math.random() * playAreaWidth;
        const randomY = Math.random() * playAreaHeight;

        setTargetPosition({ x: randomX, y: randomY });
         console.log(`Objetivo aparecido en: (${randomX.toFixed(0)}, ${randomY.toFixed(0)})`);

    }, []); // Dependencias vacías, esta función no cambia


    // --- useEffect para chequear Cooldown al cargar la pantalla ---
    useEffect(() => {
         console.log(`DesafioPasesScreen (${gameId}) montado. Chequeando cooldown.`);
        if (typeof isCooldownActive === 'function') {
             const checkCooldownStatus = async () => {
                 try {
                     const active = await isCooldownActive(gameId);
                     setCooldownActive(active);
                     console.log(`Cooldown para ${gameId}: ${active ? 'Activo' : 'Inactivo'}.`);
                     // Si no está en cooldown, inicia el juego
                     if (!active) {
                         setGameInProgress(true);
                         showTargetAtRandomPosition(); // Muestra el primer objetivo
                     }
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

        // Limpieza del efecto: Limpia el temporizador si la pantalla se desmonta
        return () => {
             console.log(`DesafioPasesScreen (${gameId}) se va a desmontar.`);
             if (targetTimerRef.current) {
                 clearTimeout(targetTimerRef.current);
             }
        };

    }, [gameId, isCooldownActive, setCooldown, showTargetAtRandomPosition]); // Dependencias


    // --- useFocusEffect para manejar la salida de la pantalla ---
    useFocusEffect(
        useCallback(() => {
            // console.log(`DesafioPasesScreen (${gameId}) GANÓ foco.`);
            return () => {
                // console.log(`DesafioPasesScreen (${gameId}) PERDIÓ foco.`);
                // Lógica al salir/perder foco: Detener el juego y ocultar el objetivo
                 setGameInProgress(false);
                 setTargetPosition(null);
                 if (targetTimerRef.current) {
                     clearTimeout(targetTimerRef.current);
                 }
            };
        }, [gameId, pasesExitosos, updateBetaGameProgress]) // Dependencias relevantes
    );


    // --- Handler para tocar el objetivo ---
    const handleTargetPress = async () => {
        // No permitir tocar si el juego no está en progreso, está en cooldown,
        // o si el objetivo no está visible, o si ya se completaron los pases requeridos.
        if (!gameInProgress || cooldownActive || targetPosition === null || pasesExitosos >= PASES_REQUERIDOS) {
            console.log("Intento de tocar objetivo ignorado (juego no en progreso, cooldown, objetivo oculto, o completado)");
            return;
        }

        // Oculta el objetivo inmediatamente al tocarlo
        setTargetPosition(null);

        const nextPases = pasesExitosos + 1;
        setPasesExitosos(nextPases); // Incrementa el contador de pases exitosos

        console.log(`Pase exitoso: ${nextPases}`); // Log para verificar el contador

        // Lógica al completar los pases requeridos
        if (nextPases >= PASES_REQUERIDOS) {
            console.log(`¡Desafío Pases (${gameId}) completado con ${nextPases} pases!`);

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
            if (typeof updateBetaGameProgress === 'function') {
                 console.log(`Actualizando progreso Beta para ${gameId} (Completación de desafío).`);
                 updateBetaGameProgress(gameId); // Llama con el gameId correcto ('beta_pases')
             } else {
                 console.error('Error de Configuración: updateBetaGameProgress no es una función en el contexto.');
             }

            // 4. Muestra la alerta final y navega de regreso
            Alert.alert('¡Desafío completado!', `Ganaste ${RECOMPENSA_MONEDAS} monedas.`, [
                { text: 'Volver', onPress: () => navigation.navigate('BienvenidaBetaScreen') },
            ]);

            setGameInProgress(false); // Marca el juego como no en progreso

        } else {
            // Si aún no se completan los pases requeridos, programa la reaparición del objetivo
            targetTimerRef.current = setTimeout(() => {
                 showTargetAtRandomPosition(); // Muestra el siguiente objetivo
            }, TARGET_APPEAR_DELAY);
        }
    };


    // --- Renderizado condicional basado en cooldown ---

    // Si está en cooldown, muestra la pantalla de cooldown
    if (cooldownActive) {
        console.log(`DesafioPasesScreen (${gameId}): Renderizando pantalla de cooldown.`);
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Desafío de Pases</Text>
                <Text style={styles.cooldown}>Ya jugaste este desafío. Vuelve en 24 horas.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BienvenidaBetaScreen')}>
                    <Text style={styles.buttonText}>Volver</Text>
                 </TouchableOpacity>
            </View>
        );
    }

    // Si NO está en cooldown y el juego está en progreso, muestra la pantalla del desafío
     console.log(`DesafioPasesScreen (${gameId}): Renderizando pantalla de desafío.`);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Desafío de Pases</Text>

            {/* Muestra el progreso de pases exitosos */}
            <Text style={styles.progressText}>Pases Exitosos: {pasesExitosos} / {PASES_REQUERIDOS}</Text>

            {/* Área de juego donde aparece el objetivo */}
            {gameInProgress && ( // Solo renderiza el área de juego si el juego está en progreso
                <View style={styles.playArea}>
                    {/* El objetivo aparece solo si targetPosition no es null */}
                    {targetPosition !== null && (
                        <TouchableOpacity
                            style={[
                                styles.target,
                                { left: targetPosition.x, top: targetPosition.y } // Posición aleatoria
                            ]}
                            onPress={handleTargetPress} // Llama al handler al tocar
                            activeOpacity={0.8} // Ligera opacidad al tocar
                        >
                            {/* Imagen dentro del objetivo */}
                            <Image
                                source={{ uri: TARGET_IMAGE_URL }}
                                style={styles.targetImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            )}

             {/* Mensaje si el juego no está en progreso (ej. esperando primer objetivo) */}
             {!gameInProgress && !cooldownActive && (
                 <Text style={styles.waitingText}>Preparando desafío...</Text>
             )}


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A237E', // Azul oscuro (color de equipo)
        alignItems: 'center',
        justifyContent: 'flex-start', // Alinea arriba para dejar espacio al área de juego
        padding: 20,
    },
    title: {
        fontSize: 30,
        color: 'white',
        marginBottom: 20, // Menos margen inferior para dejar espacio al área de juego
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    cooldown: {
        color: '#FFD700', // Dorado
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: { // Este estilo de botón solo se usa para el botón "Volver" en la pantalla de cooldown
        backgroundColor: '#FF9800', // Naranja vibrante
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: { // Este estilo de texto de botón solo se usa para el botón "Volver" en la pantalla de cooldown
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 24, // Tamaño más grande para el progreso
        color: 'white',
        marginTop: 10, // Espacio debajo del título
        marginBottom: 10, // Espacio arriba del área de juego
        fontWeight: 'bold',
    },
    playArea: {
        flex: 1, // Ocupa el espacio restante
        width: '100%', // Ancho completo
        backgroundColor: '#3F51B5', // Azul más claro para el área de juego
        borderRadius: 10,
        overflow: 'hidden', // Asegura que el objetivo no se salga del área
        position: 'relative', // Necesario para posicionar el objetivo absolutamente dentro
    },
    target: {
        position: 'absolute', // Permite posicionar con left y top
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        justifyContent: 'center', // Centra la imagen dentro del objetivo
        alignItems: 'center', // Centra la imagen dentro del objetivo
        // backgroundColor: 'red', // Fondo temporal para ver el área táctil
        borderRadius: TARGET_SIZE / 2, // Hace el área táctil redonda si la imagen es redonda
    },
    targetImage: {
        width: TARGET_SIZE, // La imagen ocupa todo el tamaño del objetivo
        height: TARGET_SIZE,
    },
    waitingText: {
         fontSize: 18,
         color: 'white',
         marginTop: 50,
    }
});

export default DesafioPasesScreen;