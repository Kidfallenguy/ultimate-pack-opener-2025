import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, Image, ScrollView, Alert, Easing, Dimensions } from 'react-native';
import GameContext from '../context/GameContext';
import { playersData } from '../data/players'; // Asegúrate de que playersData está bien importado y tiene los datos
import Card from '../components/Card'; // Asegúrate de que el componente Card está bien importado y funciona


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fondo: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-start',
        padding: 20,
    },
    contentContainer: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    coinText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginBottom: 20,
        color: 'white',
        // Añadir sombra o contorno si el fondo es claro
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: 'white',
         // Añadir sombra o contorno si el fondo es claro
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    packButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        width: '90%',
    },
    packImage: {
        width: 150,
        height: 80,
        marginBottom: 10,
        resizeMode: 'contain',
        // borderRadius: 8, // Las imágenes de sobres suelen ser rectangulares, quizás sin borde
    },
    packButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    packDescription: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    animacionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semi-transparente oscuro
        zIndex: 10, // Asegura que esté por encima de otros elementos
    },
    sobreAnimado: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        // borderRadius: 12, // Esto parece un borde, quizás no necesario para el sobre
    },
    brillo: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute',
        transform: [{ rotate: '-45deg' }],
        // Ajustar tamaño y posición del brillo según el sobre
        width: 250, // Ejemplo
        height: 200, // Ejemplo
        top: -25, // Ejemplo de ajuste de posición
        left: -25, // Ejemplo de ajuste de posición
        overflow: 'hidden', // Para que el brillo no se salga del área del sobre
    },
    infoCartaContainer: {
        position: 'absolute',
        // Ajusta estas posiciones para que estén centradas respecto a donde termina la carta
        top: '50%', // Centrado verticalmente
        left: '50%', // Centrado horizontalmente
        transform: [{ translateX: -75 }, { translateY: -120 }], // Ajuste fino (mitad del ancho/alto del contenedor)
        alignItems: 'center',
        zIndex: 3,
        width: 150, // Ancho del contenedor para centrar el texto
    },
    infoTexto: {
        fontSize: 18, // Ajuste de tamaño para mejor visualización
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        opacity: 0,
        textAlign: 'center', // Centrar el texto
         // Añadir sombra o contorno para visibilidad
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    cartaAnimadaContainer: {
        position: 'absolute',
        // Posición final de la carta después de la animación
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: -100 }], // Ajuste fino (mitad del ancho/alto de la carta aprox)
        zIndex: 3,
        opacity: 0,
    },
    cerrarBoton: {
        marginTop: 50,
        paddingVertical: 10, // Ajuste de padding
        paddingHorizontal: 20,
        backgroundColor: '#007bff', // Color azul
        borderRadius: 5,
        zIndex: 4, // Por encima de la carta y el fondo
    },
    skipButton: {
        position: 'absolute',
        top: 40, // Ajuste de posición
        right: 20,
        paddingVertical: 10, // Ajuste de padding
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo semi-transparente
        borderRadius: 5,
        zIndex: 11, // Por encima de todo lo demás
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000', // Color oscuro para el texto
    },
    sobreContainer: {
        position: 'relative', // Para que el brillo se posicione respecto a él
        width: 200,
        height: 150,
        zIndex: 2, // Por encima del fondo animado, pero debajo de la info y carta final
    },
    fondoAnimado: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: '#87CEEB', // Color base del fondo si no hay imagen
        opacity: 0,
        zIndex: 1, // Detrás del sobre, brillo, info y carta final
    },
    confetiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 4, // Encima de la carta, debajo de los botones
        pointerEvents: 'none', // Asegura que el confeti no bloquee toques
    },
    confeti: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gold', // Color por defecto, será sobrescrito por el random
        position: 'absolute',
    },
});

const SobresScreen = () => {
    const { coins, subtractCoins, addCard, collection, updateLegendTaskProgress } = useContext(GameContext);

    // Estados de control de la animación y el flujo
    const [animacionActiva, setAnimacionActiva] = useState(false); // Controla si el overlay de animación es visible
    const [cartaRevelada, setCartaRevelada] = useState(null); // La carta que se obtiene y se muestra
    const [showSkipButton, setShowSkipButton] = useState(false); // Muestra/oculta el botón de saltar
    const [animacionTerminada, setAnimacionTerminada] = useState(false); // Señal para el useEffect que cierra la animación
    const isAddingCard = useRef(false); // Para evitar añadir la carta varias veces en diferentes callbacks

    // Valores animados
    const abrirSobreAnim = useRef(new Animated.Value(0)).current; // Animación de apertura del sobre
    const cartaAnim = useRef(new Animated.Value(0)).current; // Animación de la carta (volteo)
    const brilloAnim = useRef(new Animated.Value(0)).current; // Animación del brillo
    const infoPaisAnim = useRef(new Animated.Value(0)).current; // Animación info País
    const infoPosicionAnim = useRef(new Animated.Value(0)).current; // Animación info Posición
    const infoClubAnim = useRef(new Animated.Value(0)).current; // Animación info Club
    const cartaFinalAnim = useRef(new Animated.Value(0)).current; // Animación de aparición final de la carta
    const fondoAnim = useRef(new Animated.Value(0)).current; // Animación del fondo (walkout)

    // Estados y refs para el confeti
    const [confetiVisible, setConfetiVisible] = useState(false);
    const [confetiPieces, setConfetiPieces] = useState([]); // Inicialmente vacío
    const animarConfeti = useRef(null); // Ref para la referencia de requestAnimationFrame

    const packSeleccionado = useRef(null); // Para saber qué sobre se abrió (si es necesario después)

    // Interpolaciones de animación
    const scaleSobre = abrirSobreAnim.interpolate({
        inputRange: [0, 0.5, 0.7, 1],
        outputRange: [1, 1.1, 1.05, 0.1], // Se encoge mucho al final
    });

    const rotateSobre = abrirSobreAnim.interpolate({
        inputRange: [0, 0.3, 0.6, 1],
        outputRange: ['0deg', '-5deg', '5deg', '0deg'], // Ligero bamboleo
    });

    const rotateCarta = cartaAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '180deg', '0deg'], // Giro de 180 grados
    });

    const brilloOpacity = brilloAnim.interpolate({
        inputRange: [0, 0.3, 0.6, 1],
        outputRange: [0, 0.7, 1, 0], // Aparece y desaparece el brillo
    });

    // Interpolación genérica para fade in con pequeño movimiento vertical
    const fadeInMove = (animValue) => ({
        opacity: animValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
        }),
        transform: [{
            translateY: animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [20, 10, 0], // Se mueve 20px hacia arriba
            }),
        }],
    });

    const fadeInCarta = cartaFinalAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const fadeInFondo = fondoAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.8, 1], // Fade in hasta 80% de opacidad
    });

    // Lógica del Confeti -- FINAL --
    const generarConfeti = (count = 150) => { // Aumentamos un poco la cantidad
        const confetiPiecesArray = [];
        const { width, height } = Dimensions.get('window');
        for (let i = 0; i < count; i++) {
            confetiPiecesArray.push({
                id: i,
                x: Math.random() * width,
                y: Math.random() * -height, // Empezar más arriba, fuera de pantalla
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                size: Math.random() * 8 + 5,
                rotation: Math.random() * 360,
                velocityY: Math.random() * 4 + 3, // Aumentamos la velocidad de caída (entre 3 y 7)
                velocityX: (Math.random() - 0.5) * 6, // Movimiento horizontal aleatorio (entre -3 y 3)
                rotationSpeed: (Math.random() - 0.5) * 20, // Velocidad de rotación aleatoria
            });
        }
        return confetiPiecesArray;
    };

    // Función que actualiza la posición de cada trozo de confeti
    const actualizarConfeti = () => {
         // Usamos el callback de setConfetiPieces para obtener el estado anterior
        setConfetiPieces(prevPieces => {
            const { width, height } = Dimensions.get('window');
            return prevPieces.map(p => {
                let newY = p.y + p.velocityY;
                let newX = p.x + p.velocityX;
                const newRotation = p.rotation + p.rotationSpeed;

                // Reiniciar si cae por debajo de la pantalla
                if (newY > height) {
                    newY = Math.random() * -50; // Reaparece arriba
                    newX = Math.random() * width; // En una nueva posición horizontal aleatoria

                    // Re-aleatorizar velocidades y apariencia al reiniciar para variar el efecto
                     const velocityY = Math.random() * 4 + 3;
                     const velocityX = (Math.random() - 0.5) * 6;
                     const rotationSpeed = (Math.random() - 0.5) * 20;
                     const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                     const size = Math.random() * 8 + 5;

                    return {
                       ...p,
                       x: newX,
                       y: newY,
                       velocityY,
                       velocityX,
                       rotationSpeed,
                       color,
                       size,
                    };
                }

                // Reaparecer al otro lado si sale por los lados (wrapping horizontal)
                if (newX > width) newX = newX - width;
                else if (newX < 0) newX = newX + width;


                return { ...p, y: newY, x: newX, rotation: newRotation };
            });
        });
    };

    // Inicia el bucle de animación del confeti usando requestAnimationFrame
    const startConfetiAnimation = () => {
        console.log('Iniciando animación de confeti...');
        setConfetiPieces(generarConfeti()); // Generar nuevas piezas al iniciar
        setConfetiVisible(true); // Hacer el contenedor visible

        // Esta función se llamará repetidamente por requestAnimationFrame
        const loop = () => {
            actualizarConfeti(); // Actualizar la posición de las piezas
            animarConfeti.current = requestAnimationFrame(loop); // Solicitar el siguiente frame
        };

        // Limpiar cualquier loop anterior antes de iniciar uno nuevo
        if (animarConfeti.current) {
             cancelAnimationFrame(animarConfeti.current);
        }
        animarConfeti.current = requestAnimationFrame(loop); // Iniciar el primer frame
    };

    // Detiene el bucle de animación del confeti
    const stopConfetiAnimation = () => {
        console.log('Deteniendo animación de confeti...');
        if (animarConfeti.current) {
             cancelAnimationFrame(animarConfeti.current); // Cancela el próximo frame solicitado
        }
        animarConfeti.current = null; // Asegurar que la ref es null
        setConfetiVisible(false); // Ocultar el contenedor
        setConfetiPieces([]); // Limpiar las piezas del estado
    };
    // Fin Lógica del Confeti -- FINAL --


    // Función auxiliar para obtener los datos de una nueva carta sin iniciar animación ni añadir al estado global
    const obtenerNuevaCartaData = () => {
         if (!playersData || playersData.length === 0) {
             console.error("No hay datos de jugadores disponibles.");
             return null;
         }

        let nuevaCarta;
        let intentos = 0;
         // Lógica para obtener una carta random. Considera mejorar esto
         // si necesitas evitar duplicados de jugadores o tener lógicas de "walkout" más sofisticadas.
         // Para evitar problemas con React keys y la gestión de colección, siempre asignamos un ID único.
        do {
            const randomIndex = Math.floor(Math.random() * playersData.length);
             // Clonamos la carta y le asignamos un ID único basado en un timestamp para la colección/renderizado
             nuevaCarta = { ...playersData[randomIndex], id: `${playersData[randomIndex].id}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}` }; // ID más robusto y único por instancia

            intentos++;
            if (intentos > 1000) {
                console.warn("Demasiados intentos para obtener una carta.playersData podría ser demasiado pequeña.");
                break;
            }
             // NOTA: Esta lógica NO evita que obtengas el MISMO jugador (por sus propiedades name, rating, etc.),
             // solo asegura que la "instancia" de la carta en tu colección tenga un ID único.
             // Si quieres evitar duplicados de jugadores específicos (ej. no tener dos Messis base 94),
             // necesitas filtrar playersData o checkear antes de seleccionar.
        } while (false); // Bucle simple, ajusta si necesitas lógica de duplicados

        return nuevaCarta;
    };

    // Lógica principal de abrir sobre y animar
    const handleAbrirSobre = (packType, cost) => {
        console.log('Intentando abrir sobre - Monedas:', coins, 'Costo:', cost, 'animacionActiva:', animacionActiva);
        if (coins >= cost && !animacionActiva) {
            packSeleccionado.current = packType;
            subtractCoins(cost);

  // --- 🔥 AÑADE ESTE BLOQUE AQUÍ 🔥 ---
            if (typeof updateLegendTaskProgress === 'function') { // Verifica que la función esté disponible
                const taskId = 'open_any_packs_10'; // <-- ID exacto de la misión de abrir sobres
                const cantidad = 1; // <-- Sumamos 1 por CADA sobre abierto

                console.log(`DEBUG_LEYENDA: [Sobres] Preparando llamada a updateLegendTaskProgress.`); // Log para depurar
                console.log(`DEBUG_LEYENDA: [Sobres] taskId: ${taskId}, cantidad: ${cantidad}`); // Log para depurar

                updateLegendTaskProgress(taskId, cantidad); // <-- LLAMADA A LA FUNCIÓN DE LEYENDA

                console.log(`DEBUG_LEYENDA: [Sobres] updateLegendTaskProgress llamado.`); // Log para depurar

            } else {
                console.error('SobresScreen: Error de Configuración: updateLegendTaskProgress no es una función en el contexto.');
            }
            // --- FIN BLOQUE A AÑADIR 🔥 ---
            // Obtenemos la carta INMEDIATAMENTE
            const nuevaCarta = obtenerNuevaCartaData();

            if (nuevaCarta) {
                 setCartaRevelada(nuevaCarta); // Establecer la carta para que se pueda mostrar en la animación
                 setAnimacionActiva(true); // Activar el overlay de animación
                 setAnimacionTerminada(false); // Resetear flag de terminación
                 isAddingCard.current = false; // Resetear flag de añadir carta
                 setShowSkipButton(true); // Mostrar el botón "Saltar"

                 abrirAnimacion(nuevaCarta); // Iniciar la secuencia de animación
                 console.log('handleAbrirSobre - Inicia animación con carta:', nuevaCarta.name);
            } else {
                 // Manejar caso si no se pudo obtener una carta (playersData vacía, etc.)
                 Alert.alert('Error', 'No se pudo obtener una carta para abrir.');
                 setAnimacionActiva(false); // No iniciar animación si no hay carta
                 setCartaRevelada(null);
                 setShowSkipButton(false);
            }


        } else if (animacionActiva) {
            Alert.alert('Espera', 'La animación actual aún no ha terminado.');
        } else {
            Alert.alert('Sin monedas', `No tienes suficientes monedas para abrir este sobre (${cost} 💰).`);
        }
    };


    // Secuencia de animación principal
    const abrirAnimacion = (cartaOriginal) => {
        let duration = 1200; // Duración base para la animación del sobre
        // Ajustar duración o animaciones según el rating si es un "walkout"
         if (cartaOriginal.rating >= 88) { // Umbral de rating para un walkout (ejemplo)
           duration = 1800; // Un poco más lento para walkouts
           // Aquí podrías añadir más animaciones de "walkout" si las tienes
         }
         if (cartaOriginal.rating >= 92) { // Umbral para un super walkout
            duration = 2200;
         }


        // Resetear valores animados al inicio de la animación
        abrirSobreAnim.setValue(0);
        cartaAnim.setValue(0);
        brilloAnim.setValue(0);
        infoPaisAnim.setValue(0);
        infoPosicionAnim.setValue(0);
        infoClubAnim.setValue(0);
        cartaFinalAnim.setValue(0);
        fondoAnim.setValue(0);


        Animated.sequence([
            // Fase 1: Aparece fondo y sobre se mueve
            Animated.timing(fondoAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.easeInOut
            }),
            Animated.timing(abrirSobreAnim, {
                toValue: 1,
                duration: duration, // Usa la duración ajustada
                useNativeDriver: true,
                easing: Easing.easeInOut,
            }),
            // Fase 2: Brillo y Volteo de Carta (empieza un poco antes de que el sobre termine de encogerse)
            Animated.parallel([
                 Animated.timing(brilloAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.timing(cartaAnim, {
                    toValue: 1, // Voltea completamente
                    duration: 1000, // Duración del volteo
                     delay: duration * 0.6, // <-- Empieza el volteo cuando el sobre lleva un 60% de su animación
                    useNativeDriver: true,
                    easing: Easing.easeInOut,
                }),

            ]),
            Animated.delay(400), // Pausa corta después del volteo/brillo
            // Fase 3: Información (País, Posición, Club) con pequeñas pausas entre ellas
            Animated.sequence([
                Animated.timing(infoPaisAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.easeInOut }),
                Animated.delay(300),
                Animated.timing(infoPaisAnim, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.easeInOut }),
                Animated.delay(200),
                Animated.timing(infoPosicionAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.easeInOut }),
                Animated.delay(300),
                Animated.timing(infoPosicionAnim, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.easeInOut }),
                Animated.delay(200),
                Animated.timing(infoClubAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.easeInOut }),
                Animated.delay(300),
                Animated.timing(infoClubAnim, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.easeInOut }),
            ]),
            Animated.delay(500), // Pausa antes de revelar carta final
            // Fase 4: Revelar carta final
            Animated.timing(cartaFinalAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.easeInOut,
            }),
        ]).start(() => {
            // Callback que se ejecuta al TERMINAR toda la secuencia de animación
            console.log('Animación completa - Callback final');
            // Añadir la carta al estado global *solo si* no se ha hecho ya (por si se presionó saltar justo al final)
if (!isAddingCard.current) {
    console.log('Animación completa - Añadiendo carta al estado global');
    addCard({ ...cartaOriginal }); // <-- ADD THE TASK LOGIC HERE
    isAddingCard.current = true;
}

            setAnimacionTerminada(true); // Señalar que la animación ha terminado (activa timer de cierre)
            setShowSkipButton(false); // Ocultar botón de saltar
            startConfetiAnimation(); // Iniciar confeti
        });
    };

    // Lógica para saltar la animación
    const saltarSobre = () => {
        // Solo permitir saltar si la animación está activa y aún no se ha añadido la carta
        // y si ya se ha cargado una carta para revelar (cartaRevelada !== null)
        if (animacionActiva && cartaRevelada && !isAddingCard.current) {
             console.log('Saltando animación...');
            // Detener todas las animaciones en curso inmediatamente
            abrirSobreAnim.stopAnimation();
            cartaAnim.stopAnimation();
            brilloAnim.stopAnimation();
            infoPaisAnim.stopAnimation();
            infoPosicionAnim.stopAnimation();
            infoClubAnim.stopAnimation();
            cartaFinalAnim.stopAnimation();
            fondoAnim.stopAnimation();

            // Establecer los valores finales para que la carta aparezca instantáneamente (o al menos el fondo)
            fondoAnim.setValue(1); // Fondo visible
            cartaFinalAnim.setValue(1); // Carta final visible
            abrirSobreAnim.setValue(1); // Sobre desaparecido (se encogió)
            cartaAnim.setValue(1); // Carta "volteada"
             brilloAnim.setValue(0); // Brillo apagado
             infoPaisAnim.setValue(0); // Info apagada
             infoPosicionAnim.setValue(0);
             infoClubAnim.setValue(0);


            // Añadir la carta al estado global inmediatamente
            if (!isAddingCard.current) {
                 console.log('saltarSobre - Añadiendo carta al estado global');
                addCard({ ...cartaRevelada }); // Añadir la carta que ya fue obtenida en handleAbrirSobre
                isAddingCard.current = true; // Marcar que ya se añadió
            }


            // Finalizar el estado de la animación para que el useEffect cierre todo
            // Mantenemos animacionActiva en true por un instante para que el overlay no desaparezca bruscamente antes de que el timer de animacionTerminada actúe.
            setAnimacionActiva(true);
            setAnimacionTerminada(true); // Esto activará el timer de cierre
            setShowSkipButton(false); // Ocultar el botón de saltar
            startConfetiAnimation(); // Iniciar el confeti al saltar también

        } else {
             console.log('Saltar no disponible en este momento.');
             // Opcional: Mostrar un mensaje al usuario
        }
    };

    // Lógica para cerrar la animación después de que haya terminado o se haya saltado
    const cerrarAnimacion = () => {
         console.log('Cerrando animación...');
        setAnimacionActiva(false); // Ocultar el overlay completo
        setCartaRevelada(null); // Limpiar la carta revelada

        // Asegurarse de que todos los valores animados estén en su estado inicial (0)
        abrirSobreAnim.setValue(0);
        cartaAnim.setValue(0);
        brilloAnim.setValue(0);
        infoPaisAnim.setValue(0);
        infoPosicionAnim.setValue(0);
        infoClubAnim.setValue(0);
        cartaFinalAnim.setValue(0);
        fondoAnim.setValue(0);

        setAnimacionTerminada(false); // Resetear flag de terminación
        setShowSkipButton(false); // Asegurar que el botón esté oculto
        stopConfetiAnimation(); // Detener y limpiar el confeti (seguro, aunque el useEffect de cleanup lo haga)
        isAddingCard.current = false; // Resetear el flag para la próxima apertura

         console.log('Animación cerrada y estados reseteados.');
    };

    // useEffect para iniciar el timer de cierre después de que la animación termina (o se salta)
    useEffect(() => {
        let timer;
        if (animacionTerminada) {
            console.log('useEffect [animacionTerminada] - Animación terminada, iniciando timer de cierre.');
            timer = setTimeout(() => {
                cerrarAnimacion();
            }, 2500); // Timer de 2.5 segundos para dar visibilidad a la carta final/confeti
        }
        return () => {
            console.log('useEffect [animacionTerminada] - Limpiando timer.');
            clearTimeout(timer);
        };
    }, [animacionTerminada]); // Depende de animacionTerminada

    // useEffect para limpieza al desmontar el componente
    useEffect(() => {
        console.log('useEffect [] - Componente montado, configurando limpieza.');
        return () => {
             console.log('useEffect [] - Componente desmontando, limpiando animaciones y timers.');
             // Detener confeti y todas las animaciones al desmontar para evitar memory leaks
             stopConfetiAnimation();
            abrirSobreAnim.stopAnimation();
            cartaAnim.stopAnimation();
            brilloAnim.stopAnimation();
            infoPaisAnim.stopAnimation();
            infoPosicionAnim.stopAnimation();
            infoClubAnim.stopAnimation();
            cartaFinalAnim.stopAnimation();
            fondoAnim.stopAnimation();
        };
    }, []); // Se ejecuta solo una vez al montar y desmontar


    return (
        <ImageBackground
            source={{ uri: 'https://wallpapers.com/images/hd/gorgeous-landscape-of-fifa-21-green-football-field-vbqqd2bkliimt8dm.jpg' }}
            style={styles.fondo}
        >
            {/* Contenido principal de la pantalla (Scrollable) */}
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Texto de monedas */}
                <Text style={styles.coinText}>Monedas: {coins}</Text>
                {/* Título de la pantalla */}
                <Text style={styles.title}>Abrir Sobres</Text>

                {/* Botones de sobres */}
                <TouchableOpacity style={styles.packButton} onPress={() => handleAbrirSobre('basic', 5)}>
                    <Image
                        source={{ uri: 'https://cdn-b.futmind.com/_next/image?url=https%3A%2F%2Ffutmind.com%2Fimages%2Ffifa2025%2Fpacks%2Fpacks_backgrounds_3.png&w=3840&q=75' }}
                        style={styles.packImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.packButtonText}>Sobre Normal (5 💰)</Text>
                    <Text style={styles.packDescription}>Jugadores básicos</Text>
                </TouchableOpacity>

<TouchableOpacity style={styles.packButton} onPress={() => handleAbrirSobre('lightning', 100)}>
    <Image
        source={{ uri: 'https://assets.fut.gg/frontend/site-images/site/pack.webp' }}
        style={styles.packImage}
        resizeMode="contain"
    />
    <Text style={styles.packButtonText}>Sobre Relámpago (100 💰)</Text>
    <Text style={styles.packDescription}>Mejores jugadores</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.packButton} onPress={() => handleAbrirSobre('legendary', 700)}>
    <Image
        source={{ uri: 'https://www.futnext.com/_next/image?url=https%3A%2F%2Fcdn.futnext.com%2Fpack%2F57.png&w=384&q=75' }}
        style={styles.packImage}
        resizeMode="contain"
    />
    <Text style={styles.packButtonText}>Sobre Legendario (700 💰)</Text> {/* Keep this text */}
    <Text style={styles.packDescription}>Jugadores de leyenda</Text>
</TouchableOpacity>

                 {/* Aquí podrías añadir más botones de sobres si los tienes */}


            </ScrollView>

            {/* Overlay de Animación (se muestra si animacionActiva es true y hay carta para revelar) */}
            {/* El View con position: 'absolute' cubre la pantalla cuando animacionActiva es true */}
            {animacionActiva && cartaRevelada && ( // Asegúrate de que haya una carta para mostrar
                <View style={styles.animacionContainer}>
                    {/* Fondo animado (ej. walkout background) */}
                    <Animated.Image
                        style={[styles.fondoAnimado, { opacity: fadeInFondo }]}
                         // Usa una imagen de fondo adecuada para la animación
                        source={{ uri: 'https://www.fifaultimateteam.it/en/wp-content/uploads/2024/08/Cover-Walkout-Ultimate-Team-FC-25.webp' }}
                         resizeMode="cover" // Asegúrate de que cubra el área
                    />

                    {/* Contenedor del sobre y brillo */}
                    <Animated.View style={[styles.sobreContainer, { transform: [{ scale: scaleSobre }, { rotate: rotateSobre }] }]}>
                        {/* Imagen del sobre (se encoge) */}
                         {/* Podrías cambiar esta imagen dinámicamente o usar una secuencia de imágenes si tienes más assets */}
                        <Image
                            source={require('../assets/sobre_abierto.png')} // Asumiendo que tienes esta imagen
                            style={styles.sobreAnimado}
                            resizeMode="contain"
                        />
                        {/* Brillo animado */}
                        <Animated.View style={[styles.brillo, { opacity: brilloOpacity }]} />
                    </Animated.View>

                    {/* Información de la carta (País, Posición, Club) */}
                    <View style={styles.infoCartaContainer}>
                        <Animated.Text style={[styles.infoTexto, fadeInMove(infoPaisAnim)]}>{cartaRevelada.nation}</Animated.Text>
                        <Animated.Text style={[styles.infoTexto, fadeInMove(infoPosicionAnim)]}>{cartaRevelada.position}</Animated.Text>
                        <Animated.Text style={[styles.infoTexto, fadeInMove(infoClubAnim)]}>
                            {cartaRevelada.type === 'Icono' ? 'Icono' : cartaRevelada.club} {/* Mostrar "Icono" si el tipo es Icono */}
                        </Animated.Text>
                    </View>

                    {/* Contenedor de la carta final revelada */}
                    <Animated.View style={[styles.cartaAnimadaContainer, { opacity: fadeInCarta }]}>
                        {/* Renderiza el componente Card con los datos de la carta revelada */}
                        {cartaRevelada && <Card player={cartaRevelada} />}
                    </Animated.View>

                    {/* Contenedor del confeti */}
                    {confetiVisible && (
                        <View style={styles.confetiContainer}>
                            {confetiPieces.map(p => (
                                <View // Usamos View simple para el confeti, no necesita ser Animated
                                    key={p.id} // Clave única para cada pieza de confeti
                                    style={[
                                        styles.confeti,
                                        {
                                            backgroundColor: p.color,
                                            width: p.size,
                                            height: p.size,
                                            borderRadius: p.size / 2,
                                            left: p.x, // Posición X usando el estado
                                            top: p.y, // Posición Y usando el estado
                                            transform: [{ rotate: `${p.rotation}deg` }], // Rotación
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Botón para cerrar la animación */}
                     {/* Se muestra solo después de que la animación principal termina (para dar tiempo a ver la carta/confeti) */}
                     {animacionTerminada && (
                        <TouchableOpacity style={styles.cerrarBoton} onPress={cerrarAnimacion}>
                             <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Cerrar</Text>
                        </TouchableOpacity>
                     )}


                    {/* Botón para saltar la animación */}
                    {/* Se muestra mientras la animación está activa y antes de terminar (cuando animacionTerminada es false) */}
                    {showSkipButton && !animacionTerminada && (
                        <TouchableOpacity style={styles.skipButton} onPress={saltarSobre}>
                            <Text style={styles.skipButtonText}>Saltar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

        </ImageBackground>
    );
};

export default SobresScreen;