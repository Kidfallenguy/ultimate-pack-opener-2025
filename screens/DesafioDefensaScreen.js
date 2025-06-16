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
// ** Nueva jugabilidad: Intercepción de pases tocando las zonas de pase. **
// ** Mejoras: Pelota más rápida, fondo, reglas, objetivos más pequeños y más. **
// ** Ajuste: Posiciones de objetivos modificadas para estar abajo sin ambigüedad vertical. **
// ** Ajuste: Velocidad de la pelota ligeramente reducida. **
// ** FIX: Asegurar reinicio correcto de la animación del balón. **
// ***************************************************************************

// --- Constantes del Juego ---
// Usamos el ID string correcto del minijuego de defensa definido en GameContext
const GAME_ID_STRING = BETA_MINIGAMES.GAME4; // Debería ser 'beta_defensa'
const INTERCEPTIONS_REQUERIDAS = 5; // Número de intercepciones exitosas necesarias para completar el desafío
const RECOMPENSA_MONEDAS = 15; // Monedas que se otorgan al completar

// Configuración del área de juego y elementos
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const GAME_AREA_WIDTH = SCREEN_WIDTH * 0.9; // Área de juego
const GAME_AREA_HEIGHT = SCREEN_HEIGHT * 0.5; // Altura del área de juego (aumentada para reglas y fondo)

const BALL_SIZE = 30; // Tamaño del gráfico del balón
const TARGET_SIZE = 40; // Tamaño de las zonas de toque

// Posición Y inicial del balón (simulando un pase desde arriba)
const BALL_START_Y = 0;

// Definir las posiciones de los posibles objetivos (zonas de pase)
// Posiciones ajustadas para estar todas abajo y evitar alineaciones verticales directas.
const TARGET_POSITIONS = [
    { x: GAME_AREA_WIDTH * 0.08 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.85 - TARGET_SIZE / 2 }, // Abajo izquierda 1
    { x: GAME_AREA_WIDTH * 0.25 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.75 - TARGET_SIZE / 2 }, // Abajo izquierda 2 (ligeramente más arriba)
    { x: GAME_AREA_WIDTH * 0.42 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.85 - TARGET_SIZE / 2 }, // Abajo centro-izquierda
    { x: GAME_AREA_WIDTH * 0.58 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.75 - TARGET_SIZE / 2 }, // Abajo centro-derecha (ligeramente más arriba)
    { x: GAME_AREA_WIDTH * 0.75 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.85 - TARGET_SIZE / 2 }, // Abajo derecha 2
    { x: GAME_AREA_WIDTH * 0.92 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.75 - TARGET_SIZE / 2 }, // Abajo derecha 1 (ligeramente más arriba)

    { x: GAME_AREA_WIDTH * 0.15 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.6 - TARGET_SIZE / 2 }, // Medio-bajo izquierda
    { x: GAME_AREA_WIDTH * 0.85 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.6 - TARGET_SIZE / 2 }, // Medio-bajo derecha

    { x: GAME_AREA_WIDTH * 0.5 - TARGET_SIZE / 2, y: GAME_AREA_HEIGHT * 0.5 - TARGET_SIZE / 2 }, // Centro (ligeramente más arriba que las otras)
];


// Velocidad del pase (duración de la animación del balón) - Ajustada para ser ligeramente más lenta
const BASE_PASS_SPEED = 2200; // Aumentado de 1800
const MIN_PASS_SPEED = 900; // Aumentado de 700

// URLs de las imágenes
const BALL_IMAGE_URL = 'https://static.vecteezy.com/system/resources/previews/011/421/474/non_2x/soccer-ball-realistic-png.png'; // Usaremos una imagen genérica
const FIELD_BACKGROUND_URL = 'https://thumbs.dreamstime.com/b/campo-de-f%C3%BAtbol-y-fondo-del-proyector-en-el-estadio-115623386.jpg'; // Nueva URL para fondo de campo


const DesafioDefensaScreen = ({ route }) => {
    const navigation = useNavigation();

    // --- Obtener funciones y estado necesarios del GameContext ---
    const {
        addCoins,
        updateBetaGameProgress,
        // Eliminados: isCooldownActive, setCooldown
        // Puedes obtener otros estados o funciones del contexto si los necesitas aquí
    } = useContext(GameContext);

    // Obtén el gameId pasado como parámetro de navegación (debería ser 'beta_defensa')
    const { gameId } = route.params || {};

    // --- Logs de Depuración Cruciales (al inicio del componente) ---
    console.log("--- DesafioDefensaScreen: Renderizando (Inicio del componente) ---");
    console.log("--- DesafioDefensaScreen: gameId recibido:", gameId);
    console.log("--- DesafioDefensaScreen: GAME_ID_STRING esperado:", GAME_ID_STRING);
    console.log("--- DesafioDefensaScreen: Comparación gameId === GAME_ID_STRING:", gameId === GAME_ID_STRING);
    // --- Fin Logs de Depuración Cruciales ---

    // --- Verificación Crucial: Asegúrate de que el gameId es el esperado ---
    if (gameId !== GAME_ID_STRING) {
        console.error(`Error Crítico: DesafioDefensaScreen recibió gameId incorrecto: ${gameId}. Se esperaba ${GAME_ID_STRING}.`);
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


    const [successfulInterceptions, setSuccessfulInterceptions] = useState(0);
    // Eliminado: const [cooldownActive, setCooldownActive] = useState(true);
    const [gameInProgress, setGameInProgress] = useState(false); // Inicializa en false
    const [passResult, setPassResult] = useState(null); // 'intercepted', 'failed', null

    // Estado para saber cuál es el objetivo actual del pase
    const [currentPassTargetIndex, setCurrentPassTargetIndex] = useState(null);

    // Posición animada del balón
    const ballPosition = useRef(new Animated.ValueXY({ x: GAME_AREA_WIDTH / 2 - BALL_SIZE / 2, y: BALL_START_Y })).current;

    const ballAnimationRef = useRef(null); // Referencia para la animación del balón


    // --- Lógica para calcular la velocidad del pase basada en el progreso ---
    const getPassSpeed = useCallback(() => {
        // Calcula la velocidad interpolando entre BASE_PASS_SPEED y MIN_PASS_SPEED
        const progress = INTERCEPTIONS_REQUERIDAS > 1 ? successfulInterceptions / (INTERCEPTIONS_REQUERIDAS - 1) : 0;
        const speed = BASE_PASS_SPEED - (BASE_PASS_SPEED - MIN_PASS_SPEED) * progress;
        return Math.max(speed, MIN_PASS_SPEED); // Asegura que no sea más rápido que la mínima
    }, [successfulInterceptions]); // Depende de successfulInterceptions

    // --- Lógica para iniciar un nuevo pase ---
    const startNewPass = useCallback(() => {
        console.log(`DesafioDefensaScreen (${gameId}): startNewPass - gameInProgress: ${gameInProgress}, successfulInterceptions: ${successfulInterceptions}`);
        if (!gameInProgress) {
            console.log(`DesafioDefensaScreen (${gameId}): startNewPass - Juego no en progreso, abortando.`);
            return; // No iniciar pases si el juego no está en progreso
        }

        // Detiene cualquier animación de balón anterior
        if (ballAnimationRef.current) {
            ballAnimationRef.current.stop();
             console.log(`DesafioDefensaScreen (${gameId}): startNewPass - Animación de balón anterior detenida.`);
        }

        // --- FIX: Reinicia la posición del balón explícitamente ANTES de iniciar la nueva animación ---
        ballPosition.setValue({ x: GAME_AREA_WIDTH / 2 - BALL_SIZE / 2, y: BALL_START_Y });
        console.log(`DesafioDefensaScreen (${gameId}): startNewPass - Posición del balón reiniciada a (${(GAME_AREA_WIDTH / 2 - BALL_SIZE / 2).toFixed(0)}, ${BALL_START_Y.toFixed(0)}).`);
        // --- FIN FIX ---


        // Selecciona un objetivo aleatorio para el pase
        const targetIndex = Math.floor(Math.random() * TARGET_POSITIONS.length);
        const target = TARGET_POSITIONS[targetIndex];
        setCurrentPassTargetIndex(targetIndex); // Guarda el índice del objetivo actual


        const currentSpeed = getPassSpeed();
        console.log(`DesafioDefensaScreen (${gameId}): Iniciando nuevo pase. Velocidad: ${currentSpeed.toFixed(0)}ms. Objetivo (Índice ${targetIndex}): (${target.x.toFixed(0)}, ${target.y.toFixed(0)})`);


        // Anima el balón hacia el punto objetivo
        ballAnimationRef.current = Animated.timing(ballPosition, {
            toValue: { x: target.x, y: target.y },
            duration: currentSpeed,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        console.log(`DesafioDefensaScreen (${gameId}): startNewPass - Iniciando animación del balón.`);
        ballAnimationRef.current.start(({ finished }) => {
            if (finished) {
                console.log(`DesafioDefensaScreen (${gameId}): Pase finalizado sin intercepción (balón llegó al objetivo).`);
                // Si la animación termina SIN que el jugador haya interceptado, es un pase fallido
                handlePassFailed();
            } else {
                 console.log(`DesafioDefensaScreen (${gameId}): startNewPass - Animación del balón interrumpida (posiblemente por intercepción).`);
                 // Si la animación no terminó (ej. pantalla desmontada o intercepción), no hacer nada aquí
            }
        });
    }, [ballPosition, gameInProgress, gameId, getPassSpeed, successfulInterceptions, handlePassFailed, GAME_AREA_WIDTH, BALL_SIZE, BALL_START_Y]); // Dependencias actualizadas

    // --- Lógica para manejar un pase fallido (balón llegó al objetivo sin ser interceptado o toque incorrecto) ---
    const handlePassFailed = useCallback(() => {
        console.log(`DesafioDefensaScreen (${gameId}): handlePassFailed - Pase fallido.`);
        setPassResult('failed');
        Alert.alert('¡Pase completo!', 'No lograste interceptar el balón. Inténtalo de nuevo.');
        console.log(`DesafioDefensaScreen (${gameId}): handlePassFailed - Intentando setSuccessfulInterceptions a: 0`);
        setSuccessfulInterceptions(0); // Reiniciar contador al fallar

        // Reinicia el resultado visual y programa el siguiente pase
        setTimeout(() => {
            setPassResult(null);
            startNewPass();
            console.log(`DesafioDefensaScreen (${gameId}): handlePassFailed - Programando siguiente pase.`);
        }, 1000); // Espera un poco antes del siguiente pase
    }, [gameId, startNewPass]); // Dependencias

    // --- Lógica para manejar un toque del jugador ---
    const handleTap = useCallback((tappedTargetIndex) => {
        console.log(`DesafioDefensaScreen (${gameId}): handleTap - Tocado objetivo con índice: ${tappedTargetIndex}. Objetivo actual del pase: ${currentPassTargetIndex}`);
        if (!gameInProgress) {
            console.log(`DesafioDefensaScreen (${gameId}): handleTap - Juego no en progreso, ignorando toque.`);
            return; // Ignorar toques si el juego no está en progreso
        }

        // Verifica si el toque fue en el objetivo correcto del pase actual
        if (tappedTargetIndex === currentPassTargetIndex) {
            // Verifica si el balón aún no ha llegado al objetivo
            // Usamos una verificación de distancia simple
            const ballCurrentX = ballPosition.x._value;
            const ballCurrentY = ballPosition.y._value;
            const target = TARGET_POSITIONS[currentPassTargetIndex];

            // Calcula la distancia entre el centro del balón y el centro del objetivo
            const ballCenterX = ballCurrentX + BALL_SIZE / 2;
            const ballCenterY = ballCurrentY + BALL_SIZE / 2;
            const targetCenterX = target.x + TARGET_SIZE / 2;
            const targetCenterY = target.y + TARGET_SIZE / 2;

            const distance = Math.sqrt(
                Math.pow(ballCenterX - targetCenterX, 2) + Math.pow(ballCenterY - targetCenterY, 2)
            );

            // Define un umbral de distancia para considerar que el balón "llegó" o está demasiado cerca
            // Si la distancia es menor que este umbral, se considera que el balón ya llegó.
            const arrivalThreshold = (BALL_SIZE / 2) + (TARGET_SIZE / 4); // Ajusta este valor si es necesario


            if (distance > arrivalThreshold) {
                 // ¡Intercepción exitosa! El toque fue correcto Y el balón aún no llegó.
                 console.log(`DesafioDefensaScreen (${gameId}): ¡Intercepción exitosa en objetivo ${tappedTargetIndex}! Distancia: ${distance.toFixed(0)} > Umbral: ${arrivalThreshold.toFixed(0)}`);
                 setPassResult('intercepted');

                 // Detiene la animación del balón inmediatamente
                 if (ballAnimationRef.current) {
                     ballAnimationRef.current.stop();
                      console.log(`DesafioDefensaScreen (${gameId}): handleTap - Animación del balón detenida por intercepción.`);
                 }

                 // --- USANDO FORMA DE ACTUALIZACIÓN FUNCIONAL ---
                 setSuccessfulInterceptions(prevInterceptions => {
                     const nextInterceptions = prevInterceptions + 1;
                     console.log(`DesafioDefensaScreen (${gameId}): setSuccessfulInterceptions (funcional) - prevInterceptions: ${prevInterceptions}, nextInterceptions: ${nextInterceptions}`);

                     // Verifica si se completó el desafío DENTRO de esta actualización funcional
                     if (nextInterceptions >= INTERCEPTIONS_REQUERIDAS) {
                         console.log(`DesafioDefensaScreen (${gameId}): ¡Desafío de defensa completado con ${nextInterceptions} intercepciones! (Dentro de setSuccessfulInterceptions)`);

                         // --- Otorgar Recompensas ---
                         if (typeof addCoins === 'function') {
                             addCoins(RECOMPENSA_MONEDAS);
                             console.log(`DesafioDefensaScreen (${gameId}): ${RECOMPENSA_MONEDAS} monedas añadidas.`);
                         } else {
                             console.error('DesafioDefensaScreen: Error de Configuración: addCoins no es una función en el contexto.');
                         }

                         // --- Actualiza el progreso del Evento Beta (marcar como completado UNA VEZ) ---
                         if (typeof updateBetaGameProgress === 'function') {
                              console.log(`DesafioDefensaScreen (${gameId}): Llamando a updateBetaGameProgress(${gameId})...`);
                              updateBetaGameProgress(gameId); // Llama con el gameId correcto ('beta_defensa')
                              console.log(`DesafioDefensaScreen (${gameId}): updateBetaGameProgress llamado.`);
                          } else {
                              console.error('DesafioDefensaScreen: Error de Configuración: updateBetaGameProgress no es una función en el contexto.');
                         }

                         // Muestra la alerta final y navega de regreso
                         Alert.alert('¡Desafío completado!', `¡Felicidades! Ganaste ${RECOMPENSA_MONEDAS} monedas.`, [
                             { text: 'Volver', onPress: () => navigation.navigate('BienvenidaBetaScreen') },
                         ]);
                          console.log(`DesafioDefensaScreen (${gameId}): Alerta de completado mostrada. Navegando al presionar Volver.`);

                         setGameInProgress(false); // Marca el juego como no en progreso
                         console.log(`DesafioDefensaScreen (${gameId}): setGameInProgress a false (Desafío completado)`);

                     } else {
                         // Si aún no se completan las intercepciones requeridas, programa el siguiente pase
                          console.log(`DesafioDefensaScreen (${gameId}): handleTap - Intercepción exitosa pero desafío no completado. Programando siguiente pase.`);
                          setTimeout(() => startNewPass(), 1000); // Espera un poco antes del siguiente pase
                     }
                     return nextInterceptions; // Retorna el nuevo valor del estado
                 });
                 // --- FIN FORMA DE ACTUALIZACIÓN FUNCIONAL ---

            } else {
                // El balón ya llegó al objetivo o está demasiado cerca, pase fallido
                console.log(`DesafioDefensaScreen (${gameId}): handleTap - Toque correcto pero balón ya llegó (Distancia: ${distance.toFixed(0)} <= Umbral: ${arrivalThreshold.toFixed(0)}). Pase fallido.`);
                handlePassFailed(); // Llama a la lógica de pase fallido
            }

        } else {
            // Toque en el objetivo incorrecto, pase fallido
            console.log(`DesafioDefensaScreen (${gameId}): handleTap - Toque en objetivo incorrecto (${tappedTargetIndex}). Pase fallido.`);
            handlePassFailed(); // Llama a la lógica de pase fallido
        }

        // Reinicia el resultado visual después de un breve momento
        setTimeout(() => setPassResult(null), 500); // Muestra el resultado por 500ms

    }, [gameInProgress, currentPassTargetIndex, ballPosition, gameId, addCoins, updateBetaGameProgress, startNewPass, handlePassFailed, INTERCEPTIONS_REQUERIDAS, RECOMPENSA_MONEDAS, BALL_SIZE, TARGET_SIZE]); // Dependencias actualizadas


     // --- useEffect para iniciar el juego al cargar la pantalla (sin cooldown) ---
     useEffect(() => {
         console.log(`DesafioDefensaScreen (${gameId}): useEffect - Iniciando juego directamente (sin cooldown).`);
         setGameInProgress(true); // Marca el juego como en progreso
         console.log(`DesafioDefensaScreen (${gameId}): useEffect - Estado local gameInProgress actualizado a: true.`);

         // Iniciar el primer pase después de que gameInProgress se haya establecido
         const timer = setTimeout(() => {
             startNewPass();
             console.log(`DesafioDefensaScreen (${gameId}): useEffect - Primer pase iniciado después de timeout.`);
         }, 100); // Pequeño retraso para asegurar que el estado se actualizó


        // Limpieza del efecto: Detiene la animación si la pantalla se desmonta
        return () => {
             console.log(`DesafioDefensaScreen (${gameId}): useEffect - Limpieza (desmontando).`);
             if (ballAnimationRef.current) {
                 ballAnimationRef.current.stop();
             }
             clearTimeout(timer); // Limpiar el timer si el componente se desmonta antes
        };

     }, [gameId, startNewPass]); // Depende de gameId y startNewPass


    // --- useFocusEffect para manejar la salida de la pantalla ---
    useFocusEffect(
        useCallback(() => {
            // console.log(`DesafioDefensaScreen (${gameId}) GANÓ foco.`);
            return () => {
                // console.log(`DesafioDefensaScreen (${gameId}) PERDIÓ foco.`);
                 if (ballAnimationRef.current) {
                     ballAnimationRef.current.stop();
                 }
                 setGameInProgress(false); // Marca el juego como no en progreso al salir
            };
        }, [gameId, successfulInterceptions, updateBetaGameProgress]) // Dependencias relevantes
    );


    // --- Renderizado ---
    // Eliminado: Renderizado condicional basado en cooldown

    // Si el juego está en progreso o no, siempre mostramos la pantalla principal del desafío
     console.log(`DesafioDefensaScreen (${gameId}): Renderizando pantalla de desafío.`);
     console.log(`DesafioDefensaScreen (${gameId}): Estado actual al renderizar: gameInProgress=${gameInProgress}, successfulInterceptions=${successfulInterceptions}`);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Desafío de Defensa</Text>

            {/* Área de juego */}
            <View style={styles.gameArea}>
                 {/* Imagen de fondo del campo */}
                 <Image
                     source={{ uri: FIELD_BACKGROUND_URL }}
                     style={styles.gameAreaBackground}
                     resizeMode="cover" // Cubre el área sin distorsionar demasiado
                     onError={(e) => console.error('DesafioDefensaScreen: Error cargando imagen de fondo:', e.nativeEvent.error)}
                 />

                 {/* Texto de reglas */}
                 <Text style={styles.rulesText}>
                     ¡Intercepta los pases tocando la zona azul correcta antes de que llegue el balón!
                     Consigue {INTERCEPTIONS_REQUERIDAS} intercepciones.
                 </Text>

                 {/* Zonas de pase (objetivos) */}
                 {gameInProgress && TARGET_POSITIONS.map((pos, index) => (
                     <TouchableOpacity
                         key={index}
                         style={[
                             styles.targetArea,
                             { left: pos.x, top: pos.y, width: TARGET_SIZE, height: TARGET_SIZE, borderRadius: TARGET_SIZE / 2 },
                         ]}
                         onPress={() => handleTap(index)} // Llama a handleTap con el índice del objetivo
                         disabled={!gameInProgress} // Deshabilita los toques si el juego no está en progreso
                     >
                         {/* Puedes añadir un icono o texto a la zona si quieres */}
                         {/* <Text style={styles.targetText}>{index + 1}</Text> */}
                     </TouchableOpacity>
                 ))}

                 {/* Balón animado */}
                 {gameInProgress && ( // Solo renderizar si el juego está en progreso
                     <Animated.View style={[styles.ball, ballPosition.getLayout(), { width: BALL_SIZE, height: BALL_SIZE }]}>
                          <Image
                              source={{ uri: BALL_IMAGE_URL }}
                              style={styles.ballImage}
                              resizeMode="contain"
                              onError={(e) => console.error('DesafioDefensaScreen: Error cargando imagen del balón:', e.nativeEvent.error)}
                          />
                     </Animated.View>
                 )}

            </View>

            {/* Muestra el progreso de intercepciones exitosas */}
            <Text style={styles.progressText}>Intercepciones Exitosas: {successfulInterceptions} / {INTERCEPTIONS_REQUERIDAS}</Text>

            {/* Indicador visual del resultado del pase (Opcional) */}
            {passResult === 'intercepted' && <Text style={styles.resultTextSuccess}>¡INTERCEPTADO!</Text>}
            {passResult === 'failed' && <Text style={styles.resultTextFail}>¡PASE COMPLETO!</Text>}

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
        justifyContent: 'flex-start', // Alinea arriba para dejar espacio al área de juego
        padding: 20,
    },
    title: {
        fontSize: 30,
        color: 'white',
        marginBottom: 10, // Menos margen inferior
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    rulesText: { // Estilo para el texto de las reglas
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 15, // Espacio debajo de las reglas
        paddingHorizontal: 10,
    },
    cooldown: { // Mantener estilo por si acaso, aunque no se usa en el render principal
        color: '#FFD700', // Dorado
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    gameArea: {
        width: GAME_AREA_WIDTH,
        height: GAME_AREA_HEIGHT,
        // backgroundColor: 'rgba(255, 255, 255, 0.1)', // Eliminado fondo semitransparente
        marginVertical: 20,
        position: 'relative', // Necesario para posicionar elementos absolutos dentro
        overflow: 'hidden', // Oculta elementos que salgan del área
        borderRadius: 10, // Bordes redondeados para el área de juego
        borderWidth: 2, // Borde para el área de juego
        borderColor: '#fff', // Color del borde
    },
    gameAreaBackground: { // Estilo para la imagen de fondo del área de juego
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Asegura que esté detrás de los otros elementos
    },
    targetArea: { // Estilo para las zonas de toque (objetivos)
        position: 'absolute',
        // Tamaño y borderRadius se establecen inline para usar TARGET_SIZE
        backgroundColor: 'rgba(0, 123, 255, 0.7)', // Azul semitransparente (más opaco)
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    targetText: { // Estilo opcional para texto dentro de la zona
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ball: {
        position: 'absolute', // Permite moverlo con animación
        // Tamaño se establece inline para usar BALL_SIZE
    },
     ballImage: {
         width: '100%',
         height: '100%',
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
        fontSize: 20, // Tamaño ligeramente más grande
        color: 'white',
        marginTop: 15, // Espacio arriba
        marginBottom: 10, // Espacio abajo
        fontWeight: 'bold',
    },
    resultTextSuccess: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853', // Verde brillante
        marginTop: 10,
    },
    resultTextFail: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5252', // Rojo
        marginTop: 10,
    },
});

export default DesafioDefensaScreen;


