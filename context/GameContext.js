import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ALL_INITIAL_SBCS_DATA, completeSBC as runCompleteSBC } from '../utils/sbcLogic';
import { ALL_PLAYERS_DATA, PLAYER_CARD_IMAGES } from '../data/players';
import { Audio } from 'expo-av';
import { AppState } from 'react-native'; // Si no la tienes
import { ALL_AUDIO_FILES } from '../data/audio'; // <<-- AÑADE ESTA LÍNEA

// ... tus otras importaciones ...
// ** Asegúrate de que '../data/players.js' exista y exporte playersData **
// import { playersData } from '../data/players'; // Podrías necesitar importar playersData aquí si la usas directamente en GameContext


import {
    STORAGE_KEYS,
    BETA_MINIGAMES,
    LEGEND_TASKS,
    LEGEND_TASK_REQUIREMENTS
} from '../utils/constants'; // <--- VERIFY THIS PATH CAREFULLY!

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        // Este error ayuda a depurar si el hook se usa fuera del Provider
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
import { playersData } from '../data/players';

// --- NUEVAS IMPORTACIONES PARA LA MÚSICA ---

import { Platform } from 'react-native'; // Si lo necesitas para lógica específica de plataforma, si no, puedes omitirlo.

// ¡AÑADE ESTOS CONSOLE.LOGS JUSTO AQUÍ!
console.log("DEBUG: playersData JUSTO DESPUÉS DE LA IMPORTACIÓN:", playersData);
console.log("DEBUG: Tipo de playersData JUSTO DESPUÉS DE LA IMPORTACIÓN:", typeof playersData);
console.log("DEBUG: ¿playersData es un array? JUSTO DESPUÉS DE LA IMPORTACIÓN:", Array.isArray(playersData));


// --- Constantes para el Evento Beta ---
export const EVENT_NAMES = {
    BETA: 'betaEvent', // El nombre correcto de tu evento
    // Si añades otros eventos en el futuro, irían aquí
};




// Definición del contexto - Define la FORMA y los valores por defecto
export const GameContext = createContext({
    coins: 1000,
    collection: [], // Colección de cartas con instanceId único
    team: {
        portero: null,
        defensa_central_derecha: null,
        defensa_central_izquierda: null,
        lateral_derecho: null,
        lateral_izquierdo: null,
        mediocampista_central_1: null,
        mediocampista_central_2: null,
        mediocampista_central_3: null,
        delantero_derecha: null,
        delantero_centro: null,
        delantero_izquierda: null,
    },
    currentFormation: '4-3-3',
    availableFormations: ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'],
    savedTeams: {},
    sbcList: [], // Lista de SBCs con su estado (ej. completado)

    // --- Estados para Eventos ---
    eventFichas: 0, // Moneda/Tokens específicos de eventos (generales)
    betaEventProgress: {
        // Estructura para rastrear el progreso detallado del evento Beta
        [BETA_MINIGAMES.GAME1]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME2]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME3]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME4]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME5]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME6]: { count: 0, lastCompleted: null }, // Minijuego de portero
        [BETA_MINIGAMES.GAME7]: { count: 0, lastCompleted: null },
        // Progreso y estado de la recompensa final del evento Beta
        finalRewardProgress: 0, // Progreso numérico hacia la recompensa (ej. contador del minijuego de portero)
        finalRewardRequired: 14, // Requisito para la recompensa final (ej. 14 completaciones del portero)
        finalRewardClaimed: false, // Si la recompensa final ha sido reclamada
        finalRewardChoice: null, // La recompensa elegida, si aplica
    },
    // --- Fin Estados para Eventos ---

    // --- Funciones del juego ---
    addCard: (card) => {}, // Añade una carta (asigna instanceId)
    removeCard: (instanceId) => {}, // Remueve una carta por su instanceId (usando instanceId)
    addCoins: (amount) => {},
    subtractCoins: (amount) => false, // Retorna si tuvo éxito
    addPlayerToTeam: (position, player) => {}, // Añade una carta (instancia) al equipo
    removePlayerFromTeam: (position) => {}, // Remueve jugador del equipo por posición
    changeFormation: (formation) => {},
    sellCard: (instanceId) => 0, // Vende una carta por su instanceId
    calculateSellValue: (rating) => 0, // Calcula valor de venta
    saveTeam: (teamName) => {},
    loadTeam: (teamName) => {},
    applyCode: (code) => ({ success: false, title: 'Código Inválido', message: 'El código ingresado no es válido.' }),
    loadSBCs: () => {}, // Carga los SBCs iniciales y guardados
    completeSBC: (sbcId, submittedCards) => {}, // Completa un SBC

    // --- Funciones para Eventos ---
    setEventFichas: (amount) => {}, // (Considera usar add/subtract para control incremental)
    addEventFichas: (amount) => {}, // Añadido: Para sumar fichas generales
    subtractEventFichas: (amount) => false, // Añadido: Para restar fichas generales (Retorna si tuvo éxito)

    updateBetaGameProgress: (gameId, completionDetails) => {}, // Actualiza el progreso de un minijuego Beta específico
    claimBetaFinalReward: (rewardChoice) => {}, // Reclama la recompensa final del evento Beta
    // --- Fin Funciones para Eventos ---
});

// Componente Proveedor del contexto
export const GameProvider = ({ children }) => {
    // --- Estados reales del juego (declaración con useState) ---
    const backgroundMusicRef = useRef(new Audio.Sound());
const [currentPlayingMusicKey, setCurrentPlayingMusicKey] = useState(null);
    const [musicVolume, setMusicVolume] = useState(0.5);
// ... tus otros estados ...
    const [isMusicEnabled, setIsMusicEnabled] = useState(true); // Definición del estado isMusicEnabled

    const soundEffectRef = useRef(new Audio.Sound());
    const [coins, setCoins] = useState(10); // Moneda principal
    const [collection, setCollection] = useState([]); // Colección de cartas con instanceId único
const [team, setTeam] = useState({
        portero: null,
        defensa_central_derecha: null,
        defensa_central_izquierda: null,
        lateral_derecho: null,
        lateral_izquierdo: null,
        mediocampista_central_izquierda: null, // ¡CORREGIDO!
        mediocampista_central_centro: null,     // ¡CORREGIDO!
        mediocampista_central_derecha: null,    // ¡CORREGIDO!
        mediocampista_izquierda: null,
        mediocampista_derecha: null,
        mediocampista_defensivo_izquierda: null,
        mediocampista_defensivo_derecha: null,
        mediocampista_ofensivo: null,
        mediocampista_ofensivo_izquierda: null,
        mediocampista_ofensivo_central: null,
        mediocampista_ofensivo_derecha: null,
        delantero_derecha: null,
        delantero_centro: null,
        delantero_izquierda: null,
        delantero_1: null,
        delantero_2: null,
        defensa_izquierda: null,
        defensa_central: null,
        defensa_derecha: null,
        carrilero_izquierdo: null,
        carrilero_derecho: null,
    });
    const [currentFormation, setCurrentFormation] = useState('4-3-3'); // Formación seleccionada
    const [savedTeams, setSavedTeams] = useState({}); // Equipos guardados por nombre
    const [sbcList, setSbcList] = useState([]); // Estado para la lista de SBCs cargada y su estado (ej. completado)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const availableFormations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1']; // Formaciones disponibles
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // <--- ESTO ES NUEVO

    // --- Estados para Eventos (declaración con useState) ---
    const [eventFichas, setEventFichas] = useState(0); // Moneda/Tokens específicos de eventos (generales)
    const [championsTokens, setChampionsTokens] = useState(0); // Inicializa con 0 o el valor guardado
    const [claimedEventPlayers, setClaimedEventPlayers] = useState({}); // Inicializa con un objeto vacío o el estado guardado
    const subtractChampionsTokens = (amount) => {
    setChampionsTokens(prevTokens => Math.max(0, prevTokens - amount)); // Evita que el saldo sea negativo
  };

    const markEventPlayerAsClaimed = (playerId) => {
    setClaimedEventPlayers(prevState => ({
      ...prevState,
      [playerId]: true, // Marca el jugador con ese ID como reclamado
    }));
  };
    const [betaEventProgress, setBetaEventProgress] = useState({ // Progreso del evento "Bienvenido a la Beta"
        // Estado inicial para evento Beta con estructura detallada (count/lastCompleted por minijuego ID)
        // Asegúrate de que estos IDs coincidan con los definidos en BETA_MINIGAMES
        [BETA_MINIGAMES.GAME1]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME2]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME3]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME4]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME5]: { count: 0, lastCompleted: null },
        [BETA_MINIGAMES.GAME6]: { count: 0, lastCompleted: null }, // Minijuego de portero (requisito 14 veces)
        [BETA_MINIGAMES.GAME7]: { count: 0, lastCompleted: null },
        finalRewardProgress: 0, // Progreso numérico hacia la recompensa final (contador del minijuego de portero)
        finalRewardRequired: 14, // Requisito fijo para la recompensa final Beta (14 completaciones del portero)
        finalRewardClaimed: false, // Si la recompensa final ha sido reclamada
        finalRewardChoice: null, // La recompensa elegida, si aplica
    });
    // --- Fin Estados para Eventos ---
// ... otras funciones definidas en GameProvider (addCoins, addCard, etc.) ...
// Función para sumar Fichas Champions
const addChampionsTokens = (amount) => {
  if (typeof amount !== 'number' || amount < 0) {
    console.warn("GameContext: addChampionsTokens recibió una cantidad inválida", amount);
    return;
  }
  console.log(`GameContext: Añadidas ${amount} Fichas Champions.`); // <-- Log añadido
  setChampionsTokens(prevTokens => prevTokens + amount);
};

const updateLegendTaskProgress = useCallback((taskId, amount = 1) => {
    if (typeof taskId !== 'string' || typeof amount !== 'number' || amount <= 0) {
        console.warn("updateLegendTaskProgress: Parámetros inválidos.", { taskId, amount });
        return;
    }
    // Asegúrate de que el taskId es uno de los esperados
    const validTaskIds = LEGEND_TASKS.map(task => task.id); // Usar LEGEND_TASKS importada
     if (!validTaskIds.includes(taskId)) {
         console.warn(`updateLegendTaskProgress: taskId desconocido: ${taskId}. No se actualiza el progreso.`);
         Alert.alert("Error Interno", "Intento de actualizar progreso de tarea desconocida.");
         return;
     }


    console.log(`Intentando actualizar progreso para tarea: ${taskId} con cantidad: ${amount}`);

    setLegendTasksProgress(prevProgress => {
        const currentProgress = prevProgress[taskId] || 0; // Usa 0 si la tarea no existe en el estado aún
        const newProgress = currentProgress + amount;
        const required = LEGEND_TASK_REQUIREMENTS[taskId] || 0; // Obtiene el requisito para la tarea

        // Opcional: Limitar el progreso para que no supere el requisito si no es una tarea acumulativa infinita
        // Aunque para 'score_30_goals_minijuegos' querrás que siga sumando incluso después de 30
        // Si quieres que se detenga al llegar al requisito para ciertas tareas, añade lógica aquí.
        // Por ahora, simplemente sumamos. El cálculo de 'isCompleted' lo maneja la pantalla/useMemo.

        const updatedProgress = {
            ...prevProgress,
            [taskId]: newProgress,
        };

        console.log(`Progreso actualizado para ${taskId}: ${currentProgress} + ${amount} = ${newProgress}`);




        return updatedProgress;
    });
}, [setLegendTasksProgress, LEGEND_TASKS, LEGEND_TASK_REQUIREMENTS]); // Dependencias: el setter y las constantes que usa

    // --- Funciones de control de música ---

        const setBackgroundMusicVolume = useCallback(async (volume) => {
        // Asegurarse de que el volumen esté entre 0 y 1
        const safeVolume = Math.min(1.0, Math.max(0.0, volume));
        setMusicVolume(safeVolume); // Actualiza el estado del volumen

        try {
            const status = await backgroundMusicRef.current.getStatusAsync();
            if (status.isLoaded) {
                await backgroundMusicRef.current.setVolumeAsync(safeVolume);
                console.log(`[Audio Debug] Volumen de música ajustado a: ${safeVolume}`);
            }
        } catch (error) {
            console.error("[Audio Error] Error al establecer el volumen:", error);
        }
    }, []);
    const playBackgroundMusic = useCallback(async (musicKey, loop = true) => {
        console.log(`[Audio Debug] Intentando reproducir música: ${musicKey}`);
        if (!isMusicEnabled) {
            console.log("[Audio Debug] Música deshabilitada. No se reproduce.");
            return;
        }

        const source = ALL_AUDIO_FILES[musicKey];
        if (!source) {
            console.error(`[Audio Error] No se encontró el archivo de audio para la clave: ${musicKey}`);
            Alert.alert("Error de Audio", `No se encontró la canción: ${musicKey}.`);
            return;
        }

        try {
            const status = await backgroundMusicRef.current.getStatusAsync();
            if (status.isLoaded) {
                await backgroundMusicRef.current.unloadAsync();
                console.log("[Audio Debug] Música anterior descargada.");
            }

            // Carga y reproduce la nueva música con el volumen actual
            await backgroundMusicRef.current.loadAsync(source, {
                shouldPlay: true,
                isLooping: loop,
                volume: musicVolume, // <<-- Aplica el volumen guardado aquí
            });
            await backgroundMusicRef.current.playAsync();
            setCurrentPlayingMusicKey(musicKey);
            console.log(`[Audio Debug] Reproduciendo: ${musicKey}`);

        } catch (error) {
            console.error("[Audio Error] Error al reproducir música de fondo:", error);
            Alert.alert("Error de Reproducción", `No se pudo reproducir la canción: ${error.message}`);
        }
    }, [isMusicEnabled, setCurrentPlayingMusicKey, musicVolume]); // <<-- musicVolume como dependencia

    const stopBackgroundMusic = useCallback(async () => {
        console.log("[Audio Debug] Intentando detener música.");
        try {
            const status = await backgroundMusicRef.current.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
                await backgroundMusicRef.current.pauseAsync(); // Pausar en lugar de descargar para reanudar más fácil
                console.log("[Audio Debug] Música de fondo pausada.");
            }
        } catch (error) {
            console.error("[Audio Error] Error al detener música de fondo:", error);
        }
    }, []);

    const toggleMusic = useCallback((newState) => {
        console.log(`[Audio Debug] Cambiando estado de música a: ${newState}`);
        setIsMusicEnabled(newState);
        if (!newState) {
            stopBackgroundMusic();
        } else if (currentPlayingMusicKey) { // Si se habilita y había una canción seleccionada, la reanuda
            playBackgroundMusic(currentPlayingMusicKey, true);
        }
    }, [stopBackgroundMusic, currentPlayingMusicKey, playBackgroundMusic]);

    // (Si usas efectos de sonido, descomenta esto)
    // const playSoundEffect = useCallback(async (soundKey) => {
    //     if (!isMusicEnabled) return; // Puedes decidir si los efectos de sonido dependen del switch de música

    //     const source = ALL_AUDIO_FILES[soundKey];
    //     if (!source) {
    //         console.error(`[Audio Error] No se encontró el archivo de efecto de sonido para la clave: ${soundKey}`);
    //         return;
    //     }

    //     try {
    //         if (soundEffectRef.current._loaded) {
    //             await soundEffectRef.current.unloadAsync(); // Descarga el efecto anterior
    //         }
    //         await soundEffectRef.current.loadAsync(source, { shouldPlay: true, isLooping: false });
    //         await soundEffectRef.current.playAsync();
    //         console.log(`[Audio Debug] Reproduciendo efecto de sonido: ${soundKey}`);
    //     } catch (error) {
    //         console.error("[Audio Error] Error al reproducir efecto de sonido:", error);
    //     }
    // }, [isMusicEnabled]);


    // --- Efecto para manejar el estado de la aplicación (primer plano/fondo) ---
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            const status = await backgroundMusicRef.current.getStatusAsync();
            if (nextAppState === 'inactive' || nextAppState === 'background') {
                if (status.isLoaded && status.isPlaying) {
                    await backgroundMusicRef.current.pauseAsync();
                    console.log("[Audio Debug] App en segundo plano, música pausada.");
                }
            } else { // 'active'
                if (isMusicEnabled && status.isLoaded && !status.isPlaying) {
                    await backgroundMusicRef.current.playAsync();
                    console.log("[Audio Debug] App en primer plano, música reanudada.");
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            if (backgroundMusicRef.current._loaded) {
                backgroundMusicRef.current.unloadAsync(); // Limpiar el audio al desmontar
                console.log("[Audio Debug] Limpieza de audio al desmontar GameContext.");
            }
            subscription.remove();
        };
    }, [isMusicEnabled]); // Añade isMusicEnabled a las dependencias

    // ... (resto de useEffects, loadGameState, saveGameState, etc.)

const [playerCollection, setPlayerCollection] = useState([]); // <-- DECLARACIÓN DE playerCollection
    // --- Efectos (useEffect) ---
    // Cargar estado al inicio
    useEffect(() => {
        console.log("useEffect: Montaje. Cargando estado inicial.");
        loadGameState(); // Carga el estado principal (monedas, colección, equipo, etc.)
        // La carga de SBCs se inicia aquí también. loadSBCs llama a loadInitialSBCs y loadSBCsFromStorage
        loadSBCs(); // Llama a la función wrapper loadSBCs definida abajo
    }, []); // El array vacío asegura que esto solo se ejecute una vez al montar la app

    // Guardar estado principal cuando cambia (incluye todos los estados principales que deben persistir)
    // Se activa cada vez que cambia alguna de las dependencias listadas
    useEffect(() => {
        // console.log("useEffect: Dependencias de estado principal cambiaron. Guardando estado."); // Descomentar para debug
        saveGameState();
    }, [
        coins, // Si las monedas cambian
        collection, // Si la colección de cartas cambia
        team, // Si la estructura del equipo cambia
        currentFormation, // Si la formación cambia
        savedTeams, // Si la lista de equipos guardados cambia
        eventFichas, // Si las fichas de evento cambian
        betaEventProgress, // Si el progreso del evento Beta cambia
        // addCoins YA FUE REMOVIDO DE AQUÍ
    ]);

    // Efecto separado para guardar SBCs si cambian.
    // Podría no ser estrictamente necesario si sbcList cambia poco,
    // pero asegura que el estado de completado se guarda.
    useEffect(() => {
         // console.log("useEffect: sbcList cambió. Guardando estado de SBCs."); // Descomentar para debug
         // saveSBCsToStorage es importada y requiere la lista actual
         // Asumo que saveSBCsToStorage fue diseñada para ser llamada con la lista como argumento
         saveSBCsToStorage(sbcList);
    }, [sbcList]); // Se activa cada vez que la lista de SBCs cambia

    const [isPlayerReady, setIsPlayerReady] = useState(false); // Para saber si TrackPlayer está inicializado

const [legendRewardClaimed, setLegendRewardClaimed] = useState(false);
const [claimedLegendPlayerId, setClaimedLegendPlayerId] = useState(null);
const [legendTasksProgress, setLegendTasksProgress] = useState({}); // O [] si usas un array
const [betaFichas, setBetaFichas] = useState(0); // <-- ¡ASEGÚRATE QUE ESTA LÍNEA ESTÉ AQUÍ!


// ... otras funciones definidas en GameProvider ...
    const getPlayerById = useCallback((playerId) => {
        // --- INICIO DE DEPURACIÓN DETALLADA para playersData ---
        console.log(`\n--- DEBUGGING getPlayerById ---`);
        console.log(`[getPlayerById] Llamada para buscar ID: '${playerId}'`);
        console.log(`[getPlayerById] Tipo de playersData recibido: ${typeof playersData}`);
        console.log(`[getPlayerById] playersData ¿es un array?: ${Array.isArray(playersData)}`);

        if (!Array.isArray(playersData)) {
            console.error(
                "¡ERROR CRÍTICO! playersData NO ES UN ARRAY. " +
                "Verifica la importación en GameContext.js y la exportación en data/players.js."
            );
            return null;
        }

        if (playersData.length === 0) {
            console.warn(`[getPlayerById] playersData es un array vacío. No se encontrarán jugadores.`);
            return null;
        }

        // Puedes descomentar estas líneas si quieres ver los primeros elementos del array
        // console.log(`[getPlayerById] Primeros 5 elementos de playersData:`, playersData.slice(0, 5));
        // console.log(`[getPlayerById] Cantidad total de jugadores en playersData: ${playersData.length}`);

        let foundPlayer = null;
        try {
            foundPlayer = playersData.find(player => {
                // Validación robusta para elementos en el array
                if (player === undefined || player === null) {
                    console.error(`[getPlayerById] ERROR: Se encontró un elemento UNDEFINED/NULL en el array playersData. Saltando. Buscando ID: ${playerId}`);
                    return false;
                }
                if (typeof player !== 'object' || player.id === undefined) {
                    console.error(`[getPlayerById] ERROR: Elemento en playersData NO es un objeto válido o le falta la propiedad 'id'. Elemento problemático:`, player, `Buscando ID: ${playerId}`);
                    return false;
                }
                return player.id === playerId;
            });
        } catch (e) {
            console.error(`[getPlayerById] ¡EXCEPCIÓN CRÍTICA! Error al iterar sobre playersData:`, e, `ID buscado: ${playerId}`);
            return null;
        }

        console.log(`[getPlayerById] Resultado final de la búsqueda para ID '${playerId}':`, foundPlayer ? foundPlayer.name : 'NO ENCONTRADO');
        console.log(`--- FIN DEBUGGING getPlayerById ---\n`);

        return foundPlayer;
    }, [playersData]); // playersData es una dependencia para useCallback


const addPlayerToInventory = (player) => {
  // Verifica si setCollection está disponible (si gestionas la colección aquí)
  if (typeof setCollection === 'function') {
    setCollection(prevCollection => {
      // Opcional: Evitar duplicados si un jugador ya está en la colección
      // Aunque para jugadores canjeables del evento, solo se pueden reclamar una vez
      // const isAlreadyInCollection = prevCollection.some(p => p.id === player.id);
      // if (isAlreadyInCollection) {
      //   console.warn(`Player with ID ${player.id} is already in the collection.`);
      //   return prevCollection; // No modificar si ya existe
      // }
      console.log(`GameContext: Añadiendo jugador ${player.name} al inventario.`);
      return [...prevCollection, player]; // Añade el nuevo jugador al array existente
    });
  } else {
    console.error("GameContext: setCollection no está definido. No se puede añadir el jugador al inventario.");
    // Manejar error o loguear si el estado de colección no se gestiona aquí
  }
};
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newState = !prevMode; // Calcula el nuevo estado
            console.log('toggleDarkMode ejecutado. Nuevo isDarkMode:', newState); // <-- AGREGADO
            return newState; // Retorna el nuevo estado
        });
    };

    const contextValue = {
        isDarkMode,
        toggleDarkMode,
    };

// playerInstanceIdsToRemove: un array de IDs de instancia (instanceId) de jugadores a eliminar
const removePlayersFromInventory = (playerInstanceIdsToRemove) => {
  // Verifica si setCollection está disponible (si gestionas la colección aquí)
  if (typeof setCollection === 'function') {
    console.log(`GameContext: Intentando eliminar jugadores con Instance IDs: ${playerInstanceIdsToRemove.join(', ')}`); // <-- Log añadido
    setCollection(prevCollection => {
      // Filtra la colección, manteniendo solo los jugadores cuyo ID de instancia NO está en la lista a eliminar
      const updatedCollection = prevCollection.filter(player => !playerInstanceIdsToRemove.includes(player.instanceId));
      console.log(`GameContext: Jugadores restantes en la colección después de filtrar: ${updatedCollection.length}`); // <-- Log añadido
      // Opcional: Loguear los instanceIds restantes para verificar
      // console.log("GameContext: Instance IDs restantes:", updatedCollection.map(p => p.instanceId));
      return updatedCollection;
    });
  } else {
    console.error("GameContext: setCollection no está definido. No se pueden eliminar jugadores del inventario.");
    // Manejar error o loguear si el estado de colección no se gestiona aquí
  }
};


// ***************************************************************
const ALL_POSITIONS_INITIAL_STATE = {
    portero: null,
    defensa_central_derecha: null,
    defensa_central_izquierda: null,
    lateral_derecho: null,
    lateral_izquierdo: null,
    mediocampista_central_izquierda: null,
    mediocampista_central_centro: null,
    mediocampista_central_derecha: null,
    mediocampista_izquierda: null,
    mediocampista_derecha: null,
    mediocampista_defensivo_izquierda: null,
    mediocampista_defensivo_derecha: null,
    mediocampista_ofensivo: null,
    mediocampista_ofensivo_izquierda: null,
    mediocampista_ofensivo_central: null,
    mediocampista_ofensivo_derecha: null,
    delantero_derecha: null,
    delantero_centro: null,
    delantero_izquierda: null,
    delantero_1: null,
    delantero_2: null,
    defensa_izquierda: null,
    defensa_central: null,
    defensa_derecha: null,
    carrilero_izquierdo: null,
    carrilero_derecho: null,
};
// ***************************************************************



const claimLegendReward = useCallback((rewardPlayerCardData) => {
    // rewardPlayerCardData debería ser el objeto con los datos base
    // de la carta legendaria que el usuario elige/reclama

    // 1. Verificar si las tareas de leyenda están completadas
    if (!areLegendTasksCompleted) {
        console.warn("claimLegendReward: Tareas de leyenda no completadas.");
        Alert.alert("Requisitos Pendientes", "Completa todas las tareas de Camino de Leyenda para reclamar.");
        return false; // Indica que no se pudo reclamar
    }

    // 2. Verificar si la recompensa ya fue reclamada
    if (legendRewardClaimed) {
        console.warn("claimLegendReward: Recompensa de leyenda ya reclamada.");
        Alert.alert("Ya Reclamada", "Ya has reclamado tu recompensa de leyenda.");
        return false; // Indica que no se pudo reclamar
    }

    // 3. Si se cumplen los requisitos y no ha sido reclamada:
    console.log("Reclamando recompensa de leyenda...");

    // Lógica para otorgar la recompensa:
    // - Añadir la carta legendaria a la colección
    if (rewardPlayerCardData) {
         addCard(rewardPlayerCardData); // Usa la función addCard del contexto
         console.log(`Carta legendaria ${rewardPlayerCardData.name} añadida.`);
    } else {
         console.error("claimLegendReward: No se proporcionaron datos válidos para la carta de recompensa.");
         Alert.alert("Error", "No se pudo otorgar la carta de recompensa.");
         return false; // Indica que falló por datos inválidos
    }


    // - Opcional: Otorgar monedas/fichas extra
    // addCoins(someAmount);
    // addEventFichas(someAmount);

    // - Actualizar estados para marcar como reclamada y guardar el ID
    setLegendRewardClaimed(true); // Usa el setter del estado
    setClaimedLegendPlayerId(rewardPlayerCardData?.id || null); // Usa el setter del estado

    console.log("Recompensa de leyenda reclamada con éxito.");
    Alert.alert("Recompensa Recibida", `¡Has reclamado a tu jugador legendario!`);

    return true; // Indica que se reclamó con éxito

}, [areLegendTasksCompleted, legendRewardClaimed, addCard, setLegendRewardClaimed, setClaimedLegendPlayerId /* , addCoins, addEventFichas, si los usas */]); // Añade aquí todas las dependencias (estados, setters, funciones del contexto que usa claimLegendReward)
//eso tilin
const areLegendTasksCompleted = useMemo(() => {
    // Aquí va la lógica para verificar si todas las tareas están completadas
    // Debes iterar sobre LEGEND_TASKS o LEGEND_TASK_REQUIREMENTS
    // y comparar el progreso actual en legendTasksProgress
    // con el requisito en LEGEND_TASK_REQUIREMENTS.
    for (const task of LEGEND_TASKS) {
        const required = LEGEND_TASK_REQUIREMENTS[task.id];
        const currentProgress = legendTasksProgress[task.id] || 0;
        if (currentProgress < required) {
            return false; // Si alguna tarea no cumple el requisito, retorna falso
        }
    }
    return true; // Si todas las tareas cumplen, retorna verdadero
}, [legendTasksProgress]); // La dependencia es legendTasksProgress

  const addPlayerToUserCollection = (player) => {
    setUserPlayers(prevPlayers => {
      // Opcional: Evitar duplicados si quieres que solo se pueda tener 1 de cada carta
      if (prevPlayers.some(p => p.id === player.id)) {
        return prevPlayers; // Ya lo tiene, no añadir
      }
      return [...prevPlayers, player];
    });
  };


    // Guarda el estado principal del juego en AsyncStorage
    const saveGameState = useCallback(async () => {
        try {
            const stateToSave = {
                coins,
                collection, // Guarda la colección (instancias de cartas)
                team, // Guarda el equipo (instancias de cartas en posiciones)
                currentFormation,
                savedTeams, // Guarda los equipos guardados
                eventFichas, // Guarda las fichas de evento generales
                betaEventProgress, // Guarda el progreso del evento Beta
                championsTokens, // <-- GUARDA FICHAS CHAMPIONS
                claimedEventPlayers, // <-- GUARDA JUGADORES DE EVENTO RECLAMADOS
                legendTasksProgress, // <-- GUARDA PROGRESO DE TAREAS DE LEYENDA
                legendRewardClaimed, // <-- GUARDA ESTADO DE RECOMPENSA DE LEYENDA RECLAMADA
                claimedLegendPlayerId, // <-- GUARDA ID DEL JUGADOR LEGENDARIO RECLAMADO
                                betaFichas, setBetaFichas
                // cooldowns, // <-- GUARDA ESTADO DE COOLDOWNS si lo implementas
            };
            // Guarda el objeto completo serializado
           await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(stateToSave));
            // console.log('Estado del juego principal guardado correctamente.'); // Descomentar para debug
        } catch (e) {
            console.error('Error al guardar el estado del juego principal:', e);
            // Opcional: Mostrar un mensaje de error al usuario
        }
    }, [
        // --- DEPENDENCIAS DE GUARDADO ---
        // Lista todos los estados que, cuando cambian, deben activar el guardado
        coins,
        collection,
        team,
        currentFormation,
        savedTeams,
        eventFichas,
        betaEventProgress,
        championsTokens, // <-- DEPENDENCIA DE FICHAS CHAMPIONS
        claimedEventPlayers, // <-- DEPENDENCIA DE JUGADORES DE EVENTO RECLAMADOS
        legendTasksProgress, // <-- DEPENDENCIA DE PROGRESO DE TAREAS DE LEYENDA
        legendRewardClaimed, // <-- DEPENDENCIA DE ESTADO DE RECOMPENSA DE LEYENDA RECLAMADA
        claimedLegendPlayerId, // <-- DEPENDENCIA DE ID DEL JUGADOR LEGENDARIO RECLAMADO
                        betaFichas
        // cooldowns, // <-- DEPENDENCIA DE COOLDOWNS si lo implementas
    ]);


    // --- Funciones de Juego Generales (Monedas, Cartas, Equipo, Códigos) ---

    // Añade monedas
    const addCoins = (amount) => {
         if (typeof amount !== 'number' || amount < 0) {
             console.warn("addCoins: Cantidad inválida", amount);
             return;
         }
         setCoins(prev => prev + amount);
         // console.log(`Monedas añadidas: ${amount}. Total: ${coins + amount}`); // Cuidado, coins aquí es el valor viejo
    };

    // Resta monedas, retorna true si fue posible, false si no
    const subtractCoins = (amount) => {
         if (typeof amount !== 'number' || amount < 0) {
              console.warn("subtractCoins: Cantidad inválida", amount);
              return false;
         }
         if (coins >= amount) {
             setCoins(prev => prev - amount);
             // console.log(`Monedas restadas: ${amount}. Total: ${coins - amount}`); // Cuidado, coins aquí es el valor viejo
             return true; // Éxito
         }
         console.warn(`No hay suficientes monedas para restar ${amount}. Tienes ${coins}.`);
         // Opcional: Mostrar un mensaje al usuario "No tienes suficientes monedas"
         return false; // Falla
    };

    // Asegúrate de que addCard reciba los DATOS BASE de la carta y asigne un instanceId único
const addCard = (cardData) => {
    if (!cardData || typeof cardData.id === 'undefined' || typeof cardData.rating === 'undefined') {
        console.error("addCard requiere cardData válida con 'id' y 'rating'.", cardData);
        Alert.alert("Error", "No se pudo añadir la carta.");
        return;
    }
    const newCard = {
        ...cardData,
instanceId: `${cardData.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isTradable: cardData.isTradable !== undefined ? cardData.isTradable : true,
        isLocked: false,
    };
    setCollection(prevCards => {
        const updated = [...prevCards, newCard];
        console.log(`addCard: Añadiendo carta ${newCard.name} con instanceId ${newCard.instanceId}. Nueva colección total: ${updated.length}`);
        // console.log("addCard: Contenido actual de la colección después de añadir (primeros 3 IDs):", updated.slice(0,3).map(c => c.instanceId)); // Descomentar para ver más detalle
        return updated;
    });
};

    // Remueve una carta de la colección por su instanceId único
   const removeCard = (instanceId) => {
         if (!instanceId) {
             console.warn("removeCard requiere un instanceId.");
             return false;
         }
         const initialLength = collection.length;
         setCollection(prevCards => prevCards.filter(card => card.instanceId !== instanceId));
         const removedSuccessfully = collection.length < initialLength; // Comprueba si el tamaño disminuyó
         if (!removedSuccessfully) {
             console.warn(`No se encontró carta con instanceId ${instanceId} para remover.`);
         }
         return removedSuccessfully;
    };

     // Vende una carta de la colección por su instanceId, otorga monedas
// Dentro de tu GameProvider
const sellCard = (instanceId) => {
    console.log(`sellCard: Intentando vender carta con instanceId: '${instanceId}'`);
    console.log("sellCard: Colección actual (solo instanceIds):", collection.map(c => c.instanceId)); // Loggea solo los IDs para no saturar

    const cardToSell = collection.find(card => card.instanceId === instanceId);

    if (cardToSell) {
        if (cardToSell.isLocked) {
            console.warn(`sellCard: Carta ${instanceId} está bloqueada.`);
            Alert.alert("No se puede vender", "Esta carta está bloqueada.");
            return 0;
        }
        const sellValue = calculateSellValue(cardToSell.rating);
        addCoins(sellValue);
        removeCard(instanceId); // Esta función es la que realmente filtra y actualiza el estado
        console.log(`sellCard: Carta <span class="math-inline">\{cardToSell\.name\} \(</span>{instanceId}) VENDIDA por ${sellValue} monedas.`);
        Alert.alert("Carta vendida", `Vendiste ${cardToSell.name} por ${sellValue} monedas.`);
        return sellValue;
    }
    console.warn(`sellCard: ERROR - No se encontró carta con instanceId '${instanceId}' para vender.`);
    Alert.alert("Error", "No se encontró la carta para vender.");
    return 0;
};

    // Calcula el valor de venta de una carta basada en su rating
const calculateSellValue = (grl) => {
  if (grl < 75) { // Para GRL de 0 a 74
    return 1;
  } else if (grl >= 75 && grl <= 79) { // GRL 75 a 79
    return 3;
  } else if (grl >= 80 && grl <= 82) { // GRL 80 a 82
    return 4;
  } else if (grl >= 83 && grl <= 85) { // GRL 83 a 85
    return 5;
  } else if (grl >= 86 && grl <= 88) { // GRL 86 a 88
    return 10;
  } else if (grl >= 89 && grl <= 90) { // GRL 89 a 90
    return 15;
  } else if (grl === 91) { // GRL 91
    return 20;
  } else if (grl === 92) { // GRL 92
    return 25;
  } else if (grl === 93) { // GRL 93
    return 50;
  } else if (grl === 94) { // GRL 94
    return 80;
  } else if (grl >= 95) { // GRL 95 y superior
    return 100;
  } else {
    // Para cualquier otro GRL que no esté en los rangos definidos (por ejemplo, GRL negativo o muy alto no previsto)
    console.warn(`GRL no reconocido: ${grl}. Devolviendo 1 moneda por defecto.`);
    return 1;
  }
};

    // Función para añadir jugador al equipo usando el instanceId de la carta
const addPlayerToTeam = (position, player) => {
    // Verificar si la posición es válida (existe como clave en el estado 'team')
    if (!team.hasOwnProperty(position)) {
      console.warn(`Posición inválida: ${position}`);
      return;
    }

    // Opcional: Verificar si el jugador ya está en el equipo en OTRA posición
    const isPlayerAlreadyInTeam = Object.entries(team).some(([pos, currentPlayer]) =>
      currentPlayer?.id === player.id && pos !== position
    );
    if (isPlayerAlreadyInTeam) {
      console.warn(`El jugador ${player.name} ya está en el equipo en otra posición.`);
      Alert.alert("Error", "Este jugador ya está en el equipo.");
      return;
    }

    setTeam(prevTeam => ({
      ...prevTeam,
      [position]: player, // Almacena el objeto del jugador directamente
    }));
    console.log(`Jugador ${player.name} añadido a la posición ${position}.`);
  };


    // Función para remover jugador del equipo por posición
    const removePlayerFromTeam = (position) => {
         // Verificar si la posición es válida
         const validPositions = Object.keys(team);
         if (!validPositions.includes(position)) {
             console.warn(`Posición inválida: ${position}`);
             return;
         }
        setTeam(prevTeam => ({
            ...prevTeam,
            [position]: null, // Establece la posición a null
        }));
        console.log(`Jugador removido de la posición ${position}.`);
    };

    // Cambia la formación del equipo
    const changeFormation = (formation) => {
        if (availableFormations.includes(formation)) {
            setCurrentFormation(formation);
             // ** Lógica Importante Aquí **
             // Cuando cambias de formación, las posiciones pueden cambiar o desaparecer.
             // Debes revisar el 'team' actual y quizás remover jugadores de posiciones que ya no existen en la nueva formación.
             // Esto puede ser complejo y quizás quieras manejarlo en la UI o en una función separada
             console.log(`Formación cambiada a ${formation}.`);
        } else {
            console.warn(`Formación "${formation}" no disponible.`);
            Alert.alert("Error", "Formación no disponible.");
        }
    };


    // Guarda el equipo actual con un nombre dado
    const saveTeam = (teamName) => {
        if (!teamName || teamName.trim() === '') {
            console.warn("Se requiere un nombre para guardar el equipo.");
            Alert.alert("Error", "Por favor, dale un nombre al equipo.");
            return false;
        }
         // Opcional: Limitar el número de equipos guardados
         // Opcional: Verificar si ya existe un equipo con ese nombre y pedir confirmación para sobrescribir

        setSavedTeams(prevSavedTeams => ({
            ...prevSavedTeams,
            [teamName.trim()]: team, // Guarda el estado actual del equipo (que contiene instancias)
        }));
        console.log(`Equipo "${teamName}" guardado.`);
        Alert.alert("Equipo Guardado", `El equipo "${teamName}" ha sido guardado.`);
        return true;
    };

    // Carga un equipo guardado por nombre
    const loadTeam = (teamName) => {
         if (!teamName || !savedTeams[teamName]) {
             console.warn(`No se encontró un equipo guardado con el nombre "${teamName}".`);
             Alert.alert("Error", `No se encontró el equipo "${teamName}".`);
             return false; // Indica que no se pudo cargar
         }

         // ** Lógica de Validación Importante **
         // Cuando cargas un equipo guardado, debes verificar si las cartas (por instanceId) todavía existen en la colección del jugador.
         const savedTeamData = savedTeams[teamName];
         const loadedTeam = {};
         let missingCards = 0;

         for (const position in savedTeamData) {
             const playerInstance = savedTeamData[position]; // Esto es la instancia guardada
             if (playerInstance && playerInstance.instanceId) {
                 // Buscar la instancia CORRESPONDIENTE en la colección ACTUAL del jugador
                 const cardInCurrentCollection = collection.find(card => card.instanceId === playerInstance.instanceId);
                 if (cardInCurrentCollection) {
                     loadedTeam[position] = cardInCurrentCollection; // Usar la instancia *actual* de la colección
                 } else {
                      // La carta guardada ya no existe en la colección actual
                      loadedTeam[position] = null;
                      missingCards++;
                      console.warn(`Carta "${playerInstance.name}" (${playerInstance.instanceId}) en la posición ${position} del equipo guardado "${teamName}" no encontrada en la colección actual.`);
                 }
             } else {
                  // La posición estaba vacía o los datos guardados eran inválidos
                  loadedTeam[position] = null;
             }
         }

        setTeam(loadedTeam); // Carga el equipo (con las instancias válidas o nulls)
        console.log(`Equipo "${teamName}" cargado.`);
        if (missingCards > 0) {
            Alert.alert("Equipo Cargado", `"${teamName}" cargado, pero ${missingCards} carta(s) no se encontraron en tu colección.`);
        } else {
             Alert.alert("Equipo Cargado", `El equipo "${teamName}" ha sido cargado.`);
        }
        return true; // Indica que se intentó cargar (puede haber cartas faltantes)
    };

     // Aplica un código promocional
     const applyCode = (code) => {
         // Tu lógica de aplicación de códigos (ej. verificar si es un código válido, si ya fue usado)
         // ** Necesitarías manejar el estado de los códigos usados en AsyncStorage también para persistencia **
         console.log(`Intentando aplicar código: ${code}`);
         const usedCodesKey = 'usedPromoCodes';

         const handleApply = async () => {
             try {
                 const storedUsedCodes = await AsyncStorage.getItem(usedCodesKey);
                 const usedCodes = storedUsedCodes ? JSON.parse(storedUsedCodes) : {};

                 // --- Lógica de Validación del Código ---
                 const validCodesData = {
                     "BETA-COINS-1000": { type: 'coins', amount: 1000 }, // No necesitas 'used' aquí si lo manejas en storage
                     "BETA-PACK-1": { type: 'pack', packId: 'starter_pack' }, // Ejemplo de pack
                     // ... otros códigos válidos ...
                 };
                 const codeData = validCodesData[code];

                 if (!codeData) {
                     Alert.alert('Código Inválido', 'El código ingresado no es válido.');
                     return { success: false, title: 'Código Inválido', message: 'El código ingresado no es válido.' };
                 }
                 if (usedCodes[code]) {
                     Alert.alert('Código Ya Usado', 'Este código ya ha sido utilizado.');
                     return { success: false, title: 'Código Ya Usado', message: 'Este código ya ha sido utilizado.' };
                 }
                 // --- Fin Validación ---


                 // --- Aplicar Recompensa ---
                 if (codeData.type === 'coins') {
                     addCoins(codeData.amount);
                     Alert.alert('Código Aplicado', `Has recibido ${codeData.amount} monedas!`);
                 } else if (codeData.type === 'pack') {
                     // Necesitas una función para abrir paquetes (definida quizás aquí o en otro archivo de lógica)
                     // openPack(codeData.packId); // Llama a tu función para abrir paquetes
                     Alert.alert('Código Aplicado', `Has recibido el paquete "${codeData.packId}"! (Lógica de apertura pendiente)`);
                 }
                 // ... maneja otros tipos de recompensa ...

                 // --- Marcar Código Como Usado ---
                 usedCodes[code] = true; // Marca como usado
                 await AsyncStorage.setItem(usedCodesKey, JSON.stringify(usedCodes)); // Guarda la lista actualizada

                 console.log(`Código aplicado con éxito: ${code}`);
                 return { success: true, title: 'Código Aplicado', message: 'Recompensa recibida!' };

             } catch (e) {
                 console.error("Error al aplicar código:", e);
                 Alert.alert("Error", "No se pudo aplicar el código.");
                 return { success: false, title: 'Error', message: 'Ocurrió un error al aplicar el código.' };
             }
         };

         // Ejecuta la función async interna
         handleApply();

         // Puedes devolver un valor inicial o manejar el resultado de handleApply con .then()/.catch()
         // Aquí retornamos un placeholder síncrono, la alerta es la principal feedback al usuario
         return { success: false, title: 'Procesando', message: 'Aplicando código...' };
     };


    // --- Funciones de SBC (Wrapper para llamar a la lógica importada) ---

    // ** loadSBCs (¡Esta es la función que te falta o está mal ubicada!) **
    const loadSBCs = useCallback(async () => {
        console.log("GameProvider: Intentando cargar SBCs...");
        try {
            const storedSBCs = await AsyncStorage.getItem(STORAGE_KEYS.SBC_LIST);
            if (storedSBCs !== null) {
                const parsedSBCsState = JSON.parse(storedSBCs);

                const mergedSBCs = ALL_INITIAL_SBCS_DATA.map(initialSbc => {
                    const storedSbcState = parsedSBCsState.find(loadedSbc => loadedSbc.id === initialSbc.id);
                    return {
                        ...initialSbc,
                        isCompleted: storedSbcState?.isCompleted ?? initialSbc.isCompleted ?? false,
                        completedBy: storedSbcState?.completedBy ?? initialSbc.completedBy ?? [],
                        timesCompleted: storedSbcState?.timesCompleted ?? initialSbc.timesCompleted ?? 0,
                        isRepeatable: initialSbc.isRepeatable ?? false,
                    };
                });
                setSbcList(mergedSBCs);
                console.log(`GameProvider: SBCs cargados y fusionados: ${mergedSBCs.length} SBCs.`);
            } else {
                setSbcList(ALL_INITIAL_SBCS_DATA);
                console.log(`GameProvider: No se encontraron SBCs guardados. Inicializando con ${ALL_INITIAL_SBCS_DATA.length} SBCs iniciales.`);
                await AsyncStorage.setItem(STORAGE_KEYS.SBC_LIST, JSON.stringify(ALL_INITIAL_SBCS_DATA.map(sbc => ({
                    id: sbc.id,
                    isCompleted: sbc.isCompleted || false,
                    completedBy: sbc.completedBy || [],
                    timesCompleted: sbc.timesCompleted || 0,
                }))));
            }
        } catch (e) {
            console.error("GameProvider: Error al cargar los SBCs:", e);
            Alert.alert("Error de Carga", "No se pudieron cargar los desafíos SBC. Iniciando con los predeterminados.");
            setSbcList(ALL_INITIAL_SBCS_DATA.map(sbc => ({
                ...sbc,
                isCompleted: false,
                completedBy: [],
                timesCompleted: 0,
                isRepeatable: sbc.isRepeatable ?? false,
            })));
        }
    }, []);

    const completeSBC = useCallback((sbcId, submittedCards) => {
        const sbc = sbcList.find(sbc => sbc.id === sbcId);
        if (!sbc) {
            console.warn(`SBC con ID ${sbcId} no encontrado al intentar completar.`);
            return;
        }

        // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
        // Llama a la función de lógica de SBC y espera el OBJETO de respuesta
        const sbcResult = processSBCLogic( // <-- Usamos el nombre renombrado aquí
            sbcId,
            submittedCards,
            sbcList, // currentSbcList
            collection, // currentPlayerCollection
            getPlayerById // <-- Esta función SÍ se necesita aquí para que sbcLogic.js la use
        );

        if (sbcResult.success) {
            // Si la lógica del SBC fue exitosa, actualiza los estados con los datos del OBJETO de respuesta
            setSbcList(sbcResult.updatedSbcList);
            // La colección del jugador se actualiza aquí
            setCollection(sbcResult.newPlayerCollection); // <-- Asigna la colección actualizada
            setCoins(prevCoins => prevCoins + sbcResult.coinsEarned); // Añade las monedas ganadas

            // Aquí puedes añadir más lógica si `packsEarned` o `eventFichasEarned` no se manejan
            // directamente por los callbacks (aunque los callbacks son más limpios).
            // Si `addPlayersToInventory` y `removePlayersFromInventory` ya se usan dentro de sbcLogic.js
            // y modifican el estado de `collection` y `coins` directamente (lo cual es mejor),
            // entonces `newPlayerCollection` y `coinsEarned` ya estarían actualizados y no necesitarías las líneas de arriba.
            // PERO, según tu sbcLogic.js, `newPlayerCollection` y `coinsEarned` se CALCULAN y se retornan.
            // Por lo tanto, necesitas ASIGNARLOS aquí.

            console.log(`SBC ${sbcId} completado y estados actualizados.`);
        } else {
            console.warn(`SBC ${sbcId} no se pudo completar: ${sbcResult.message}`);
            // El mensaje de error ya se muestra en sbcLogic.js, así que no necesitas un Alert aquí.
        }
    }, [sbcList, collection, setCoins, getPlayerById, addPlayerToInventory, removePlayersFromInventory]); // Dependencias

const loadGameState = useCallback(async () => {
    try {
        const storedState = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
        if (storedState !== null) {
            const state = JSON.parse(storedState);

            setCoins(state.coins !== undefined ? state.coins : 1000);
            setCollection(state.collection || []);

            // --- ¡AQUÍ ESTÁ LA CLAVE! ---
            // Fusiona el team cargado con ALL_POSITIONS_INITIAL_STATE
            // Esto asegura que todas las claves existan y sean null si no están en el estado guardado.
            setTeam({ ...ALL_POSITIONS_INITIAL_STATE, ...(state.team || {}) });
            // --- FIN CLAVE ---

            setCurrentFormation(state.currentFormation || '4-3-3');
            setSavedTeams(state.savedTeams || {});
            setEventFichas(state.eventFichas !== undefined ? state.eventFichas : 0);
            setBetaEventProgress(prev => ({
                ...prev,
                ...(state.betaEventProgress || {})
            }));
            setChampionsTokens(state.championsTokens !== undefined ? state.championsTokens : 0);
            setClaimedEventPlayers(state.claimedEventPlayers || {});
            setLegendTasksProgress(state.legendTasksProgress || {});
            setLegendRewardClaimed(state.legendRewardClaimed !== undefined ? state.legendRewardClaimed : false);
            setClaimedLegendPlayerId(state.claimedLegendPlayerId !== undefined ? state.claimedLegendPlayerId : null);
            console.log("GameContext: Colección cargada desde AsyncStorage:", loadedState.collection?.length, "cartas.");
            console.log("GameContext: Primeras 5 cartas cargadas (instanceId):", loadedState.collection?.slice(0, 5).map(c => c.instanceId));

            console.log('Estado del juego principal cargado correctamente.');
        } else {
            console.log('No se encontró estado de juego principal guardado. Usando estado inicial.');
            // En este caso, el `useState(ALL_POSITIONS_INITIAL_STATE)` ya habrá inicializado correctamente.
        }
    } catch (e) {
        console.error('Error al cargar el estado del juego principal:', e);
        Alert.alert("Error Crítico", "No se pudo cargar tu progreso guardado. El juego iniciará con progreso nuevo. Si este problema persiste, contacta soporte.");
        // Asegúrate de resetear el equipo a ALL_POSITIONS_INITIAL_STATE también en caso de error
        setCoins(10);
        setCollection([]);
        setTeam(ALL_POSITIONS_INITIAL_STATE); // ¡IMPORTANTE AQUÍ TAMBIÉN!
        setCurrentFormation('4-3-3');
        setSavedTeams({});
        setEventFichas(0);
        setBetaEventProgress({ /* estructura inicial */ }); // O usa los valores de ALL_POSITIONS_INITIAL_STATE
        setChampionsTokens(0);
        setClaimedEventPlayers({});
        setLegendTasksProgress({});
        setLegendRewardClaimed(false);
        setClaimedLegendPlayerId(null);
    }
}, []);
    // ** Función para CARGAR SBCs (¡Esta es la CORRECTA y UNIFICADA!) **

// ... some code
const loadMusicVolume = async () => {
    try {
        const storedVolume = await AsyncStorage.getItem('musicVolume');
        if (storedVolume !== null) {
            const parsedVolume = parseFloat(storedVolume);
            setMusicVolume(parsedVolume);
            if (backgroundMusicRef.current._loaded) {
                await backgroundMusicRef.current.setVolumeAsync(parsedVolume);
            }
        }
    } catch (e) {
        console.error("Error al cargar volumen de música desde AsyncStorage", e);
    }
// MISSING CLOSING CURLY BRACE HERE }
}; // <-- THIS IS THE END OF THE FUNCTION, BUT THE } IS MISSING ABOVE IT!
loadMusicVolume();

    useEffect(() => {
        const saveMusicVolume = async () => {
            try {
                await AsyncStorage.setItem('musicVolume', musicVolume.toString());
            } catch (e) {
                console.error("Error al guardar volumen de música en AsyncStorage", e);
            }
        };
        saveMusicVolume();
    }, [musicVolume]); // Guarda el volumen cada vez que cambia

    const saveSBCsToStorage = useCallback(async (sbcListToSave) => {
        try {
            // ¡AQUÍ ESTÁ LA CLAVE! Re-verifica que es un array.
            // Aunque ya lo chequees afuera, este es el último filtro.
            if (Array.isArray(sbcListToSave)) { // <-- ¡Usa Array.isArray para una verificación robusta!
                const stateToSave = sbcListToSave.map(sbc => ({
                    id: sbc.id,
                    isCompleted: sbc.isCompleted || false,
                    completedBy: sbc.completedBy || [],
                    timesCompleted: sbc.timesCompleted || 0,
                }));
                await AsyncStorage.setItem(STORAGE_KEYS.SBC_LIST, JSON.stringify(stateToSave));
                // console.log('GameContext: Estado de lista de SBCs guardado correctamente.');
            } else {
                console.error("GameContext: saveSBCsToStorage recibió un valor no array para guardar:", sbcListToSave);
            }
        } catch (e) {
            console.error('GameContext: Error al guardar el estado de la lista de SBCs:', e);
            Alert.alert("Error de Guardado", "No se pudo guardar el progreso de los desafíos SBC.");
        }
    }, []); // Dependencias: Array vacío, está bien para esta función.

    // --- Funciones para Eventos ---
    // Suma fichas generales de evento
    const addEventFichas = (amount) => {
        if (typeof amount !== 'number' || amount <= 0) { // Fichas a sumar deben ser positivas
             console.warn("addEventFichas: Cantidad inválida o no positiva", amount);
             return;
        }
        setEventFichas(prev => prev + amount);
        console.log(`Fichas de evento añadidas: ${amount}. Total: ${eventFichas + amount}`); // Cuidado con el valor viejo
    };

    // Resta fichas generales de evento, retorna true si fue posible, false si no
    const subtractEventFichas = (amount) => {
         if (typeof amount !== 'number' || amount <= 0) { // Fichas a restar deben ser positivas
              console.warn("subtractEventFichas: Cantidad inválida o no positiva", amount);
              return false;
         }
         if (eventFichas >= amount) {
             setEventFichas(prev => prev - amount);
             console.log(`Fichas de evento restadas: ${amount}. Total: ${eventFichas - amount}`); // Cuidado con el valor viejo
             return true; // Éxito
         }
         console.warn(`No hay suficientes fichas de evento para restar ${amount}. Tienes ${eventFichas}.`);
         // Opcional: Mostrar mensaje al usuario
         return false; // Falla
    };

const updateBetaGameProgress = (gameId, completionDetails = {}) => { // <-- Llave de apertura añadida aquí
    if (!Object.values(BETA_MINIGAMES).includes(gameId)) {
        console.warn(`updateBetaGameProgress: ID de minijuego desconocido para el evento Beta: ${gameId}. No se actualiza el progreso.`);
        Alert.alert("Error Interno", "Intento de actualizar progreso de minijuego desconocido.");
        return; // Sale de la función si el ID no es válido
    }

    // 2. Si el ID es válido, actualiza el estado betaEventProgress
    setBetaEventProgress(prevProgress => {
        const now = new Date().toISOString(); // Marca el momento de completación

        // Crea un nuevo objeto de progreso basado en el estado anterior
        const updatedProgress = {
            ...prevProgress, // Copia todo el progreso anterior
            // Actualiza el progreso específico del minijuego que se acaba de completar
            [gameId]: { // Usa el gameId recibido como clave (ej. 'beta_pases')
                count: (prevProgress[gameId]?.count || 0) + 1, // Incrementa el contador de ese minijuego
                lastCompleted: now, // Guarda la marca de tiempo de la última completación
                ...completionDetails // Fusiona cualquier detalle adicional (ej. puntuación, tiempo) que la pantalla pueda pasar
            },
        };

        // --- Lógica Específica para el Progreso hacia la Recompensa Final ---
        // Tu lógica actual se basa en el contador del minijuego de portero (BETA_MINIGAMES.GAME6)
        const porteroGameId = BETA_MINIGAMES.GAME6; // Obtiene el ID string del juego de portero
        const porteroProgressCount = updatedProgress[porteroGameId]?.count || 0; // Obtiene el contador actual del portero

        // El progreso de la recompensa final es igual al contador del minijuego de portero
        updatedProgress.finalRewardProgress = porteroProgressCount;

        // --- Registro y Verificación de Desbloqueo (Dentro del actualizador de estado) ---
        console.log(`Progreso Beta Evento actualizado para ${gameId}. Contador total para este minijuego: ${updatedProgress[gameId].count}.`);
        console.log(`Progreso para Recompensa Final (Portero): ${updatedProgress.finalRewardProgress}/${updatedProgress.finalRewardRequired}`);

        // Verifica si se han cumplido los requisitos para la recompensa final
        // (Esto solo loguea y muestra una alerta, no reclama la recompensa - eso lo hace claimBetaFinalReward)
        if (updatedProgress.finalRewardProgress >= updatedProgress.finalRewardRequired && !updatedProgress.finalRewardClaimed) {
             console.log("¡Recompensa final del Evento Beta desbloqueada (requisitos cumplidos)!");
             // Considera mostrar una alerta de que *se ha desbloqueado*, no que se ha recibido aún.
             // Alert.alert("¡Recompensa Desbloqueada!", "Has completado los requisitos para reclamar la recompensa final del evento Beta.");
        }

        // Devuelve el NUEVO estado del progreso del evento Beta
        return updatedProgress;
    });

    // Nota: Esta función NO devuelve nada explícitamente.
    // La actualización del estado (setBetaEventProgress) es asíncrona.
};

// Función para reclamar la recompensa final del Evento Beta
const claimBetaFinalReward = (rewardChoice) => { // rewardChoice podría ser un objeto indicando la elección del jugador
    console.log("Intentando reclamar recompensa final Beta Evento.");

    setBetaEventProgress(prevProgress => {
        // Verifica si los requisitos se cumplen (progreso >= requerido)
        // Y si la recompensa NO ha sido reclamada aún
        if (prevProgress.finalRewardProgress >= prevProgress.finalRewardRequired && !prevProgress.finalRewardClaimed) {
            // --- Lógica para otorgar la recompensa ---
            console.log(`Recompensa final del Evento Beta reclamada. Elección: ${rewardChoice?.id || JSON.stringify(rewardChoice)}`);

            // Ejemplo de cómo otorgar la recompensa (adaptar a tu estructura de recompensaChoice)
            if (rewardChoice && rewardChoice.type === 'coins' && rewardChoice.amount !== undefined) {
                addCoins(rewardChoice.amount); // Usar la función addCoins del contexto
                console.log(`Otorgadas ${rewardChoice.amount} monedas.`);
                Alert.alert("Recompensa Recibida", `Has recibido ${rewardChoice.amount} monedas!`);
            } else if (rewardChoice && rewardChoice.type === 'card' && rewardChoice.cardData) {
                // Asegúrate de que rewardChoice.cardData contiene los datos base de la carta { id, name, rating, ... }
                addCard(rewardChoice.cardData); // Usar la función addCard del contexto
                console.log(`Otorgada carta: ${rewardChoice.cardData.id}`);
                Alert.alert("Recompensa Recibida", `Has recibido la carta de ${rewardChoice.cardData.name}!`);
            } else {
                console.warn("claimBetaFinalReward: Tipo de recompensa no manejado o rewardChoice inválido.", rewardChoice);
                Alert.alert("Error", "No se pudo otorgar la recompensa.");
            }
            // --- Fin Lógica para otorgar la recompensa ---

            // Actualiza el estado para marcar como reclamada y guardar la elección
            return {
                ...prevProgress,
                finalRewardClaimed: true,
                finalRewardChoice: rewardChoice?.id || 'N/A', // Guarda un identificador de la elección
            };

        } else {
            // Si no se cumplen los requisitos o ya se reclamó
            if (prevProgress.finalRewardClaimed) {
                console.warn("claimBetaFinalReward: La recompensa final del Evento Beta ya fue reclamada.");
                Alert.alert("Ya Reclamada", "Ya has reclamado la recompensa final de este evento.");
            } else {
                console.warn(`claimBetaFinalReward: Requisitos no cumplidos. Necesitas ${prevProgress.finalRewardRequired}, tienes ${prevProgress.finalRewardProgress}.`);
                Alert.alert("Requisitos Pendientes", `Necesitas completar el minijuego de portero ${prevProgress.finalRewardRequired} veces para reclamar.`); // Adaptar mensaje si el requisito cambia
            }
        }
        return prevProgress; // Devuelve el estado sin cambios si no se reclama
    });
};

    // --- Fin Funciones para Eventos ---
    // --- Implementación de Funciones de Cooldown ---
    const isCooldownActive = async (gameId) => {
        console.log(`[Cooldown] Chequeando cooldown para: ${gameId}`);
        try {
const storedCooldowns = await AsyncStorage.getItem(STORAGE_KEYS.COOLDOWNS);
            const cooldowns = storedCooldowns ? JSON.parse(storedCooldowns) : {};

            const lastCompletionTime = cooldowns[gameId];

            if (!lastCompletionTime) {
                console.log(`[Cooldown] No hay registro de completación para ${gameId}. Sin cooldown.`);
                return false;
            }

            const now = Date.now();
            // Parsear la fecha guardada (ISO string) y añadir la duración del cooldown
            const completionTimestamp = new Date(lastCompletionTime).getTime();
            const expiryTime = completionTimestamp + COOLDOWN_DURATION;

            const active = now < expiryTime;
            console.log(`[Cooldown] ${gameId}: Última completación: ${lastCompletionTime}, Expira: ${new Date(expiryTime).toISOString()}. Activo: ${active}`);
            return active;

        } catch (e) {
            console.error(`[Cooldown] Error al chequear cooldown para ${gameId}:`, e);
            // En caso de error, asumimos que no hay cooldown activo
            return false;
        }
    };

    const setCooldown = async (gameId) => {
         console.log(`[Cooldown] Estableciendo cooldown para: ${gameId}`);
        try {
            const storedCooldowns = await AsyncStorage.getItem(COOLDOWN_STORAGE_KEY);
            const cooldowns = storedCooldowns ? JSON.parse(storedCooldowns) : {};

            const now = new Date().toISOString(); // Guarda la fecha/hora actual en formato ISO

            cooldowns[gameId] = now; // Registra la última completación para este gameId

            await AsyncStorage.setItem(STORAGE_KEYS.COOLDOWNS, JSON.stringify(cooldowns));
            console.log(`[Cooldown] Cooldown establecido para ${gameId}. Registro: ${now}`);
        } catch (e) {
            console.error(`[Cooldown] Error al establecer cooldown para ${gameId}:`, e);
             Alert.alert("Error", "No se pudo guardar el estado de completado del desafío.");
        }
    };
    // --- Fin Implementación de Funciones de Cooldown ---
    const executeCompleteSBC = useCallback((sbcId, submittedCards) => {
         // Llama a la función completeSBC importada, pasándole todos los argumentos
         return runCompleteSBC(
             sbcId,
             submittedCards,
             sbcList, // Estado sbcList del contexto
             playerCollection, // Estado playerCollection del contexto
             setSbcList, // Setter para sbcList
             setPlayerCollection, // Setter para playerCollection
             updateLegendTaskProgress, // Función para actualizar tareas de leyenda
             addCoins, // Función para añadir monedas
             addEventFichas, // Función para añadir fichas de evento
             addCard // Función para añadir carta
         );
    }, [sbcList, playerCollection, setSbcList, setPlayerCollection, updateLegendTaskProgress, addCoins, addEventFichas, addCard]); // Dependencias: todos los estados y setters usados por runCompleteSBC

    // --- Valor proporcionado por el contexto ---
    return (
        <GameContext.Provider
            value={{
                // --- Estados ---
                coins, // Moneda principal
                collection, // Colección completa de cartas (instan
                playerCollection,
                playerCards: collection, // Alias para 'collection' si lo usas en algunos componentes
                team, // Equipo actual (instancias en posiciones)
                currentFormation, // Formación seleccionada
                availableFormations, // Formaciones disponibles
                savedTeams, // Equipos guardados
                sbcList, // Lista de SBCs y su estado
                // --- Estados de evento ---
                eventFichas, // Moneda/Tokens generales de evento
                betaEventProgress, // Progreso del evento "Bienvenido a la Beta"

                // --- Funciones generales del juego ---
                addCard, // Añade una carta a la colección (recibe datos base, asigna instanceId)
                removeCard, // Remueve una carta de la colección (recibe instanceId)
                addCoins, // Añade monedas
                subtractCoins, // Resta monedas (retorna éxito)
                addPlayerToTeam, // Añade una carta (instancia) al equipo (recibe posición y instancia)
                removePlayerFromTeam, // Remueve jugador del equipo (recibe posición)
                changeFormation, // Cambia la formación
                sellCard, // Vende una carta (recibe instanceId)
                calculateSellValue, // Calcula valor de venta
                saveTeam, // Guarda el equipo actual (recibe nombre)
                loadTeam, // Carga un equipo guardado (recibe nombre)
                applyCode, // Aplica un código promocional
                loadSBCs, // Carga los SBCs iniciales y guardados (wrapper)
                completeSBC, // Completa un SBC (wrapper, llama a sbcLogic)
                // --- FUNCIONES DE COOLDOWN AÑADIDAS AQUÍ ---
                isCooldownActive, // <-- ¡Añadida!
                setCooldown, // <-- ¡Añadida!
        // Valores y funciones para el Camino de Leyenda
        legendTasksProgress, // Progreso de las tareas de leyenda
        areLegendTasksCompleted, // Estado si todas las tareas de leyenda están completadas
        legendRewardClaimed, // Estado si la recompensa de leyenda ha sido reclamada
        claimLegendReward, // Función para reclamar la recompensa de leyenda
        claimedLegendPlayerId, // ID del jugador legendario reclamado
        updateLegendTaskProgress, // Función para actualizar el progreso de tareas de leyenda
              championsTokens, // El estado de las fichas Champions
      subtractChampionsTokens, // Función para restar fichas Champions
      addChampionsTokens, // Función para sumar fichas Champions
      claimedEventPlayers, // Estado de jugadores del evento Champions reclamados
      markEventPlayerAsClaimed, // Función para marcar como reclamado
            addPlayerToInventory, // Función para añadir jugadores (implementar lógica real)
      removePlayersFromInventory, // Función para eliminar jugadores (implementar lógica real)
                // --- Funciones de evento ---
                setEventFichas, // Establece la cantidad de fichas generales (usar con precaución)
                addEventFichas, // Suma fichas generales
                subtractEventFichas, // Resta fichas generales (retorna éxito)
                updateBetaGameProgress, // Actualiza el progreso de un minijuego Beta específico
                claimBetaFinalReward, // Intenta reclamar la recompensa final del evento Beta
                getPlayerById,
                executeCompleteSBC,
                isDarkMode,
                 toggleDarkMode,
                 isMusicEnabled,
        toggleMusic,
        playBackgroundMusic,
        stopBackgroundMusic,
        currentPlayingMusicKey,
        setCurrentPlayingMusicKey,
                musicVolume,
        setBackgroundMusicVolume,
        betaFichas, setBetaFichas
            }}
        >
            {children}
        </GameContext.Provider>
    );
};


// Exportación nombrada del contexto
export default GameContext;