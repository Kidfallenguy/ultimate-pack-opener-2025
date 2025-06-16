import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing, Image, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BETA_MINIGAMES } from '../utils/constants'; // <--- VERIFICA ESTA RUTA CAREFULLY!
              
// Importa el GameContext y los IDs de minijuegos
import { GameContext } from '../context/GameContext';

// ***************************************************************************
// ** NOTA IMPORTANTE: Este código ASUME que tu GameContext proporciona: **
// ** - addCoins (función para añadir monedas)                           **
// ** - updateBetaGameProgress (función para actualizar progreso Beta)    **
// ***************************************************************************
// ** La lógica de cooldown ha sido eliminada de esta pantalla específica. **
// ***************************************************************************
// ** Se ha reemplazado ImageBackground por Image con posicionamiento absoluto **
// ***************************************************************************
// ** Ajuste: Velocidad de movimiento del portero incrementa con cada toque. **
// ** Ajuste: Velocidad de movimiento del portero reinicia con cada tiro. **
// ** Ajuste: Velocidad del balón ajustada (más lenta en general, aumento gradual). **
// ** Ajuste: Aumentada la "hitbox" del portero para facilitar las atajadas. **
// ** Ajuste: Aumentado el tamaño (ancho y alto) y la velocidad del portero. **
// ** Ajuste: Lógica de fin de juego mejorada para detener el juego antes de la victoria. **
// ***************************************************************************

// --- Constantes del Juego ---
// Usamos el ID string correcto del minijuego de portero definido en GameContext
const GAME_ID_STRING = BETA_MINIGAMES.GAME6; // Debería ser 'beta_portero'
const SAVES_REQUERIDAS = 14; // Número de atajadas exitosas necesarias para completar el desafío
const RECOMPENSA_MONEDAS = 20; // Monedas que se otorgan al completar

// Configuración del área de juego y elementos
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const GOAL_WIDTH = SCREEN_WIDTH * 0.8; // Ancho de la portería (área de juego principal)
const GOAL_HEIGHT = GOAL_WIDTH * 0.7; // Altura de la portería (proporcional al ancho)

// --- TAMAÑO DEL GRÁFICO DEL PORTERO AUMENTADO ---
const GOALKEEPER_SIZE = 100; // Tamaño del gráfico del portero (Aumentado de 80)
const BALL_SIZE = 30; // Tamaño del gráfico del balón

// --- VELOCIDAD INICIAL, INCREMENTO Y LÍMITE DEL MOVIMIENTO DEL PORTERO AUMENTADOS ---
const BASE_MOVE_STEP = 35; // Cantidad inicial de píxeles que se mueve el portero por cada toque de botón (Aumentado de 25)
const MOVE_STEP_INCREMENT = 5; // Cantidad que aumenta MOVE_STEP con cada toque (Aumentado de 3)
const MAX_MOVE_STEP = 90; // Límite máximo para MOVE_STEP (Aumentado de 70)


// Posiciones Y fijas para el atacante (donde empieza el tiro) y la línea de gol (donde el portero ataja)
const ATTACKER_Y = GOAL_HEIGHT * 0.1; // Atacante en la parte alta del área de juego
const GOAL_LINE_Y = GOAL_HEIGHT * 0.8; // Línea donde el portero debe atajar

// Velocidad del tiro (duración de la animación del balón) - AJUSTADA (manteniendo los valores anteriores)
const BASE_SHOT_SPEED = 1800; // Duración base de la animación del balón
const MIN_SHOT_SPEED = 700; // Duración mínima

// --- Constante para aumentar la zona de detección de atajada (Hitbox) ---
// Mantenemos el buffer, pero la hitbox total también aumenta con el tamaño del portero
const SAVE_BUFFER = 20; // Cantidad de píxeles que se añade a cada lado de la hitbox del portero

// URLs de las imágenes (ejemplos, puedes reemplazarlas por las tuyas)
const GOAL_IMAGE_URL = 'https://media.istockphoto.com/id/508552766/es/foto/poste-de-porter%C3%ADa.jpg?s=612x612&w=0&k=20&c=n4RVMXHBhbflThK9GBaCxHNgqJ419nG6H1gu1DAdzFg='; // Imagen de la portería
// --- URL DE LA IMAGEN DE LOS GUANTES ---
const GOALKEEPER_IMAGE_URL = 'https://png.pngtree.com/png-vector/20240608/ourmid/pngtree-soccer-goalkeeper-gloves-semi-flat-color-object-png-image_12652117.png';
// --- FIN URL ---
const BALL_IMAGE_URL = 'https://static.vecteezy.com/system/resources/previews/011/421/474/non_2x/soccer-ball-realistic-png.png'; // Usaremos una imagen genérica por ahora


const DesafioPorteroScreen = ({ route }) => {
    const navigation = useNavigation();

    // --- Obtener funciones y estado necesarios del GameContext ---
    const {
        addCoins,
        updateBetaGameProgress,
        updateLegendTaskProgress,
        // Eliminados: isCooldownActive, setCooldown
        // Puedes obtener otros estados o funciones del contexto si los necesitas aquí
    } = useContext(GameContext);

    // Obtén el gameId pasado como parámetro de navegación (debería ser 'beta_portero')
    const { gameId } = route.params || {};

    // --- Logs de Depuración Cruciales (al inicio del componente) ---
    console.log("--- DesafioPorteroScreen: Renderizando (Inicio del componente) ---");
    console.log("--- DesafioPorteroScreen: gameId recibido:", gameId);
    console.log("--- DesafioPorteroScreen: GAME_ID_STRING esperado:", GAME_ID_STRING);
    console.log("--- DesafioPorteroScreen: Comparación gameId === GAME_ID_STRING:", gameId === GAME_ID_STRING);
    // --- Fin Logs de Depuración Cruciales ---

    // --- Verificación Crucial: Asegúrate de que el gameId es el esperado ---
    if (gameId !== GAME_ID_STRING) {
        console.error(`Error Crítico: DesafioPorteroScreen recibió gameId incorrecto: ${gameId}. Se esperaba ${GAME_ID_STRING}.`);
        Alert.alert("Error", "ID de desafío incorrecto.");
         useEffect(() => {
             const timer = setTimeout(() => {
                 navigation.navigate('BienvenidaBetaScreen');
             }, 2000);
             return () => clearTimeout(timer);
         }, [navigation]);
        return (
             <View style={styles.container}>
                 <Text style={styles.title}>Error</Text>
                 <Text style={styles.text}>ID de desafío incorrecto.</Text>
             </View>
         );
    }
    // --- Fin Verificación gameId ---


    const [successfulSaves, setSuccessfulSaves] = useState(0);
    const [gameInProgress, setGameInProgress] = useState(false); // Inicializa en false
    const [shotResult, setShotResult] = useState(null); // 'saved', 'missed', null

    // Estado para la velocidad de movimiento actual del portero
    const [currentMoveStep, setCurrentMoveStep] = useState(BASE_MOVE_STEP);


    // Posiciones animadas
    // La posición X del portero será controlada por los botones
    const goalkeeperPositionX = useRef(new Animated.Value((GOAL_WIDTH / 2) - (GOALKEEPER_SIZE / 2))).current;
    // La posición del balón será animada
    const ballPosition = useRef(new Animated.ValueXY({ x: 0, y: ATTACKER_Y })).current;

    const ballAnimationRef = useRef(null); // Referencia para la animación del balón


    // --- Lógica para mover el portero con botones ---
    const moveGoalkeeper = useCallback((direction) => {
        console.log(`DesafioPorteroScreen (${gameId}): moveGoalkeeper - Dirección: ${direction}, currentMoveStep: ${currentMoveStep}`); // Log de velocidad actual
        if (!gameInProgress) return; // Solo mover si el juego está en progreso

        const currentX = goalkeeperPositionX._value;
        let newX = currentX;

        if (direction === 'left') {
            newX = currentX - currentMoveStep; // Usa la velocidad actual
        } else if (direction === 'right') {
            newX = currentX + currentMoveStep; // Usa la velocidad actual
        }

        // Limitar la posición para que no salga de la portería
        // Ajustamos los límites para tener en cuenta el NUEVO GOALKEEPER_SIZE
        const clampedX = Math.max(0, Math.min(newX, GOAL_WIDTH - GOALKEEPER_SIZE));

        Animated.timing(goalkeeperPositionX, {
            toValue: clampedX,
            duration: 50, // Duración corta para un movimiento responsivo
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        console.log(`DesafioPorteroScreen (${gameId}): moveGoalkeeper - Movimiento: ${direction}, Nueva posición X: ${clampedX.toFixed(2)}`);

        // --- Incrementa la velocidad para el siguiente toque ---
        setCurrentMoveStep(prevStep => Math.min(prevStep + MOVE_STEP_INCREMENT, MAX_MOVE_STEP));
        console.log(`DesafioPorteroScreen (${gameId}): moveGoalkeeper - Siguiente MOVE_STEP será: ${Math.min(currentMoveStep + MOVE_STEP_INCREMENT, MAX_MOVE_STEP)}`); // Log del próximo valor

    }, [goalkeeperPositionX, gameInProgress, gameId, GOAL_WIDTH, GOALKEEPER_SIZE, currentMoveStep]); // Dependencias


    // --- Lógica para calcular la velocidad del tiro basada en el progreso ---
    const getShotSpeed = useCallback(() => {
        // Calcula la velocidad interpolando entre BASE_SHOT_SPEED y MIN_SHOT_SPEED
        // Usa successfulSaves directamente de la closure, que se actualiza con setSuccessfulSaves
        const progress = SAVES_REQUERIDAS > 1 ? successfulSaves / (SAVES_REQUERIDAS - 1) : 0;
        // La velocidad es inversamente proporcional a la duración, por eso restamos
        const speed = BASE_SHOT_SPEED - (BASE_SHOT_SPEED - MIN_SHOT_SPEED) * progress;
        return Math.max(speed, MIN_SHOT_SPEED); // Asegura que no sea más rápido que la mínima
    }, [successfulSaves]); // Depende de successfulSaves


    // --- Lógica para iniciar un nuevo tiro ---
    const startNewShot = useCallback(() => {
        console.log(`DesafioPorteroScreen (${gameId}): startNewShot - gameInProgress: ${gameInProgress}, successfulSaves: ${successfulSaves}`); // Log del estado actual
        if (!gameInProgress) {
            console.log(`DesafioPorteroScreen (${gameId}): startNewShot - Juego no en progreso, abortando.`);
            return; // No iniciar tiros si el juego no está en progreso
        }

        if (ballAnimationRef.current) {
            ballAnimationRef.current.stop(); // Detiene la animación anterior del balón
             console.log(`DesafioPorteroScreen (${gameId}): startNewShot - Animación de balón anterior detenida.`);
        }

        // Reinicia la posición del balón al inicio (atacante)
        // La posición X inicial del tiro puede ser aleatoria o fija (ej. centro)
        const startX = (GOAL_WIDTH / 2) - (BALL_SIZE / 2); // Tiro desde el centro del campo
        ballPosition.setValue({ x: startX, y: ATTACKER_Y });
         console.log(`DesafioPorteroScreen (${gameId}): startNewShot - Posición del balón reiniciada a (${startX.toFixed(0)}, ${ATTACKER_Y.toFixed(0)}).`);

        // --- Reinicia la velocidad de movimiento del portero al inicio de cada tiro ---
        setCurrentMoveStep(BASE_MOVE_STEP);
        console.log(`DesafioPorteroScreen (${gameId}): startNewShot - Velocidad de movimiento del portero reiniciada a: ${BASE_MOVE_STEP}`);
        // --- FIN Reinicio velocidad portero ---


        // Define un punto objetivo aleatorio en la línea de gol (donde el portero debe atajar)
        const targetX = Math.random() * (GOAL_WIDTH - BALL_SIZE); // Posición X aleatoria en el ancho de la portería
        const targetY = GOAL_LINE_Y; // En la línea de gol

        const currentSpeed = getShotSpeed(); // Usa la velocidad calculada
        console.log(`DesafioPorteroScreen (${gameId}): Iniciando nuevo tiro. Velocidad: ${currentSpeed.toFixed(0)}ms. Objetivo: (${targetX.toFixed(0)}, ${targetY.toFixed(0)})`);


        // Anima el balón hacia el punto objetivo
        ballAnimationRef.current = Animated.timing(ballPosition, {
            toValue: { x: targetX, y: targetY },
            duration: currentSpeed,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        console.log(`DesafioPorteroScreen (${gameId}): startNewShot - Iniciando animación del balón.`);
        ballAnimationRef.current.start(({ finished }) => {
            if (finished) {
                console.log(`DesafioPorteroScreen (${gameId}): Tiro finalizado. Verificando atajada.`);
                // Cuando la animación termina, verifica si hubo atajada
                checkSave(targetX); // Pasa la posición X donde llegó el balón
            } else {
                 console.log(`DesafioPorteroScreen (${gameId}): startNewShot - Animación del balón interrumpida.`);
                 // Si la animación no terminó (ej. pantalla desmontada), no verificar atajada
            }
        });
    }, [ballPosition, gameInProgress, gameId, getShotSpeed, checkSave, GOAL_WIDTH, BALL_SIZE, ATTACKER_Y, GOAL_LINE_Y, successfulSaves]); // Añadido successfulSaves a dependencias


     // --- useEffect para iniciar el juego y el primer tiro ---
     useEffect(() => {
         console.log(`DesafioPorteroScreen (${gameId}): useEffect - Iniciando juego directamente (sin cooldown).`);
         setGameInProgress(true); // Marca el juego como en progreso
         console.log(`DesafioPorteroScreen (${gameId}): useEffect - Estado local gameInProgress actualizado a: ${true}.`); // Log explícito del valor

         // Iniciar el primer tiro después de que gameInProgress se haya establecido
         const timer = setTimeout(() => {
             startNewShot();
             console.log(`DesafioPorteroScreen (${gameId}): useEffect - Primer tiro iniciado después de timeout.`);
         }, 100); // Pequeño retraso para asegurar que el estado se actualizó

        // Limpieza del efecto: Detiene la animación si la pantalla se desmonta
        return () => {
             console.log(`DesafioPorteroScreen (${gameId}): useEffect - Limpieza (desmontando).`);
             if (ballAnimationRef.current) {
                 ballAnimationRef.current.stop();
             }
             clearTimeout(timer); // Limpiar el timer si el componente se desmonta antes
        };

    }, [gameId, startNewShot]); // Depende de gameId y startNewShot


    // --- useFocusEffect para manejar la salida de la pantalla ---
    useFocusEffect(
        useCallback(() => {
            // console.log(`DesafioPorteroScreen (${gameId}) GANÓ foco.`);
            return () => {
                // console.log(`DesafioPorteroScreen (${gameId}) PERDIÓ foco.`);
                // Lógica al salir/perder foco: Detener el juego y la animación
                 if (ballAnimationRef.current) {
                     ballAnimationRef.current.stop();
                 }
                 setGameInProgress(false); // Marca el juego como no en progreso al salir
            };
        }, [gameId]) // Dependencias relevantes
    );


    // --- Lógica para verificar la atajada ---
    // Recibe la posición X donde el balón llegó a la línea de gol
    const checkSave = useCallback(async (ballFinalX) => { // <-- MARCADO COMO ASYNC AQUÍ!
        console.log(`DesafioPorteroScreen (${gameId}): checkSave - Verificando atajada...`);
        // Obtiene la posición X actual del portero en el momento en que el balón llega a la línea de gol
        const goalkeeperCurrentX = goalkeeperPositionX._value;

        console.log(`DesafioPorteroScreen (${gameId}): checkSave - Posición final del balón (X): ${ballFinalX.toFixed(2)}`);
        console.log(`DesafioPorteroScreen (${gameId}): checkSave - Posición del portero (X): ${goalkeeperCurrentX.toFixed(2)}`);

        // Define la "zona de atajada" del portero, AÑADIENDO EL BUFFER Y USANDO EL NUEVO GOALKEEPER_SIZE.
        // Consideramos que el portero ataja si sus "cajas" (con buffer) se superponen horizontalmente en la línea de gol.
        const goalkeeperLeftWithBuffer = goalkeeperCurrentX - SAVE_BUFFER; // Añade buffer a la izquierda
        const goalkeeperRightWithBuffer = goalkeeperCurrentX + GOALKEEPER_SIZE + SAVE_BUFFER; // Añade buffer a la derecha
        const ballLeft = ballFinalX;
        const ballRight = ballFinalX + BALL_SIZE;

        // Comprueba si hay superposición horizontal entre el balón y la zona del portero con buffer
        const isSaving = !(
            ballRight < goalkeeperLeftWithBuffer ||
            ballLeft > goalkeeperRightWithBuffer
        );

        console.log(`DesafioPorteroScreen (${gameId}): checkSave - Zona Portero (con buffer): ${goalkeeperLeftWithBuffer.toFixed(2)} - ${goalkeeperRightWithBuffer.toFixed(2)}`);
        console.log(`DesafioPorteroScreen (${gameId}): checkSave - ¿Atajada?: ${isSaving}`);


        // --- Lógica de resultado del tiro ---
        if (isSaving) {
            // ¡Atajada exitosa!
            console.log(`DesafioPorteroScreen (${gameId}): ¡Atajada exitosa!`);
            setShotResult('saved');
            // --- USANDO FORMA DE ACTUALIZACIÓN FUNCIONAL ---
            setSuccessfulSaves(prevSaves => {
                const nextSaves = prevSaves + 1;
                console.log(`DesafioPorteroScreen (${gameId}): setSuccessfulSaves (funcional) - prevSaves: ${prevSaves}, nextSaves: ${nextSaves}`);

                // Verifica si se completó el desafío DENTRO de esta actualización funcional
                if (nextSaves >= SAVES_REQUERIDAS) {
                     console.log(`DesafioPorteroScreen (${gameId}): ¡Desafío de portero completado con ${nextSaves} atajadas! (Dentro de setSuccessfulSaves)`);

                     // --- Detiene el juego explícitamente ---
                     setGameInProgress(false); // Detiene el juego
                      if (ballAnimationRef.current) {
                          ballAnimationRef.current.stop(); // Detiene la animación final del balón si aún estuviera corriendo
                      }
                     console.log(`DesafioPorteroScreen (${gameId}): Juego detenido.`);

                     // --- Espera un breve momento antes de mostrar la victoria y otorgar recompensas ---
                     setTimeout(() => {
                         console.log(`DesafioPorteroScreen (${gameId}): Mostrando victoria y otorgando recompensas.`);
                         // --- Otorgar Recompensas ---
                         if (typeof addCoins === 'function') {
                             addCoins(RECOMPENSA_MONEDAS);
                             console.log(`DesafioPorteroScreen (${gameId}): ${RECOMPENSA_MONEDAS} monedas añadidas.`);
                         } else {
                             console.error('DesafioPorteroScreen: Error de Configuración: addCoins no es una función en el contexto.');
                         }

                         // --- 🔥 AÑADE ESTE BLOQUE AQUÍ 🔥 ---
                         if (typeof updateLegendTaskProgress === 'function') { // Verifica que la función esté disponible
                             const taskId = 'complete_portero_14'; // El ID exacto de la misión de leyenda
                             const cantidad = 1; // Sumamos 1 al contador de "veces completado el desafío"

                             console.log(`DEBUG_LEYENDA: [Portero] Llamando a updateLegendTaskProgress para ${taskId} con cantidad ${cantidad}...`); // Log para depurar
                             updateLegendTaskProgress(taskId, cantidad); // <-- LLAMADA A LA FUNCIÓN DE LEYENDA
                             console.log(`DEBUG_LEYENDA: [Portero] updateLegendTaskProgress llamado.`); // Log para depurar

                         } else {
                             console.error('DesafioPorteroScreen: Error de Configuración: updateLegendTaskProgress no es una función en el contexto.');
                         }
                         // --- Actualiza el progreso del Evento Beta (marcar como completado UNA VEZ) ---
                         if (typeof updateBetaGameProgress === 'function') {
                              console.log(`DesafioPorteroScreen (${gameId}): Llamando a updateBetaGameProgress(${gameId})...`);
                              updateBetaGameProgress(gameId); // Llama con el gameId correcto ('beta_portero')
                              console.log(`DesafioPorteroScreen (${gameId}): updateBetaGameProgress llamado.`);
                          } else {
                              console.error('DesafioPorteroScreen: Error de Configuración: updateBetaGameProgress no es una función en el contexto.');
                          }

                         // Muestra la alerta final y navega de regreso
                         Alert.alert('¡Desafío completado!', `¡Felicidades! Ganaste ${RECOMPENSA_MONEDAS} monedas.`, [
                             { text: 'Volver', onPress: () => navigation.navigate('BienvenidaBetaScreen') },
                         ]);
                          console.log(`DesafioPorteroScreen (${gameId}): Alerta de completado mostrada. Navegando al presionar Volver.`);

                     }, 500); // Pequeña espera (500ms)


                } else {
                    // Si aún no se completan las atajadas requeridas, programa el siguiente tiro
                     console.log(`DesafioPorteroScreen (${gameId}): checkSave - Atajada exitosa pero desafío no completado. Programando siguiente tiro.`);
                     setTimeout(() => startNewShot(), 1000); // Espera un poco antes del siguiente tiro
                }
                return nextSaves; // Retorna el nuevo valor del estado
            });
            // --- FIN FORMA DE ACTUALIZACIÓN FUNCIONAL ---


        } else {
            // Gol (tiro fallido)
            console.log(`DesafioPorteroScreen (${gameId}): ¡Gol!`);
            setShotResult('missed');
            Alert.alert('¡Gol!', 'No lograste atajar el balón. Inténtalo de nuevo.');
            console.log(`DesafioPorteroScreen (${gameId}): checkSave - Intentando setSuccessfulSaves a: 0 (Gol recibido)`);
            setSuccessfulSaves(0); // Reiniciar contador al recibir gol
            console.log(`DesafioPorteroScreen (${gameId}): checkSave - successfulSaves después de setear (puede no reflejarse inmediatamente): ${successfulSaves}`);

            console.log(`DesafioPorteroScreen (${gameId}): checkSave - Gol recibido. Programando siguiente tiro.`);
            setTimeout(() => startNewShot(), 1000); // Espera un poco antes del siguiente tiro
        }

        // Reinicia el resultado visual después de un breve momento (esto ocurre independientemente del resultado)
        setTimeout(() => setShotResult(null), 500); // Muestra el resultado por 500ms

    }, [goalkeeperPositionX, ballPosition, gameId, addCoins, updateBetaGameProgress, startNewShot, SAVES_REQUERIDAS, RECOMPENSA_MONEDAS, GOALKEEPER_SIZE, BALL_SIZE, SAVE_BUFFER, navigation]); // Añadido navigation a dependencias
    // --- Renderizado ---
    // Eliminado: Renderizado condicional basado en cooldown

    // Si el juego está en progreso o no, siempre mostramos la pantalla principal del desafío
     console.log(`DesafioPorteroScreen (${gameId}): Renderizando pantalla de desafío.`);
     console.log(`DesafioPorteroScreen (${gameId}): Estado actual al renderizar: gameInProgress=${gameInProgress}, successfulSaves=${successfulSaves}`); // Log del estado actual al renderizar


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Desafío de Portero</Text>

            {/* Área de la portería (área de juego principal) */}
            <View
                style={styles.goalArea}
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    console.log(`DesafioPorteroScreen (${gameId}): onLayout - goalArea - Posición: (${x.toFixed(0)}, ${y.toFixed(0)}), Tamaño: (${width.toFixed(0)}, ${height.toFixed(0)})`);
                }}
            >
                 {/* Imagen de la portería como fondo (usando Image en lugar de ImageBackground) */}
                 <Image
                     source={{ uri: GOAL_IMAGE_URL }}
                     style={styles.goalBackgroundImage} // Nuevo estilo para la imagen de fondo
                     resizeMode="stretch" // Ajusta la imagen para llenar el área
                     onError={(e) => console.error('DesafioPorteroScreen: Error cargando imagen de la portería:', e.nativeEvent.error)} // Añadido onError
                 />

                 {/* Balón animado */}
                 {/* Solo renderiza el balón si el juego está en progreso */}
                 {gameInProgress && (
                     <Animated.View style={[styles.ball, ballPosition.getLayout()]} >
                          {/* Imagen del balón */}
                          <Image
                              source={{ uri: BALL_IMAGE_URL }}
                              style={styles.ballImage}
                              resizeMode="contain"
                              onError={(e) => console.error('DesafioPorteroScreen: Error cargando imagen del balón:', e.nativeEvent.error)} // Añadido onError
                          />
                     </Animated.View>
                 )}


                 {/* Portero controlable por los botones */}
                 {/* La posición X del portero es controlada por goalkeeperPositionX */}
                 {/* La posición Y es fija en la línea de gol */}
                 <Animated.View
                     style={[
                         styles.goalkeeper,
                         {
                             transform: [{ translateX: goalkeeperPositionX }],
                             left: 0, // La animación controla la posición horizontal
                             top: GOAL_LINE_Y - (GOALKEEPER_SIZE / 2), // Centra verticalmente en la línea de gol
                             // --- AÑADIDO FONDO VISIBLE PARA DEBUG ---
                             backgroundColor: 'rgba(255, 0, 0, 0.5)', // Rojo semitransparente
                             // --- FIN AÑADIDO ---
                         },
                     ]}
                     onLayout={(event) => {
                         const { x, y, width, height } = event.nativeEvent.layout;
                         console.log(`DesafioPorteroScreen (${gameId}): onLayout - goalkeeper - Posición: (${x.toFixed(0)}, ${y.toFixed(0)}), Tamaño: (${width.toFixed(0)}, ${height.toFixed(0)})`);
                     }}
                 >
                      {/* Usar la nueva imagen de los guantes */}
                      {/* Añadido onError para depurar si la imagen no carga */}
                      <Image
                          source={{ uri: GOALKEEPER_IMAGE_URL }}
                          style={styles.goalkeeperImage}
                          resizeMode="contain"
                          onError={(e) => console.error('DesafioPorteroScreen: Error cargando imagen del portero:', e.nativeEvent.error)}
                      />
                 </Animated.View>

            </View>

            {/* Controles de movimiento del portero */}
            {gameInProgress && ( // Mostrar controles solo si el juego está en progreso
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => moveGoalkeeper('left')}
                    >
                        <Text style={styles.controlButtonText}>{'<'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => moveGoalkeeper('right')}
                    >
                        <Text style={styles.controlButtonText}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
            )}


            {/* Muestra el progreso de atajadas exitosas */}
            <Text style={styles.progressText}>Atajadas Exitosas: {successfulSaves} / {SAVES_REQUERIDAS}</Text>

            {/* Indicador visual del resultado del tiro (Opcional) */}
            {shotResult === 'saved' && <Text style={styles.resultTextSuccess}>¡ATAJADA!</Text>}
            {shotResult === 'missed' && <Text style={styles.resultFail}>¡GOL!</Text>}

             {/* Botón para volver (siempre visible, pero no interactivo si el juego está en progreso) */}
             <TouchableOpacity
                 style={[styles.button, gameInProgress && styles.buttonDisabled]}
                 onPress={() => navigation.navigate('BienvenidaBetaScreen')}
                 disabled={gameInProgress} // Deshabilitar si el juego está en progreso
             >
                 <Text style={styles.buttonText}>Volver</Text>
             </TouchableOpacity>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A4D2E', // Fondo verde oscuro (campo)
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        color: 'white',
        marginBottom: 20, // Espacio reducido
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    cooldown: { // Mantener estilo por si acaso, aunque no se usa en el render principal
        color: '#FFD700', // Dorado
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    goalArea: {
        width: GOAL_WIDTH,
        height: GOAL_HEIGHT,
        marginVertical: 20,
        position: 'relative', // Necesario para posicionar elementos absolutos dentro
        overflow: 'hidden', // Oculta elementos que salgan del área
        borderRadius: 10, // Bordes redondeados
        borderWidth: 2, // Borde para simular la portería
        borderColor: '#fff', // Color del borde
    },
    goalBackgroundImage: { // Nuevo estilo para la imagen de fondo
        position: 'absolute', // Posicionamiento absoluto para cubrir el contenedor padre
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Asegura que esté detrás de otros elementos
    },
    goalkeeper: {
        // --- TAMAÑO DEL PORTERO APLICADO AQUÍ ---
        width: GOALKEEPER_SIZE,
        height: GOALKEEPER_SIZE,
        position: 'absolute', // Permite moverlo con transform
        alignItems: 'center',
        justifyContent: 'center',
        // --- AÑADIDO FONDO VISIBLE PARA DEBUG ---
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // Rojo semitransparente
        // --- FIN AÑADIDO ---
    },
     goalkeeperImage: {
         width: '100%',
         height: '100%',
     },
    ball: {
        width: BALL_SIZE,
        height: BALL_SIZE,
        position: 'absolute', // Permite moverlo con animación
    },
     ballImage: {
         width: '100%',
         height: '100%',
     },
    controlsContainer: { // Contenedor para los botones de control
        flexDirection: 'row',
        marginTop: 20,
        width: GOAL_WIDTH, // Ancho igual al área de la portería
        justifyContent: 'space-around', // Espacio entre los botones
    },
    controlButton: { // Estilo para los botones de control
        backgroundColor: '#FF9800', // Naranja
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    controlButtonText: { // Estilo para el texto de los botones de control
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007bff', // Azul para el botón Volver
        paddingVertical: 10, // Ajustado padding
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20, // Espacio arriba
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
     buttonDisabled: {
         backgroundColor: '#ccc', // Gris para deshabilitado
     },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 18,
        color: 'white',
        marginTop: 20,
        fontWeight: 'bold',
    },
    resultTextSuccess: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853', // Verde brillante
        marginTop: 10,
    },
    resultFail: { // Cambiado el nombre para evitar conflicto si usas resultTextFail en otro lado
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5252', // Rojo
        marginTop: 10,
    },
});

export default DesafioPorteroScreen;
