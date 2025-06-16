import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing, Image, Dimensions } from 'react-native'; // Added Dimensions
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

// --- Constantes del Juego ---
const GAME_ID_STRING = 'beta_tiros'; // El ID string de este minijuego en BETA_MINIGAMES
const TIROS_REQUERIDOS = 5; // <-- Número de tiros exitosos necesarios para completar el desafío
const RECOMPENSA_MONEDAS = 10; // Monedas que se otorgan al completar

// Configuración de la barra de timing
const BAR_WIDTH = 250; // Ancho visual de la barra
const TARGET_ZONE_WIDTH = 50; // Ancho de la zona objetivo
const MARKER_SIZE = 20; // Tamaño del indicador que se mueve
const BASE_ANIMATION_DURATION = 2000; // Duración base de la animación (más lento)
const MIN_ANIMATION_DURATION = 800; // Duración mínima de la animación (más rápido)

// URLs de las imágenes (Nota: Usar URLs externas puede tener problemas de carga/disponibilidad)
const BALL_IMAGE_URL = 'https://static.vecteezy.com/system/resources/previews/011/421/474/non_2x/soccer-ball-realistic-png.png';
const GOAL_IMAGE_URL = 'https://media.istockphoto.com/id/508552766/es/foto/poste-de-porter%C3%ADa.jpg?s=612x612&w=0&k=20&c=n4RVMXHBhbflThK9GBaCxHNgqJ419nG6H1gu1DAdzFg=';


const DesafioTirosScreen = ({ route }) => {
    const navigation = useNavigation();

    // --- Obtener funciones y estado necesarios del GameContext ---
    const {
        addCoins,
        updateBetaGameProgress,
        isCooldownActive,
        setCooldown,
        // Puedes obtener otros estados o funciones del contexto si los necesitas aquí
    } = useContext(GameContext);

    // Obtén el gameId pasado como parámetro de navegación (debería ser 'beta_tiros')
    // Usamos un valor por defecto para debug si no se pasa el parámetro
    const { gameId = 'VALOR_NO_RECIBIDO' } = route.params || {};

    // --- Logs de Depuración Cruciales (al inicio del componente) ---
    console.log("--- DesafioTirosScreen: Renderizando (Inicio del componente) ---");
    console.log("--- DesafioTirosScreen: gameId recibido:", gameId);
    console.log("--- DesafioTirosScreen: GAME_ID_STRING esperado:", GAME_ID_STRING);
    console.log("--- DesafioTirosScreen: Comparación gameId === GAME_ID_STRING:", gameId === GAME_ID_STRING);
    // --- Fin Logs de Depuración Cruciales ---


    // --- Verificación Crucial: Asegúrate de que el gameId es el esperado ---
    // Esto ayuda a detectar si se navegó a esta pantalla con un gameId incorrecto
    if (gameId !== GAME_ID_STRING) {
        console.error(`Error Crítico: DesafioTirosScreen recibió gameId incorrecto: ${gameId}. Se esperaba ${GAME_ID_STRING}.`);
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


    const [tirosExitosos, setTirosExitosos] = useState(0);
    // Inicializa en true. El useEffect lo pondrá en false si no hay cooldown.
    const [cooldownActive, setCooldownActive] = useState(true);
    // Inicializa en false. El useEffect lo pondrá en true si no hay cooldown y el juego inicia.
    const [gameInProgress, setGameInProgress] = useState(false);
    const [shotResult, setShotResult] = useState(null); // 'success', 'fail', null

    // Estado y animación para la barra de timing
    const animationValue = useRef(new Animated.Value(0)).current; // Valor de animación (0 a 1)
    const animationRef = useRef(null); // Referencia para controlar la animación

    // --- Lógica para calcular la duración de la animación basada en el progreso ---
    const getAnimationDuration = useCallback(() => {
        // Calcula la duración interpolando entre BASE_ANIMATION_DURATION y MIN_ANIMATION_DURATION
        // a medida que tirosExitosos va de 0 a TIROS_REQUERIDOS - 1
        // Evita división por cero si TIROS_REQUERIDOS es 1
        const progress = TIROS_REQUERIDOS > 1 ? tirosExitosos / (TIROS_REQUERIDOS - 1) : 0;
        const duration = BASE_ANIMATION_DURATION - (BASE_ANIMATION_DURATION - MIN_ANIMATION_DURATION) * progress;

        // Asegura que la duración no sea menor que la mínima
        return Math.max(duration, MIN_ANIMATION_DURATION);
    }, [tirosExitosos]); // Depende de tirosExitosos para recalcular la duración


    // --- Lógica de Animación de la Barra ---
    // Usamos useCallback para que esta función no cambie innecesariamente y no cause bucles en useEffect
    const startAnimation = useCallback(() => {
        if (animationRef.current) {
             animationRef.current.stop(); // Detiene la animación anterior si existe
        }
        animationValue.setValue(0); // Reinicia la animación al principio

        const currentDuration = getAnimationDuration(); // Obtiene la duración basada en el progreso actual
        console.log(`DesafioTirosScreen (${gameId}): startAnimation - Duración calculada: ${currentDuration.toFixed(0)}ms.`);


        animationRef.current = Animated.loop( // Crea una animación en bucle
            Animated.sequence([ // Secuencia de animaciones (ida y vuelta)
                Animated.timing(animationValue, {
                    toValue: 1, // Mueve hasta el final (representa el 100%)
                    duration: currentDuration / 2, // La mitad de la duración total para ir
                    easing: Easing.linear, // Velocidad constante
                    useNativeDriver: false, // Necesario para animar propiedades de layout si no usas transform
                }),
                Animated.timing(animationValue, {
                    toValue: 0, // Mueve de regreso al principio
                    duration: currentDuration / 2, // La mitad de la duración total para volver
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        );
        animationRef.current.start(); // Inicia la animación
        console.log(`DesafioTirosScreen (${gameId}): startAnimation - Animación iniciada.`);
    }, [animationValue, gameId, getAnimationDuration]); // Dependencias: Añadimos getAnimationDuration


    // --- useEffect para chequear Cooldown al cargar la pantalla e iniciar el juego ---
    useEffect(() => {
         console.log(`DesafioTirosScreen (${gameId}): useEffect - Iniciando chequeo de cooldown.`);
         console.log(`DesafioTirosScreen (${gameId}): useEffect - gameId: ${gameId}, isCooldownActive typeof: ${typeof isCooldownActive}.`);

        if (typeof isCooldownActive === 'function') {
             const checkCooldownStatus = async () => {
                 try {
                     console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - Llamando a isCooldownActive(${gameId})...`);
                     const active = await isCooldownActive(gameId);
                     console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - isCooldownActive retornó: ${active}.`);

                     setCooldownActive(active); // Actualiza el estado local de cooldown

                     console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - Estado local cooldownActive actualizado a: ${active}.`);

                     // Si no está en cooldown, inicia el juego
                     if (!active) {
                         console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - No hay cooldown, iniciando juego.`);
                         setGameInProgress(true); // Marca el juego como en progreso
                         console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - Estado local gameInProgress actualizado a: true.`);
                         startAnimation(); // Inicia la animación (la primera vez)
                         console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - Animación iniciada.`);
                     } else {
                         console.log(`DesafioTirosScreen (${gameId}): checkCooldownStatus - Cooldown activo, juego no iniciado.`);
                     }
                 } catch (e) {
                     console.error(`DesafioTirosScreen (${gameId}): checkCooldownStatus - Error al chequear cooldown:`, e);
                      Alert.alert("Error de Carga", "No se pudo verificar el estado del desafío.");
                      // Si hay un error al chequear, asumimos cooldown activo para evitar jugar
                      setCooldownActive(true);
                      setGameInProgress(false); // Asegurarse de que el juego no inicie en caso de error
                 }
             };
             checkCooldownStatus();
        } else {
            console.error('DesafioTirosScreen: useEffect - Error de Configuración: isCooldownActive no es una función en el contexto.');
             Alert.alert("Error", "El juego no está configurado correctamente (función de cooldown falta).");
             setCooldownActive(true); // Deshabilita el desafío si no se puede chequear cooldown
             setGameInProgress(false); // Asegurarse de que el juego no inicie
        }

        // Limpieza del efecto: Detiene la animación si la pantalla se desmonta
        return () => {
             console.log(`DesafioTirosScreen (${gameId}): useEffect - Limpieza (desmontando).`);
             if (animationRef.current) {
                 animationRef.current.stop();
             }
        };

    }, [gameId, isCooldownActive, setCooldown, startAnimation]); // Dependencias


    // --- useFocusEffect para manejar la salida de la pantalla (opcional) ---
    useFocusEffect(
        useCallback(() => {
            // console.log(`DesafioTirosScreen (${gameId}) GANÓ foco.`);
            return () => {
                // console.log(`DesafioTirosScreen (${gameId}) PERDIÓ foco.`);
                // Lógica al salir/perder foco (if applies)
                // Si sales sin completar, puedes detener el juego o guardar el progreso parcial si aplica
                 if (animationRef.current) {
                     animationRef.current.stop();
                 }
                 setGameInProgress(false); // Marca el juego como no en progreso al salir
            };
        }, [gameId, tirosExitosos, updateBetaGameProgress]) // Dependencias relevantes
    );


    // --- Handler para el botón de Disparar ---
    const handleShoot = async () => {
        console.log("DesafioTirosScreen: Botón '¡Disparar!' presionado."); // Log para confirmar que el handler se llama
        console.log(`DesafioTirosScreen: handleShoot - gameInProgress: ${gameInProgress}, cooldownActive: ${cooldownActive}, tirosExitosos: ${tirosExitosos}, TIROS_REQUERIDOS: ${TIROS_REQUERIDOS}`); // Log estados

        // No permitir disparar si el juego no está en progreso o está en cooldown
        if (!gameInProgress || cooldownActive || tirosExitosos >= TIROS_REQUERIDOS) {
            console.log("DesafioTirosScreen: Intento de disparo ignorado (juego no en progreso, cooldown, o completado)");
             if (cooldownActive) {
                 Alert.alert('En Cooldown', 'Ya jugaste este desafío. Vuelve en 24 horas.');
             } else if (tirosExitosos >= TIROS_REQUERIDOS) {
                 // Esto no debería pasar si el botón se deshabilita correctamente
                 Alert.alert('Completado', 'Ya completaste este desafío.');
             } else if (!gameInProgress) {
                 // Si gameInProgress es false, puede ser que el useEffect no terminó o falló
                 console.warn("DesafioTirosScreen: Intento de disparo con gameInProgress=false. Verifique useEffect inicial.");
                 Alert.alert('Juego No Iniciado', 'El desafío aún no ha iniciado correctamente. Inténtalo de nuevo.');
             }
            return;
        }

        // --- LOG CLAVE: Confirmar que pasamos la verificación inicial ---
        console.log("DesafioTirosScreen: handleShoot - Pasó la verificación inicial. Procesando disparo...");
        // --- FIN LOG CLAVE ---

        let animationProgress;
        let markerPosition;
        let targetZoneCenter;
        let targetZoneStart;
        let targetZoneEnd;

        try {
            // --- LOG antes de obtener el valor de la animación ---
            console.log("DesafioTirosScreen: handleShoot - Antes de obtener valor de animación.");
            // --- FIN LOG ---

            // Obtiene el valor actual de la animación (entre 0 a 1)
            // --- LOG para inspeccionar animationValue ---
            console.log("DesafioTirosScreen: handleShoot - Inspeccionando animationValue:", animationValue);
            // --- FIN LOG ---

            // *** CORRECCIÓN AQUÍ: Usar _value en lugar de getValue() ***
            animationProgress = animationValue._value;
            // *** FIN CORRECCIÓN ***


            // --- LOG después de obtener el valor de la animación ---
            console.log(`DesafioTirosScreen: handleShoot - Valor de animación obtenido: ${animationProgress}`);
            // --- FIN LOG ---


            // Calcula la posición del marcador en la barra (0 a BAR_WIDTH)
            markerPosition = animationProgress * BAR_WIDTH;

            // --- LOG después de calcular markerPosition ---
            console.log(`DesafioTirosScreen: handleShoot - Posición del marcador calculada: ${markerPosition.toFixed(2)}`);
            // --- FIN LOG ---


            // Calcula el centro de la zona objetivo
            targetZoneCenter = BAR_WIDTH / 2;
            // Calcula los límites de la zona objetivo
            targetZoneStart = targetZoneCenter - TARGET_ZONE_WIDTH / 2;
            targetZoneEnd = targetZoneCenter + TARGET_ZONE_WIDTH / 2;

            // --- LOGS JUSTO ANTES DE LA CONDICIÓN DE ACIERTO/FALLO ---
            console.log(`DesafioTirosScreen (${gameId}): Evaluando condición de acierto:`);
            console.log(`  markerPosition: ${markerPosition.toFixed(2)}`);
            console.log(`  targetZoneStart: ${targetZoneStart.toFixed(2)}`);
            console.log(`  targetZoneEnd: ${targetZoneEnd.toFixed(2)}`);
            console.log(`  Condición: ${markerPosition.toFixed(2)} >= ${targetZoneStart.toFixed(2)} && ${markerPosition.toFixed(2)} <= ${targetZoneEnd.toFixed(2)}`);
            console.log(`  Resultado de la condición: ${markerPosition >= targetZoneStart && markerPosition <= targetZoneEnd}`);
            // --- FIN LOGS ---

             // --- LOG justo antes de la lógica de acierto/fallo ---
            console.log("DesafioTirosScreen: handleShoot - Entrando a la lógica de acierto/fallo.");
            // --- FIN LOG ---


            // --- Lógica de resultado del disparo ---
            if (markerPosition >= targetZoneStart && markerPosition <= targetZoneEnd) {
                // --- LOG DE ACIERTO ---
                console.log(`DesafioTirosScreen (${gameId}): ¡Disparo exitoso! (Entró al bloque IF)`);
                // --- FIN LOG ---
                setShotResult('success');
                const nextTiros = tirosExitosos + 1;
                setTirosExitosos(nextTiros); // Incrementa el contador de tiros exitosos
                 console.log(`DesafioTirosScreen (${gameId}): Tiros exitosos actualizados a: ${nextTiros}.`);


                // Verifica si se completó el desafío
                if (nextTiros >= TIROS_REQUERIDOS) {
                    console.log(`DesafioTirosScreen (${gameId}): ¡Desafío completado con ${nextTiros} tiros exitosos!`);

                    // Detiene la animación al completar
                     if (animationRef.current) {
                         animationRef.current.stop();
                         console.log("DesafioTirosScreen: Animación detenida al completar.");
                     }


                    // --- Otorgar Recompensas y Establecer Cooldown ---

                    // 1. Añade monedas usando la función del contexto
                    if (typeof addCoins === 'function') {
                        addCoins(RECOMPENSA_MONEDAS);
                        console.log(`DesafioTirosScreen (${gameId}): ${RECOMPENSA_MONEDAS} monedas añadidas.`);
                    } else {
                        console.error('DesafioTirosScreen: Error de Configuración: addCoins no es una función en el contexto.');
                    }

                    // 2. Establece el cooldown para este juego usando la función del contexto
                    if (typeof setCooldown === 'function') {
                         try {
                            console.log(`DesafioTirosScreen (${gameId}): Llamando a setCooldown(${gameId})...`);
                            await setCooldown(gameId);
                            setCooldownActive(true); // Actualiza el estado local para que la pantalla cambie inmediatamente
                            console.log(`DesafioTirosScreen (${gameId}): Cooldown establecido.`);
                         } catch (e) {
                             console.error(`DesafioTirosScreen (${gameId}): Error al establecer cooldown:`, e);
                             Alert.alert("Error", "No se pudo guardar el estado de completado.");
                         }
                    } else {
                         console.error('DesafioTirosScreen: Error de Configuración: setCooldown no es una función en el contexto.');
                    }

                    // 3. Actualiza el progreso del Evento Beta para marcar este juego como completado
                    if (typeof updateBetaGameProgress === 'function') {
                         console.log(`DesafioTirosScreen (${gameId}): Llamando a updateBetaGameProgress(${gameId})...`); // Log gameId
                         updateBetaGameProgress(gameId); // Llama con el gameId correcto ('beta_tiros')
                         console.log(`DesafioTirosScreen (${gameId}): updateBetaGameProgress llamado.`);
                     } else {
                         console.error('DesafioTirosScreen: Error de Configuración: updateBetaGameProgress no es una función en el contexto.');
                    }

                    // 4. Muestra la alerta final y navega de regreso
                    // Mensaje de éxito final: "felicidades"
                    Alert.alert('¡Desafío completado!', `¡Felicidades! Ganaste ${RECOMPENSA_MONEDAS} monedas.`, [
                        { text: 'Volver', onPress: () => navigation.navigate('BienvenidaBetaScreen') },
                    ]);
                     console.log(`DesafioTirosScreen (${gameId}): Alerta de completado mostrada. Navegando al presionar Volver.`);


                    setGameInProgress(false); // Marca el juego como no en progreso
                    console.log(`DesafioTirosScreen (${gameId}): gameInProgress actualizado a: false.`);


                } else {
                    // Si aún no se completan los tiros requeridos, la animación continúa automáticamente
                     Alert.alert('¡Gol!', `Buen tiro. Llevas ${nextTiros} de ${TIROS_REQUERIDOS}.`); // Mensaje de progreso intermedio
                     // La animación NO se detiene ni se reinicia aquí, continúa sola.
                     console.log(`DesafioTirosScreen (${gameId}): Tiro exitoso pero desafío no completado. La animación continúa.`);

                }

            } else {
                // Disparo fallido
                // --- LOG DE FALLO ---
                console.log(`DesafioTirosScreen (${gameId}): Disparo fallido. (Entró al bloque ELSE)`);
                // --- FIN LOG ---
                setShotResult('fail');
                // Mensaje de fallo: "has fallado"
                Alert.alert('¡Fallaste!', 'Has fallado. Inténtalo de nuevo.');
                setTirosExitosos(0); // <-- Reinicia el contador de tiros exitosos al fallar
                 console.log(`DesafioTirosScreen (${gameId}): Tiros exitosos reiniciados a 0.`);

                startAnimation(); // <-- Reinicia la animación al fallar (volverá a la velocidad inicial)
                console.log(`DesafioTirosScreen (${gameId}): Tiro fallido. Reiniciando animación.`);
            }

        } catch (error) {
            // --- LOG DE ERROR EN EL BLOQUE TRY ---
            console.error(`DesafioTirosScreen (${gameId}): Error capturado en bloque de procesamiento de disparo:`, error);
            // --- FIN LOG ---
            Alert.alert("Error del Juego", "Ocurrió un error al procesar tu disparo. Inténtalo de nuevo.");
            // Opcional: Reiniciar el juego o navegar de regreso en caso de error crítico
            // navigation.navigate('BienvenidaBetaScreen');
        }


        // Reinicia el resultado visual después de un breve momento
        setTimeout(() => setShotResult(null), 500); // Muestra el resultado por 500ms
    };

    // Calcula la posición horizontal del marcador animado
    const animatedMarkerStyle = {
        transform: [{
            translateX: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, BAR_WIDTH - MARKER_SIZE], // Se mueve desde 0 hasta el final de la barra menos el tamaño del marcador
            }),
        }],
    };

    // --- Renderizado condicional basado en cooldown ---

    // Si está en cooldown, muestra la pantalla de cooldown
    if (cooldownActive) {
        console.log(`DesafioTirosScreen (${gameId}): Renderizando pantalla de cooldown.`);
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Desafío de Tiros</Text>
                <Text style={styles.cooldown}>Ya jugaste este desafío. Vuelve en 24 horas.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BienvenidaBetaScreen')}>
                    <Text style={styles.buttonText}>Volver</Text>
                 </TouchableOpacity>
            </View>
        );
    }

    // Si NO está en cooldown y el juego está en progreso, muestra la pantalla del desafío
     console.log(`DesafioTirosScreen (${gameId}): Renderizando pantalla de desafío.`);
     console.log(`DesafioTirosScreen (${gameId}): Estado actual: gameInProgress=${gameInProgress}, cooldownActive=${cooldownActive}, tirosExitosos=${tirosExitosos}`);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Desafío de Tiros</Text>

            {/* Imagen del Arco */}
            <Image
                source={{ uri: GOAL_IMAGE_URL }}
                style={styles.goalImage}
                resizeMode="contain" // Ajusta la imagen para que quepa
            />

            {/* Área del juego de timing */}
            <View style={styles.timingGameArea}>
                 {/* Barra de fondo */}
                 <View style={styles.timingBarBackground}>
                     {/* Zona objetivo (el centro) */}
                     <View style={[
                         styles.targetZone,
                         { width: TARGET_ZONE_WIDTH, marginLeft: (BAR_WIDTH - TARGET_ZONE_WIDTH) / 2 } // Centra la zona objetivo
                     ]} />
                 </View>
                 {/* Marcador animado */}
                 <Animated.View style={[styles.marker, animatedMarkerStyle]} />
            </View>

            {/* Imagen de la Pelota */}
            <Image
                source={{ uri: BALL_IMAGE_URL }}
                style={styles.ballImage}
                resizeMode="contain"
            />


            {/* Botón de Disparar */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleShoot}
                // Deshabilita el botón si el juego no está en progreso o ya se completaron los tiros
                disabled={!gameInProgress || tirosExitosos >= TIROS_REQUERIDOS}
            >
                <Text style={styles.buttonText}>¡Disparar!</Text>
            </TouchableOpacity>

            {/* Muestra el progreso de tiros exitosos */}
            <Text style={styles.progressText}>Tiros Exitosos: {tirosExitosos} / {TIROS_REQUERIDOS}</Text>

            {/* Indicador visual del resultado del disparo (Opcional) */}
            {shotResult === 'success' && <Text style={styles.resultTextSuccess}>¡GOL!</Text>}
            {shotResult === 'fail' && <Text style={styles.resultTextFail}>¡FALLASTE!</Text>}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4CAF50', // Fondo verde de campo
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        color: 'white',
        marginBottom: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra de texto
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
    button: {
        backgroundColor: '#FF9800', // Naranja vibrante
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 30, // Más espacio arriba
        elevation: 5, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    goalImage: {
        width: '80%', // Ancho relativo
        height: 150, // Altura fija
        marginBottom: 20,
    },
    ballImage: {
        width: 60, // Tamaño de la pelota
        height: 60,
        marginTop: 20, // Espacio debajo de la barra
    },
    timingGameArea: {
        width: BAR_WIDTH,
        height: MARKER_SIZE, // La altura es igual al tamaño del marcador
        justifyContent: 'center', // Centra el marcador verticalmente
        marginBottom: 20,
    },
    timingBarBackground: {
        width: BAR_WIDTH,
        height: 10, // Altura de la barra visible
        backgroundColor: '#ddd', // Gris claro
        borderRadius: 5,
        overflow: 'hidden', // Esconde partes del marcador si se sale
        position: 'absolute', // Posiciona la barra de fondo
        top: (MARKER_SIZE - 10) / 2, // Centra la barra visualmente dentro del área
        flexDirection: 'row', // Para posicionar la zona objetivo
    },
    targetZone: {
        height: '100%', // La altura de la zona objetivo es la de la barra
        backgroundColor: '#00C853', // Verde brillante
        // Posicionamiento horizontal manejado inline
    },
    marker: {
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        backgroundColor: '#FF5252', // Rojo
        borderRadius: MARKER_SIZE / 2, // Redondo
        position: 'absolute', // Permite moverlo con transform
        top: 0, // Alineado arriba dentro del área
        left: 0, // Empieza a la izquierda
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
    resultTextFail: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5252', // Rojo
        marginTop: 10,
    },
});

export default DesafioTirosScreen;
