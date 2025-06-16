import { Alert } from 'react-native';
import { ALL_PLAYERS_DATA } from '../data/players'; // Asegúrate de que esto esté bien importado

// Tus imports de imágenes de banner de SBC (mantén los que ya tienes)
import reijndersSBCImage from '../assets/imagecartas/SBC/reijnders_potm_sbc.png';
import mastantuonoPOTMSBCImage from '../assets/imagecartas/SBC/mastantuono_potm_91.png';
import harryKanePOTMSBCImage from '../assets/imagecartas/SBC/harry_kane_potm_92.png';
import dembelePOTMSBCImage from '../assets/imagecartas/SBC/demebele_potm_91.png'; // Asegúrate que la ruta sea correcta y no tenga el typo 'demebele'
import antonyPOTMSBCImage from '../assets/imagecartas/SBC/antony_potm_90.png';
import raphinhaPOTMSBCImage from '../assets/imagecartas/SBC/raphinha_potm_92.png';
import salahPOTMSBCImage from '../assets/imagecartas/SBC/salah_potm_92.png';

// Importa ALL_PLAYERS_DATA de donde la tengas definida
// Si ALL_INITIAL_SBCS_DATA está en este mismo archivo, no hace falta importarlo.
// Si está en otro archivo, asegúrate de importarlo aquí.
// Ejemplo: import { ALL_INITIAL_SBCS_DATA } from './your_sbc_data_file';

// Función auxiliar para generar un ID único de instancia de carta
const generateUniqueInstanceId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

// --- Datos Iniciales de los SBCs ---
// Esta es la lista base de todos los SBCs disponibles en el juego.
// No se modifica directamente durante la ejecución, sino que se usa como referencia.
export const ALL_INITIAL_SBCS_DATA = [
    {
        id: 'reijnders_potm',
        name: 'Reijnders POTM (91)',
        description: 'Intercambia jugadores para conseguir a Reijnders POTM (91).',
        image: reijndersSBCImage,
        requirements: [
            { description: '8 Jugadores +75', rating_min: 75, count: 8, type: 'min_rating_count' },
            { description: '5 Jugadores +85', rating_min: 85, count: 5, type: 'min_rating_count' },
            { description: '1 Jugador +89', rating_min: 89, count: 1, type: 'min_rating_count' },
        ],
        reward: { type: 'card', cards: [{ id: 'reijnders_potm_91' }], },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
    {
        id: 'mastantuono_potm',
        name: 'Mastantuono POTM (91)',
        description: 'Consigue la carta POTM de Mastantuono (91).',
        image: mastantuonoPOTMSBCImage,
        requirements: [
            {
                description: 'Talento Joven Argentino',
                slots: 11,
                type: 'complex',
                requiredRatings: [
                    { rating: 75, count: 5 },
                    { rating: 83, count: 3 },
                    { rating: 85, count: 1 },
                ],
                nations: ['Argentina'],
                nationCount: 3,
            },
        ],
        reward: {
            type: 'card',
            cards: [{
                id: 'mastantuono_potm_91',
            }],
        },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
    {
        id: 'harry_kane_potm',
        name: 'Harry Kane POTM (92)',
        description: 'Consigue la carta POTM de Harry Kane (92).',
        image: harryKanePOTMSBCImage,
        requirements: [
            {
                description: 'Goleador de Clase Mundial',
                slots: 11,
                type: 'complex',
                requiredRatings: [
                    { rating: 85, count: 6 },
                    { rating: 89, count: 2 },
                ],
            },
        ],
        reward: {
            type: 'card',
            cards: [{
                id: 'harry_kane_potm_92',
            }],
        },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
    {
        id: 'dembele_potm',
        name: 'Dembélé POTM (91)',
        description: 'Consigue la carta POTM de Dembélé (91).',
        image: dembelePOTMSBCImage,
        requirements: [
            {
                description: 'Extremo Veloz',
                slots: 11,
                type: 'complex',
                requiredRatings: [
                    { rating: 84, count: 5 },
                    { rating: 86, count: 2 },
                ],
            },
        ],
        reward: {
            type: 'card',
            cards: [{
                id: 'dembele_potm_91',
            }],
        },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
    {
        id: 'antony_potm',
        name: 'Antony POTM (90)',
        description: 'Consigue la carta POTM de Antony (90).',
        image: antonyPOTMSBCImage,
        requirements: [
            {
                description: 'Habilidad y Potencial',
                slots: 11,
                type: 'complex',
                requiredRatings: [
                    { rating: 75, count: 5 },
                    { rating: 83, count: 3 },
                    { rating: 85, count: 1 },
                ],
            },
        ],
        reward: {
            type: 'card',
            cards: [{
                id: 'antony_potm_90',
            }],
        },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
    {
        id: 'raphinha_potm',
        name: 'Raphinha POTM (92)',
        description: 'Consigue la carta POTM de Raphinha (92).',
        image: raphinhaPOTMSBCImage,
        requirements: [
            {
                description: 'Extremo de Alto Nivel',
                slots: 11,
                type: 'complex',
                requiredRatings: [
                    { rating: 84, count: 8 },
                    { rating: 88, count: 2 },
                ],
            },
        ],
        reward: {
            type: 'card',
            cards: [{
                id: 'raphinha_potm_92',
            }],
        },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
    {
        id: 'salah_potm',
        name: 'Salah POTM (92)',
        description: 'Consigue la carta POTM de Salah (92).',
        image: salahPOTMSBCImage,
        requirements: [
            {
                description: 'Talento Excepcional',
                slots: 11,
                type: 'complex',
                requiredRatings: [
                    { rating: 86, count: 7 },
                    { rating: 90, count: 2 },
                ],
            },
        ],
        reward: {
            type: 'card',
            cards: [{
                id: 'salah_potm_92',
            }],
        },
        completedBy: [],
        isCompleted: false,
        isRepeatable: false,
    },
];
// ---


export const completeSBC = (
    sbcId,
    submittedCards,
    currentSbcList,
    currentPlayerCollection,
    getPlayerById
) => {
    console.log(`[sbcLogic] Intentando completar SBC: ${sbcId}`);
    const sbcToComplete = currentSbcList.find(sbc => sbc.id === sbcId);

    // Inicializa los valores que se devolverán al final.
    // Es crucial crear COPIAS de los arrays para no modificar el estado original directamente.
    let newSbcList = [...currentSbcList];
    let newPlayerCollection = [...currentPlayerCollection];
    let coinsEarned = 0;
    let cardsEarned = [];
    let packsEarned = [];
    let eventFichasEarned = 0;

    // --- 1. Verificación Inicial del SBC ---
    if (!sbcToComplete) {
        console.warn(`[sbcLogic] SBC con ID "${sbcId}" no encontrado en la lista actual.`);
        Alert.alert("Error", "El SBC seleccionado no está disponible.");
        return { success: false, message: 'Error interno: SBC no encontrado.' };
    }

    // --- 2. Verificación de si el SBC ya está completado y no es repetible ---
    if (sbcToComplete.isCompleted && !sbcToComplete.isRepeatable) {
        console.warn(`[sbcLogic] SBC "${sbcId}" ya completado y no es repetible.`);
        Alert.alert("SBC Completado", "Este SBC ya ha sido completado y no se puede repetir.");
        return { success: false, message: 'Este SBC ya ha sido completado y no se puede repetir.' };
    }
    if (sbcToComplete.isCompleted && sbcToComplete.isRepeatable) {
        console.log(`[sbcLogic] SBC "${sbcId}" ya completado pero es repetible. Procediendo.`);
    }

    // --- 3. Lógica de Verificación de Requisitos ---
    let requirementsMet = true;
    const validationErrors = [];

    const submittedInstanceIds = submittedCards.map(card => card.instanceId);
    const submittedCardsData = submittedInstanceIds.map(instanceId =>
        currentPlayerCollection.find(card => card.instanceId === instanceId)
    ).filter(card => card != null); // Filtra cualquier instancia que no se encuentre (debería ser 0)

    // Verifica que todas las cartas enviadas existan en la colección del jugador
    if (submittedCardsData.length !== submittedCards.length) {
        console.error("[sbcLogic] Alguna instancia de carta enviada al SBC no se encontró en la colección del jugador.");
        requirementsMet = false;
        validationErrors.push("Error interno al validar cartas enviadas. Recarga y reintenta.");
    } else {
        // Verifica el número total de jugadores
        const requiredSlotsReq = sbcToComplete.requirements.find(req => req.type === 'total_players' || req.slots !== undefined);
        if (requiredSlotsReq) {
            const requiredSlots = requiredSlotsReq.count || requiredSlotsReq.slots || 0;
            if (submittedCardsData.length !== requiredSlots) {
                requirementsMet = false;
                validationErrors.push(`Debes enviar exactamente ${requiredSlots} jugadores.`);
            }
        }

        // Si el número de jugadores es correcto, procede con los requisitos específicos
        if (requirementsMet) {
            // Pre-calcular conteos de ratings para requisitos 'complex'
            const submittedRatingsCount = submittedCardsData.reduce((acc, card) => {
                acc[card.rating] = (acc[card.rating] || 0) + 1;
                // Para requisitos como 'rating_min: 85', cuenta también los 86, 87, etc.
                for(let r = card.rating; r >= 0; r--) {
                    acc[`min_${r}`] = (acc[`min_${r}`] || 0) + 1;
                }
                return acc;
            }, {});

            for (const req of sbcToComplete.requirements) {
                // Requisito: X jugadores con Y de media o más
                if (req.type === 'min_rating_count' && req.rating_min !== undefined && req.count !== undefined) {
                    const countAboveMinRating = submittedCardsData.filter(card => card.rating >= req.rating_min).length;
                    if (countAboveMinRating < req.count) {
                        requirementsMet = false;
                        validationErrors.push(`Necesitas al menos ${req.count} jugadores con ${req.rating_min}+ de media.`);
                    }
                }
                // Requisito: Complejo (combinación de ratings, naciones, etc.)
                if (req.type === 'complex') {
                    // Requisitos de rating dentro de un complejo
                    if (req.requiredRatings) {
                        for(const requiredRat of req.requiredRatings) {
                            if ((submittedRatingsCount[`min_${requiredRat.rating}`] || 0) < requiredRat.count) {
                                requirementsMet = false;
                                validationErrors.push(`Necesitas al menos ${requiredRat.count} jugadores con ${requiredRat.rating}+ de media.`);
                            }
                        }
                    }
                    // Requisitos de nación dentro de un complejo
                    if (req.nations && req.nationCount !== undefined) {
                        const countMatchingNations = submittedCardsData.filter(card => req.nations.includes(card.nation)).length;
                        if (countMatchingNations < req.nationCount) {
                            requirementsMet = false;
                            validationErrors.push(`Necesitas al menos ${req.nationCount} jugadores de ${req.nations.join(' o ')}.`);
                        }
                    }
                    // Agrega aquí más tipos de requisitos complejos si los tienes (ej: ligas, clubes, etc.)
                }
            }
        }
    }

    // Si los requisitos no se cumplen, notifica y termina.
    if (!requirementsMet) {
        console.log(`[sbcLogic] Requisitos del SBC "${sbcId}" no cumplidos.`);
        const errorMessage = validationErrors.join('\n') || 'No cumples los requisitos del SBC.';
        Alert.alert("Requisitos Pendientes", errorMessage);
        return { success: false, message: errorMessage };
    }

    // --- 4. Si los Requisitos se Cumplen: Procesar el SBC ---
    console.log(`[sbcLogic] Requisitos del SBC "${sbcId}" cumplidos. Procediendo a completar.`);

    // a. Eliminar las cartas enviadas de la nueva colección
    newPlayerCollection = newPlayerCollection.filter(card => !submittedInstanceIds.includes(card.instanceId));
    console.log(`[sbcLogic] Removidas ${submittedCards.length} cartas de la colección.`);

    // b. Otorgar la recompensa
    const reward = sbcToComplete.reward;
    if (reward) {
        if (reward.type === 'coins' && reward.amount !== undefined) {
            coinsEarned = reward.amount;
            console.log(`[sbcLogic] Otorgadas ${reward.amount} monedas.`);
        } else if (reward.type === 'card' && reward.cards && reward.cards.length > 0) {
            const rewardCardBaseData = reward.cards[0]; // Asumimos una única carta por recompensa por ahora

            // Usa getPlayerById para obtener los datos completos de la carta de recompensa
            const playerFullData = getPlayerById(rewardCardBaseData.id);
            if (playerFullData) {
                // Añade la carta de recompensa con un nuevo instanceId a la lista de cartas ganadas
                cardsEarned.push({
                    ...playerFullData,
                    instanceId: generateUniqueInstanceId() // ¡CRUCIAL para permitir copias!
                });
                console.log(`[sbcLogic] Preparada carta de recompensa: "${playerFullData.name}" (${playerFullData.rating}).`);
            } else {
                console.error(`[sbcLogic] Datos completos de carta no encontrados para el ID de recompensa: ${rewardCardBaseData.id}. Asegúrate de que este ID exista en ALL_PLAYERS_DATA.`);
                Alert.alert("Error", "No se pudo obtener la información de la carta de recompensa.");
                return { success: false, message: 'Error al procesar la recompensa de carta.' };
            }
        } else if (reward.type === 'eventFichas' && reward.amount !== undefined) {
            eventFichasEarned = reward.amount;
            console.log(`[sbcLogic] Otorgadas ${reward.amount} fichas de evento.`);
        }
        // Agrega aquí más tipos de recompensa si es necesario (ej: 'pack')
    } else {
        console.warn(`[sbcLogic] SBC "${sbcId}" no tiene recompensa definida.`);
    }

    // c. Actualizar el estado del SBC en la lista
    // Si no es repetible, se marca como completado. Si es repetible, se incrementa el contador.
    newSbcList = newSbcList.map(sbc =>
        sbc.id === sbcId ? {
            ...sbc,
            isCompleted: sbc.isRepeatable ? sbc.isCompleted : true, // Solo marca como true si no es repetible
            completedBy: sbc.completedBy ? [...sbc.completedBy, 'player_id'] : ['player_id'], // Podrías usar el ID real del jugador
            timesCompleted: (sbc.timesCompleted || 0) + 1, // Incrementa el contador de veces completado
        } : sbc
    );

    // d. Añadir las cartas ganadas a la nueva colección (si es de tipo 'card')
    newPlayerCollection = [...newPlayerCollection, ...cardsEarned];
    console.log(`[sbcLogic] Nueva colección de jugadores tiene ${newPlayerCollection.length} cartas.`);

    // --- 5. Mostrar mensaje de éxito al usuario ---
    let successMessage = `¡SBC "${sbcToComplete.name}" completado con éxito!`;
    if (cardsEarned.length > 0) {
        successMessage += `\nHas recibido: ${cardsEarned.map(c => `<span class="math-inline">\{c\.name\} \(</span>{c.rating})`).join(', ')}.`;
    }
    if (coinsEarned > 0) {
        successMessage += `\nHas recibido: ${coinsEarned} monedas.`;
    }
    if (eventFichasEarned > 0) {
        successMessage += `\nHas recibido: ${eventFichasEarned} fichas de evento.`;
    }
    Alert.alert("SBC Completado", successMessage);

    // --- 6. Devolver todos los nuevos estados calculados al GameContext ---
    return {
        success: true,
        message: successMessage,
        updatedSbcList: newSbcList,
        newPlayerCollection: newPlayerCollection,
        coinsEarned: coinsEarned,
        cardsEarned: cardsEarned, // Devuelve las cartas ganadas para fines informativos (GameContext no necesita añadirlas, ya están en newPlayerCollection)
        packsEarned: packsEarned,
        eventFichasEarned: eventFichasEarned,
    };
};