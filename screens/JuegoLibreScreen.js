import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing, Image, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BETA_MINIGAMES } from '../utils/constants'; // <--- VERIFICA ESTA RUTA CAREFULLY!
// Importa el GameContext y los IDs de minijuegos
import { GameContext, } from '../context/GameContext';

// ***************************************************************************
// ** NOTA IMPORTANTE: Este código ASUME que tu GameContext proporciona: **
// ** - addCoins (función para añadir monedas)                           **
// ** - updateBetaGameProgress (función para actualizar progreso Beta)    **
// ** - isCooldownActive (función asíncrona para chequear si un juego está en cooldown) **
// ** - setCooldown (función asíncrona para establecer cooldown a un juego) **
// ***************************************************************************
// ** Ajuste: Barra de timing de potencia ahora es VERTICAL.             **
// ** Ajuste: La condición de éxito requiere acertar la zona objetivo    **
// ** horizontal Y el timing en la barra vertical.               **
// ** Ajuste: Implementada lógica de "pasado" (completado) con cooldown  **
// ** y actualización de progreso Beta (como un desafío).        **
// ** Ajuste: Se requieren 5 aciertos (timing + posición) para "Pasar" el juego. **
// ** Ajuste: Si se falla un tiro, el contador de aciertos se reinicia a 0. **
// ** Ajuste: Mensajes de alerta actualizados.                         **
// ** CAMBIO: Las animaciones NO se detienen al disparar, solo al completar el juego. **
// ** DEBUG: Añadidos logs MUY detallados en handleShoot para depurar la detección de aciertos. **
// ** AJUSTE CLAVE: Modificada la lectura del valor de la animación en handleShoot para mayor precisión. **
// ** AJUSTE: Aumentado el tamaño de la zona perfecta VERTICAL y la zona objetivo HORIZONTAL. **
// ***************************************************************************

// --- Constantes del Juego ---
// Usamos el ID string correcto del minijuego de juego libre definido en BETA_MINIGAMES
const GAME_ID_STRING = BETA_MINIGAMES.GAME5; // Debería ser 'beta_libre'
const HITS_REQUIRED_FOR_PASS = 5; // Número de aciertos (timing + posición) necesarios para "Pasar" el juego (Cambiado a 5)
const COMPLETIONS_REQUIRED = 1; // Número de veces que se debe "pasar" el juego (1 para completarlo una vez, como antes)
const RECOMPENSA_MONEDAS = 15; // Monedas que se otorgan al completar (por pasar el juego, no por cada acierto)

// Configuración de la pantalla y elementos
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Configuración del área de tiro y el arco
const GOAL_WIDTH = SCREEN_WIDTH * 0.7; // Ancho visual del arco
const GOAL_HEIGHT = GOAL_WIDTH * 0.7; // Altura visual del arco (proporcional)

// Configuración de la barra de potencia de timing (VERTICAL)
const VERTICAL_POWER_BAR_HEIGHT = SCREEN_HEIGHT * 0.3; // Altura de la barra de potencia vertical
const VERTICAL_POWER_BAR_WIDTH = 20; // Ancho de la barra de potencia vertical
const VERTICAL_MARKER_SIZE = 25; // Tamaño del indicador que se mueve en la barra

// Configuración de la zona objetivo en el arco (HORIZONTAL)
// AUMENTADO: Ancho de la zona objetivo en el arco (antes 20%)
const TARGET_ZONE_WIDTH = GOAL_WIDTH * 0.3; // Ahora 30% del ancho del arco
const TARGET_ZONE_HEIGHT = GOAL_HEIGHT * 0.2; // Altura de la zona objetivo en el arco
const TARGET_ZONE_ANIMATION_DURATION = 4000; // Duración del movimiento de la zona objetivo (ida y vuelta)
const TARGET_ZONE_VERTICAL_POSITION = GOAL_HEIGHT * 0.3; // Posición vertical de la zona objetivo en el arco

// Velocidad de la animación de la barra de potencia (más rápida = más difícil)
const POWER_ANIMATION_DURATION = 1200; // Duración de la animación de ida y vuelta en milisegundos (más rápida que en DesafioTiros)
// AUMENTADO: Altura de la zona "perfecta" en la barra de potencia vertical (antes 30)
const POWER_SWEET_SPOT_HEIGHT = 50; // Aumentado a 50

// URLs de las imágenes
const FIELD_BACKGROUND_URL = 'https://media.istockphoto.com/id/1368903700/es/foto/fondo-de-textura-de-campo-de-f%C3%BAtbol-o-f%C3%Bútbol-vista-top.jpg?s=612x612&w=0&k=20&c=w1-T69l2i97b698Ylq2u7i1h0k8L0c3Gv1bL0i7b7gY='; // Imagen de fondo de campo
const GOAL_IMAGE_URL = 'https://media.istockphoto.com/id/508552766/es/foto/poste-de-porter%C3%ADa.jpg?s=612x612&w=0&k=20&c=n4RVMXHBhbflThK9GBaCxHNgqJ419nG6H1gu1DAdzFg='; // Imagen de la portería
const BALL_IMAGE_URL = 'https://static.vecteezy.com/system/resources/previews/011/421/474/non_2x/soccer-ball-realistic-png.png'; // Imagen del balón


const JuegoLibreScreen = ({ route }) => {
    const navigation = useNavigation();
    // Obtener funciones y estado necesarios del GameContext
    const {
        addCoins,
        updateBetaGameProgress,
        isCooldownActive,
        setCooldown,
        // Puedes obtener otros estados o funciones del contexto si los necesitas aquí
    } = useContext(GameContext);

    // Obtén el gameId pasado como parámetro de navegación (debería ser 'beta_libre')
    // Usamos un valor por defecto para debug si no se pasa el parámetro
    const { gameId = 'VALOR_NO_RECIBIDO' } = route.params || {};

    // --- Logs de Depuración Cruciales (al inicio del componente) ---
    console.log("--- JuegoLibreScreen: Renderizando (Inicio del componente) ---");
    console.log("--- JuegoLibreScreen: gameId recibido:", gameId);
    console.log("--- JuegoLibreScreen: GAME_ID_STRING esperado:", GAME_ID_STRING);
    console.log("--- JuegoLibreScreen: Comparación gameId === GAME_ID_STRING:", gameId === GAME_ID_STRING);
    // --- Fin Logs de Depuración Cruciales ---

    // --- Verificación Crucial: Asegúrate de que el gameId es el esperado ---
    if (gameId !== GAME_ID_STRING) {
        console.error(`Error Crítico: JuegoLibreScreen recibió gameId incorrecto: ${gameId}. Se esperaba ${GAME_ID_STRING}.`);
        Alert.alert("Error", "ID de desafío incorrecto.");
         // Navega de regreso automáticamente después de mostrar la alerta
         useEffect(() => {
             const timer = setTimeout(() => {
                 navigation.navigate('BienvenidaBetaScreen');
             }, 2000); // Espera 2 segundos antes de navegar

             return () => clearTimeout(timer); // Limpia el temporizador si la pantalla se desmonta antes
         }, [navigation]); // Depende de navigation

        return (
             <View style={styles.container}>
                 <Text style={styles.title}>Error</Text>
                 <Text style={styles.text}>ID de desafío incorrecto.</Text>
                 {/* No mostramos botón "Volver" aquí porque navega automáticamente */}
             </View>
         );
    }
    // --- Fin Verificación gameId ---


    const [currentHits, setCurrentHits] = useState(0); // Contador de aciertos en el intento actual
    const [completions, setCompletions] = useState(0); // Contador de veces que se ha "pasado" el juego (completado 5 aciertos)
    // Inicializa en true. El useEffect lo pondrá en false si no hay cooldown.
    const [cooldownActive, setCooldownActive] = useState(true);
    // Inicializa en false. El useEffect lo pondrá en true si no hay cooldown y el juego inicia.
    const [gameInProgress, setGameInProgress] = useState(false);
    const [shotResult, setShotResult] = useState(null); // 'success', 'fail', null

    // Animación para la barra de potencia (VERTICAL)
    const powerAnimationValue = useRef(new Animated.Value(0)).current; // Valor de animación (0 a 1)
    const powerAnimationRef = useRef(null); // Referencia para controlar la animación de potencia

    // Animación para la posición horizontal de la zona objetivo en el arco
    const targetAnimationValue = useRef(new Animated.Value(0)).current; // Valor de animación (0 a 1) para el objetivo
    const targetAnimationRef = useRef(null); // Referencia para controlar la animación del objetivo


    // --- Lógica de Animación de la Barra de Potencia (VERTICAL) ---
    const startPowerAnimation = useCallback(() => {
        // Detiene la animación actual antes de iniciar una nueva (importante para evitar múltiples animaciones corriendo)
        if (powerAnimationRef.current) {
             powerAnimationRef.current.stop();
             console.log("JuegoLibreScreen: startPowerAnimation - Deteniendo animación de potencia previa.");
        }
        powerAnimationValue.setValue(0); // Reinicia la animación al principio
        powerAnimationRef.current = Animated.loop( // Crea una animación en bucle
            Animated.sequence([ // Secuencia de animaciones (ida y vuelta)
                Animated.timing(powerAnimationValue, {
                    toValue: 1, // Mueve hasta el final (representa el 100%)
                    duration: POWER_ANIMATION_DURATION / 2, // La mitad de la duración total para ir
                    easing: Easing.linear, // Velocidad constante
                    useNativeDriver: false,
                }),
                Animated.timing(powerAnimationValue, {
                    toValue: 0, // Mueve de regreso al principio
                    duration: POWER_ANIMATION_DURATION / 2, // La mitad de la duración total para volver
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        );
        powerAnimationRef.current.start(); // Inicia la animación
         console.log("JuegoLibreScreen: startPowerAnimation - Animación de potencia iniciada.");
    }, [powerAnimationValue]); // Dependencias

    // --- Lógica de Animación de la Zona Objetivo en el Arco (HORIZONTAL) ---
    const startTargetAnimation = useCallback(() => {
         // Detiene la animación actual antes de iniciar una nueva
         if (targetAnimationRef.current) {
             targetAnimationRef.current.stop();
             console.log("JuegoLibreScreen: startTargetAnimation - Deteniendo animación del objetivo previa.");
         }
        targetAnimationValue.setValue(0); // Reinicia la animación al principio
        targetAnimationRef.current = Animated.loop( // Crea una animación en bucle
            Animated.sequence([ // Secuencia de animaciones (de un lado a otro del arco)
                Animated.timing(targetAnimationValue, {
                    toValue: 1, // Mueve hasta el final (representa el lado derecho del arco)
                    duration: TARGET_ZONE_ANIMATION_DURATION / 2,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(targetAnimationValue, {
                    toValue: 0, // Mueve de regreso al principio (lado izquierdo del arco)
                    duration: TARGET_ZONE_ANIMATION_DURATION / 2,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        );
        targetAnimationRef.current.start(); // Inicia la animación
         console.log("JuegoLibreScreen: startTargetAnimation - Animación del objetivo iniciada.");
    }, [targetAnimationValue]); // Dependencias


    // --- useEffect para chequear Cooldown al cargar la pantalla ---
    // Se ejecuta UNA VEZ al montar la pantalla (si gameId e isCooldownActive son válidos)
    useEffect(() => {
         console.log(`JuegoLibreScreen (${gameId}): useEffect - Iniciando chequeo de cooldown.`);
         console.log(`JuegoLibreScreen (${gameId}): useEffect - gameId: ${gameId}, isCooldownActive typeof: ${typeof isCooldownActive}.`);

        if (typeof isCooldownActive === 'function') {
             const checkCooldownStatus = async () => {
                 try {
                     console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - Llamando a isCooldownActive(${gameId})...`);
                     const active = await isCooldownActive(gameId);
                     console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - isCooldownActive retornó: ${active}.`);

                     setCooldownActive(active); // Actualiza el estado local de cooldown

                     console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - Estado local cooldownActive actualizado a: ${active}.`);

                     // Si no está en cooldown, inicia el juego
                     if (!active) {
                         console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - No hay cooldown, iniciando juego.`);
                         setGameInProgress(true); // Marca el juego como en progreso
                         console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - Estado local gameInProgress actualizado a: true.`);
                         startPowerAnimation(); // Inicia la animación de potencia
                         startTargetAnimation(); // Inicia la animación del objetivo
                         console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - Animaciones iniciadas.`);
                     } else {
                         console.log(`JuegoLibreScreen (${gameId}): checkCooldownStatus - Cooldown activo, juego no iniciado.`);
                     }
                 } catch (e) {
                     console.error(`JuegoLibreScreen (${gameId}): checkCooldownStatus - Error al chequear cooldown:`, e);
                      Alert.alert("Error de Carga", "No se pudo verificar el estado del desafío.");
                      // Si hay un error al chequear, asumimos cooldown activo para evitar jugar
                      setCooldownActive(true);
                      setGameInProgress(false); // Asegurarse de que el juego no inicie en caso de error
                 }
             };
             checkCooldownStatus();
        } else {
            console.error('JuegoLibreScreen: useEffect - Error de Configuración: isCooldownActive no es una función en el contexto.');
             Alert.alert("Error", "El juego no está configurado correctamente (función de cooldown falta).");
             setCooldownActive(true); // Deshabilita el desafío si no se puede chequear cooldown
             setGameInProgress(false); // Asegurarse de que el juego no inicie
        }

        // Limpieza del efecto: Detiene las animaciones si la pantalla se desmonta
        return () => {
             console.log(`JuegoLibreScreen (${gameId}): useEffect - Limpieza (desmontando).`);
             if (powerAnimationRef.current) {
                 powerAnimationRef.current.stop();
             }
             if (targetAnimationRef.current) {
                 targetAnimationRef.current.stop();
             }
        };

    }, [gameId, isCooldownActive, setCooldown, startPowerAnimation, startTargetAnimation]); // Dependencias


    // --- useFocusEffect para manejar la salida de la pantalla ---
    useFocusEffect(
        useCallback(() => {
            // console.log(`JuegoLibreScreen (${gameId}) GANÓ foco.`);
            return () => {
                // console.log(`JuegoLibreScreen (${gameId}) PERDIÓ foco.`);
                // Lógica al salir/perder foco: Detener el juego y los contadores
                 if (powerAnimationRef.current) {
                     powerAnimationRef.current.stop();
                 }
                 if (targetAnimationRef.current) {
                     targetAnimationRef.current.stop();
                 }
                 setGameInProgress(false); // Marca el juego como no en progreso al salir
                 setCurrentHits(0); // Reinicia los aciertos al salir
                 // No reiniciamos completions aquí, ya que representan el progreso total del desafío
            };
        }, [gameId, completions, updateBetaGameProgress]) // Dependencias relevantes
    );


    // --- Handler para el botón de Disparar ---
    const handleShoot = async () => {
        console.log("JuegoLibreScreen: handleShoot - Botón '¡Disparar!' presionado."); // Log al inicio del handler
        console.log(`JuegoLibreScreen: handleShoot - gameInProgress: ${gameInProgress}, cooldownActive: ${cooldownActive}, completions: ${completions}, COMPLETIONS_REQUIRED: ${COMPLETIONS_REQUIRED}, currentHits: ${currentHits}, HITS_REQUIRED_FOR_PASS: ${HITS_REQUIRED_FOR_PASS}`); // Log estados

        // No permitir disparar si el juego no está en progreso o está en cooldown o ya completado
        if (!gameInProgress || cooldownActive || completions >= COMPLETIONS_REQUIRED) {
            console.log("JuegoLibreScreen: handleShoot - Intento de disparo ignorado (juego no en progreso, cooldown, o completado)");
             if (cooldownActive) {
                 Alert.alert('En Cooldown', 'Ya jugaste este desafío. Vuelve en 24 horas.');
             } else if (completions >= COMPLETIONS_REQUIRED) {
                 // Esto no debería pasar si el botón se deshabilita correctamente
                 Alert.alert('Completado', 'Ya completaste este desafío.');
             } else if (!gameInProgress) {
                 // Si gameInProgress es false, puede ser que el useEffect no terminó o falló
                 console.warn("JuegoLibreScreen: Intento de disparo con gameInProgress=false. Verifique useEffect inicial.");
                 Alert.alert('Juego No Iniciado', 'El desafío aún no ha iniciado correctamente. Inténtalo de nuevo.');
             }
            return;
        }

        // *** NO DETENEMOS LAS ANIMACIONES AQUÍ (Continúan moviéndose) ***
        console.log("JuegoLibreScreen: handleShoot - No deteniendo animaciones. Leyendo valores actuales...");

        // Obtiene el valor actual de la animación de potencia (entre 0 y 1)
        // *** AJUSTE CLAVE: Usar _value para intentar obtener el valor más preciso en el momento del tap ***
        const powerProgress = powerAnimationValue._value;
        console.log(`JuegoLibreScreen DEBUG: powerProgress (Vertical): ${powerProgress.toFixed(4)}`); // Debug log

        // Calcula la posición VERTICAL del marcador en la barra de potencia (0 a VERTICAL_POWER_BAR_HEIGHT)
        const markerPositionY = powerProgress * VERTICAL_POWER_BAR_HEIGHT;
         console.log(`JuegoLibreScreen DEBUG: markerPositionY (Vertical): ${markerPositionY.toFixed(4)}`); // Debug log


        // Calcula los límites de la zona "perfecta" en la barra de potencia (VERTICAL)
        const sweetSpotTop = (VERTICAL_POWER_BAR_HEIGHT / 2) - (POWER_SWEET_SPOT_HEIGHT / 2);
        const sweetSpotBottom = (VERTICAL_POWER_BAR_HEIGHT / 2) + (POWER_SWEET_SPOT_HEIGHT / 2);
        console.log(`JuegoLibreScreen DEBUG: Zona perfecta Y (Vertical): ${sweetSpotTop.toFixed(4)} - ${sweetSpotBottom.toFixed(4)}`); // Debug log


        // Verifica si el marcador está en la zona perfecta de la barra de potencia (VERTICAL)
        const isPerfectTiming = markerPositionY >= sweetSpotTop && markerPositionY <= sweetSpotBottom;
        console.log(`JuegoLibreScreen DEBUG: Timing perfecto (Vertical): ${isPerfectTiming}`); // Debug log


        // Obtiene el valor actual de la animación del objetivo (entre 0 a 1)
         // *** AJUSTE CLAVE: Usar _value para intentar obtener el valor más preciso en el momento del tap ***
        const targetProgress = targetAnimationValue._value;
        console.log(`JuegoLibreScreen DEBUG: targetProgress (Horizontal): ${targetProgress.toFixed(4)}`); // Debug log


        // Calcula la posición HORIZONTAL actual de la zona objetivo en el arco
        // Se mueve desde 0 hasta (GOAL_WIDTH - TARGET_ZONE_WIDTH)
        const currentTargetX = targetProgress * (GOAL_WIDTH - TARGET_ZONE_WIDTH);
        console.log(`JuegoLibreScreen DEBUG: currentTargetX (Horizontal): ${currentTargetX.toFixed(4)}`); // Debug log


        console.log("JuegoLibreScreen: handleShoot - Posiciones calculadas.");

        console.log(`JuegoLibreScreen: handleShoot - Disparo - Potencia (Vertical): ${markerPositionY.toFixed(2)}. Zona perfecta Y: ${sweetSpotTop.toFixed(2)} - ${sweetSpotBottom.toFixed(2)}. Timing perfecto: ${isPerfectTiming}`);
        console.log(`JuegoLibreScreen: handleShoot - Disparo - Objetivo (Horizontal): Posición X en arco: ${currentTargetX.toFixed(2)}. Ancho objetivo: ${TARGET_ZONE_WIDTH}`);


        console.log("JuegoLibreScreen: handleShoot - Verificando resultado del disparo...");
        // --- Lógica de resultado del disparo (Requiere Timing Vertical Y Posición Horizontal) ---

        // Para que sea un "acierto" (hit), el timing VERTICAL debe ser perfecto Y la posición HORIZONTAL del objetivo
        // debe estar dentro de una zona aceptable (simplificamos: si el timing es perfecto,
        // consideramos que la pelota va hacia el centro horizontal del arco).
        // Luego, verificamos si la zona objetivo horizontal actual se superpone con el centro del arco.

        // Posición horizontal "ideal" donde iría la pelota si el timing es perfecto (centro del arco)
        const idealBallHorizontalCenter = (GOAL_WIDTH / 2);
        console.log(`JuegoLibreScreen DEBUG: idealBallHorizontalCenter (Horizontal): ${idealBallHorizontalCenter.toFixed(4)}`); // Debug log


        // Calcula los límites de la zona objetivo horizontal
        const targetZoneLeft = currentTargetX;
        const targetZoneRight = currentTargetX + TARGET_ZONE_WIDTH;
         console.log(`JuegoLibreScreen DEBUG: Zona objetivo X (Horizontal): ${targetZoneLeft.toFixed(4)} - ${targetZoneRight.toFixed(4)}`); // Debug log

         // Verifica si el centro ideal de la pelota cae dentro de la zona objetivo horizontal
         const isHorizontalHit = idealBallHorizontalCenter >= targetZoneLeft && idealBallHorizontalCenter <= targetZoneRight;
         console.log(`JuegoLibreScreen DEBUG: Acierto Horizontal (Centro de pelota dentro de zona objetivo): ${isHorizontalHit}`); // Debug log


        // Es un "acierto" (hit) si el timing VERTICAL es perfecto Y hay un acierto HORIZONTAL
        const isHit = isPerfectTiming && isHorizontalHit;
        console.log(`JuegoLibreScreen DEBUG: Resultado Final (isHit): ${isHit}`); // Debug log crucial


        // --- Lógica al acertar o fallar ---
        if (isHit) {
            console.log("JuegoLibreScreen: handleShoot - ¡Acierto!");
            setShotResult('success'); // Usamos 'success' para indicar acierto visualmente
            const nextHits = currentHits + 1;
            setCurrentHits(nextHits); // Incrementa el contador de aciertos en el intento actual
             console.log(`JuegoLibreScreen: handleShoot - Aciertos actuales: ${nextHits}.`);


            // Verifica si se alcanzaron los aciertos requeridos para "Pasar" el juego
            if (nextHits >= HITS_REQUIRED_FOR_PASS) {
                console.log(`JuegoLibreScreen (${gameId}): ¡Juego PASADO (Completado) con ${nextHits} aciertos!`);

                // --- Detiene las animaciones y el juego ---
                 if (powerAnimationRef.current) {
                     powerAnimationRef.current.stop();
                     console.log("JuegoLibreScreen: handleShoot - Animación de potencia detenida (Juego Completado).");
                 }
                 if (targetAnimationRef.current) {
                     targetAnimationRef.current.stop();
                     console.log("JuegoLibreScreen: handleShoot - Animación del objetivo detenida (Juego Completado).");
                 }
                 setGameInProgress(false);
                 console.log(`JuegoLibreScreen (${gameId}): gameInProgress actualizado a: false.`);


                // --- Otorgar Recompensas y Establecer Cooldown ---
                // (Mantener la lógica existente para añadir monedas, setCooldown, updateBetaGameProgress)
                 if (typeof addCoins === 'function') {
                     addCoins(RECOMPENSA_MONEDAS);
                     console.log(`JuegoLibreScreen (${gameId}): ${RECOMPENSA_MONEDAS} monedas añadidas.`);
                 } else {
                     console.error('JuegoLibreScreen: Error de Configuración: addCoins no es una función en el contexto.');
                 }

                 if (typeof setCooldown === 'function') {
                      try {
                         console.log(`JuegoLibreScreen (${gameId}): Llamando a setCooldown(${gameId})...`);
                         await setCooldown(gameId);
                         setCooldownActive(true);
                         console.log(`JuegoLibreScreen (${gameId}): Cooldown establecido.`);
                      } catch (e) {
                         console.error(`JuegoLibreScreen (${gameId}): Error al establecer cooldown:`, e);
                         Alert.alert("Error", "No se pudo guardar el estado de completado.");
                      }
                 } else {
                      console.error('JuegoLibreScreen: Error de Configuración: setCooldown no es una función en el contexto.');
                 }

                 if (typeof updateBetaGameProgress === 'function') {
                      console.log(`JuegoLibreScreen (${gameId}): Llamando a updateBetaGameProgress(${gameId})...`);
                      updateBetaGameProgress(gameId);
                      console.log(`JuegoLibreScreen (${gameId}): updateBetaGameProgress llamado.`);
                  } else {
                      console.error('JuegoLibreScreen: Error de Configuración: updateBetaGameProgress no es una función en el contexto.');
                 }

                // 4. Muestra la alerta final y navega de regreso
                Alert.alert('¡Juego Completado!', `¡Felicidades! Pasaste el juego libre y ganaste ${RECOMPENSA_MONEDAS} monedas.`, [
                    { text: 'Volver', onPress: () => navigation.navigate('BienvenidaBetaScreen') },
                ]);
                 console.log(`JuegoLibreScreen (${gameId}): Alerta de completado mostrada. Navegando al presionar Volver.`);


            } else {
                // Si se acertó pero aún no se alcanzan los 5 aciertos, solo muestra el mensaje intermedio
                 Alert.alert('¡Acierto!', `¡Buen tiro! Llevas ${nextHits} / ${HITS_REQUIRED_FOR_PASS} aciertos.`);
                 // Animaciones continúan automáticamente
                 console.log(`JuegoLibreScreen (${gameId}): Acierto intermedio. Animaciones continúan.`);
            }

        } else {
            // Intento fallido (no acertó timing O posición)
            console.log(`JuegoLibreScreen (${gameId}): Intento fallido.`);
            setShotResult('fail');
            // Reinicia el contador de aciertos en el intento actual al fallar
            setCurrentHits(0);
            console.log(`JuegoLibreScreen (${gameId}): Aciertos actuales reiniciados a 0.`);

            Alert.alert('¡Fallaste!', `Has fallado. Tu progreso de aciertos se reinicia. Llevas 0 / ${HITS_REQUIRED_FOR_PASS} aciertos.`);
            // Animaciones continúan automáticamente
            console.log(`JuegoLibreScreen (${gameId}): Intento fallido. Animaciones continúan.`);
        }

        // Reinicia el resultado visual después de un breve momento
        setTimeout(() => setShotResult(null), 500);
         console.log("JuegoLibreScreen: handleShoot - Reinicio visual programado.");

         console.log("JuegoLibreScreen: handleShoot - Fin de la función."); // Log al final del handler

    };

    // Calcula la posición VERTICAL del marcador animado en la barra de potencia
    const animatedPowerMarkerStyle = {
        transform: [{
            translateY: powerAnimationValue.interpolate({ // Usamos translateY para movimiento vertical
                inputRange: [0, 1],
                outputRange: [0, VERTICAL_POWER_BAR_HEIGHT - VERTICAL_MARKER_SIZE], // Se mueve desde 0 hasta el final de la barra menos el tamaño del marcador
            }),
        }],
    };

    // Calcula la posición horizontal de la zona objetivo animada en el arco
    const animatedTargetZoneStyle = {
         // La animación controla la posición horizontal (left)
        left: targetAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, GOAL_WIDTH - TARGET_ZONE_WIDTH], // Se mueve desde el borde izquierdo hasta el borde derecho del arco
        }),
        top: TARGET_ZONE_VERTICAL_POSITION, // Posición vertical fija
        width: TARGET_ZONE_WIDTH,
        height: TARGET_ZONE_HEIGHT,
        position: 'absolute', // Posicionamiento absoluto dentro del área del arco
        backgroundColor: 'rgba(0, 255, 0, 0.5)', // Verde semitransparente para la zona objetivo
        borderRadius: 5, // Bordes ligeramente redondeados
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center', // Centrar texto/icono si añades algo dentro
        justifyContent: 'center', // Centrar texto/icono si añades algo dentro
    };


    // --- Renderizado condicional basado en cooldown ---

    // Si está en cooldown, muestra la pantalla de cooldown
    if (cooldownActive) {
        console.log(`JuegoLibreScreen (${gameId}): Renderizando pantalla de cooldown.`);
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Juego Libre: Tiros Libres</Text>
                <Text style={styles.cooldown}>Ya jugaste este desafío. Vuelve en 24 horas.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('BienvenidaBetaScreen')}>
                    <Text style={styles.backButtonText}>Volver</Text>
                 </TouchableOpacity>
            </View>
        );
    }

    // Si NO está en cooldown y el juego está en progreso, muestra la pantalla del desafío
     console.log(`JuegoLibreScreen (${gameId}): Renderizando pantalla de desafío.`);
     console.log(`JuegoLibreScreen (${gameId}): Estado actual: gameInProgress=${gameInProgress}, cooldownActive=${cooldownActive}, completions=${completions}, currentHits=${currentHits}`);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Juego Libre: Tiros Libres</Text>

            {/* Contador de Aciertos Actuales */}
            <Text style={styles.scoreText}>Aciertos: {currentHits} / {HITS_REQUIRED_FOR_PASS}</Text>
             {/* Contador de Completaciones (Veces que se ha "Pasado" el juego) */}
            <Text style={styles.completionsText}>Pasado: {completions} / {COMPLETIONS_REQUIRED}</Text>


            {/* Área del Arco y Zona Objetivo */}
            <View style={styles.goalArea}>
                 {/* Imagen de la portería como fondo */}
                 <Image
                     source={{ uri: GOAL_IMAGE_URL }}
                     style={styles.goalImage}
                     resizeMode="stretch" // Ajusta la imagen para llenar el área
                     onError={(e) => console.error('JuegoLibreScreen: Error cargando imagen de la portería:', e.nativeEvent.error)}
                 />
                 {/* Zona Objetivo Animada */}
                 {gameInProgress && completions < COMPLETIONS_REQUIRED && ( // Solo mostrar el objetivo si el juego está en progreso y no completado
                     <Animated.View style={animatedTargetZoneStyle}>
                         {/* Puedes añadir un icono o texto dentro de la zona objetivo si quieres */}
                         {/* <Text style={{color: 'white', fontWeight: 'bold'}}>🎯</Text> */}
                     </Animated.View>
                 )}
            </View>

            {/* Imagen de la Pelota */}
            <Image
                source={{ uri: BALL_IMAGE_URL }}
                style={styles.ballImage}
                resizeMode="contain"
                 onError={(e) => console.error('JuegoLibreScreen: Error cargando imagen del balón:', e.nativeEvent.error)}
            />

            {/* Área del juego de timing (VERTICAL) */}
            {gameInProgress && completions < COMPLETIONS_REQUIRED && ( // Solo mostrar la barra si el juego está en progreso y no completado
                <View style={styles.timingGameAreaVertical}> {/* Nuevo estilo para el área vertical */}
                     {/* Barra de fondo (VERTICAL) */}
                     <View style={styles.timingBarBackgroundVertical}> {/* Nuevo estilo para la barra vertical */}
                         {/* Zona "Perfecta" en la barra de potencia (VERTICAL) */}
                         <View style={[
                             styles.powerSweetSpotVertical, // Nuevo estilo para la zona perfecta vertical
                             { height: POWER_SWEET_SPOT_HEIGHT, marginTop: (VERTICAL_POWER_BAR_HEIGHT - POWER_SWEET_SPOT_HEIGHT) / 2 } // Centra la zona perfecta verticalmente
                         ]} />
                     </View>
                     {/* Marcador animado (VERTICAL) */}
                     <Animated.View style={[styles.markerVertical, animatedPowerMarkerStyle]} />
                </View>
            )}


            {/* Botón de Disparar */}
            <TouchableOpacity
                style={styles.shootButton}
                onPress={handleShoot}
                disabled={!gameInProgress || completions >= COMPLETIONS_REQUIRED} // Deshabilita si no está en progreso o ya completado
            >
                <Text style={styles.shootButtonText}>¡Disparar!</Text>
            </TouchableOpacity>

            {/* Indicador visual del resultado del disparo (Opcional) */}
            {shotResult === 'success' && <Text style={styles.resultTextSuccess}>¡ACIERTAS!</Text>} {/* Cambiado a "¡ACIERTAS!" */}
            {shotResult === 'fail' && <Text style={styles.resultTextFail}>¡FALLASTE!</Text>}

             {/* Botón para volver (siempre visible, pero deshabilitado si el juego está en progreso y no completado) */}
             <TouchableOpacity
                 style={[styles.backButton, gameInProgress && completions < COMPLETIONS_REQUIRED && styles.backButtonDisabled]}
                 onPress={() => navigation.navigate('BienvenidaBetaScreen')}
                 disabled={gameInProgress && completions < COMPLETIONS_REQUIRED} // Deshabilita si está en progreso y no completado
             >
                 <Text style={styles.backButtonText}>Volver</Text>
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
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    scoreText: { // Muestra los aciertos actuales
        fontSize: 24,
        color: 'white',
        marginBottom: 5, // Menos margen
        fontWeight: 'bold',
    },
     completionsText: { // Muestra las veces que se ha "Pasado" el juego
         fontSize: 18,
         color: 'white',
         marginBottom: 20, // Más margen
         fontWeight: 'bold',
     },
    cooldown: {
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
    goalImage: { // Estilo para la imagen de fondo de la portería
         position: 'absolute',
         top: 0,
         left: 0,
         width: '100%',
         height: '100%',
         zIndex: -1, // Asegura que esté detrás de otros elementos
    },
    ballImage: {
        width: 60, // Tamaño de la pelota
        height: 60,
        marginTop: 20, // Espacio debajo del arco
        marginBottom: 30, // Espacio arriba de la barra de timing
    },
    // --- NUEVOS ESTILOS PARA LA BARRA DE TIMING VERTICAL ---
    timingGameAreaVertical: {
        height: VERTICAL_POWER_BAR_HEIGHT,
        width: VERTICAL_MARKER_SIZE, // El ancho es igual al tamaño del marcador
        justifyContent: 'flex-start', // Alinea la barra arriba
        alignItems: 'center', // Centra horizontalmente la barra y el marcador
        marginBottom: 30, // Espacio debajo de la barra
        position: 'absolute', // Posicionar la barra verticalmente al lado
        right: 20, // Ajusta la posición horizontal según tu layout
        bottom: 100, // Ajusta la posición vertical según tu layout
    },
    timingBarBackgroundVertical: {
        height: VERTICAL_POWER_BAR_HEIGHT,
        width: 10, // Ancho de la barra visible
        backgroundColor: '#ddd', // Gris claro
        borderRadius: 5,
        overflow: 'hidden', // Esconde partes del marcador si se sale
        position: 'absolute', // Posiciona la barra de fondo
        left: (VERTICAL_MARKER_SIZE - 10) / 2, // Centra la barra visualmente dentro del área vertical
        flexDirection: 'column', // Para posicionar la zona perfecta verticalmente
    },
    powerSweetSpotVertical: {
        width: '100%', // El ancho de la zona perfecta es el de la barra
        backgroundColor: '#00C853', // Verde brillante
        // Posicionamiento vertical manejado inline
    },
    markerVertical: {
        width: VERTICAL_MARKER_SIZE,
        height: VERTICAL_MARKER_SIZE,
        backgroundColor: '#FF5252', // Rojo
        borderRadius: VERTICAL_MARKER_SIZE / 2, // Redondo
        position: 'absolute', // Permite moverlo con transform
        left: 0, // Alineado a la izquierda dentro del área vertical
        top: 0, // Empieza arriba
    },
    // --- FIN NUEVOS ESTILOS ---
    shootButton: {
        backgroundColor: '#FF9800', // Naranja vibrante
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        elevation: 5, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    shootButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    resultTextSuccess: { // Ahora indica "ACIERTAS"
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
    backButton: {
        backgroundColor: '#007bff', // Azul
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButtonDisabled: {
        backgroundColor: '#ccc', // Gris para deshabilitado
    },
});

export default JuegoLibreScreen;
