import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Asegúrate de importar BETA_MINIGAMES desde GameContext
import { GameContext } from '../context/GameContext'; // <-- Importa BETA_MINIGAMES aquí
import { BETA_MINIGAMES } from '../utils/constants'; // <--- VERIFICA ESTA RUTA CAREFULLY!

// --- Juegos disponibles en el Camino de Recompensas ---
// LISTA ACTUALIZADA con el orden y IDs que indicaste (1, 2, 3, 4, 6, 5)
// Y nombres de navegación ('nav') que coinciden con los nombres de ruta en App.js
export const BETA_REWARD_PATH_GAMES = [
    { id: 'GAME1', label: 'Carrera Toques', nav: 'CarreraToques' }, // ID: 'GAME1' -> BETA_MINIGAMES['GAME1'] = 'beta_pases'
    { id: 'GAME2', label: 'Desafío Regate', nav: 'DesafioRegate' }, // ID: 'GAME2' -> BETA_MINIGAMES['GAME2'] = 'beta_regate'
    { id: 'GAME3', label: 'Desafío Tiros', nav: 'DesafioTiros' },   // ID: 'GAME3' -> BETA_MINIGAMES['GAME3'] = 'beta_tiros'
    { id: 'GAME4', label: 'Desafío Defensa', nav: 'DesafioDefensa' }, // ID: 'GAME4' -> BETA_MINIGAMES['GAME4'] = 'beta_defensa'
    { id: 'GAME6', label: 'Desafío Portero', nav: 'DesafioPortero' }, // ID: 'GAME6' -> BETA_MINIGAMES['GAME6'] = 'beta_portero'
    { id: 'GAME5', label: 'Juego Libre', nav: 'JuegoLibre' },     // ID: 'GAME5' -> BETA_MINIGAMES['GAME5'] = 'beta_libre'
];

const BienvenidaBetaScreen = () => {
    const navigation = useNavigation();
    // betaEventProgress es el objeto con claves como 'beta_pases', 'beta_portero', etc.
    const { betaEventProgress = {}, eventFichas, updateBetaGameProgress, claimBetaFinalReward } = useContext(GameContext);

    const [showRewardChoiceModal, setShowRewardChoiceModal] = useState(false);

    // --- Helpers ---
    // Comprueba si un juego está completado usando su ID 'GAME#'
    // Accede a betaEventProgress usando el VALOR string del minijuego (BETA_MINIGAMES[id])
    const isGameCompleted = (id) => {
        const minigameIdString = BETA_MINIGAMES[id]; // Obtiene 'beta_pases', 'beta_regate', etc.
         // Asegúrate de que minigameIdString no sea undefined si el ID 'GAME#' no existe en BETA_MINIGAMES
        if (!minigameIdString) {
            console.warn(`isGameCompleted: ID 'GAME#' no mapeado en BETA_MINIGAMES: ${id}`);
            return false; // Considera el juego como no completado si el ID no es válido
        }
        return betaEventProgress[minigameIdString]?.count > 0; // Usa el string como clave
    };

    // Comprueba si un juego está desbloqueado usando su ID 'GAME#'
    const isGameUnlocked = (id) => {
        const index = BETA_REWARD_PATH_GAMES.findIndex(g => g.id === id);
        if (index === -1) { // Si el ID no se encuentra en la lista, asumimos bloqueado o error
             console.warn(`isGameUnlocked: ID de juego desconocido en BETA_REWARD_PATH_GAMES: ${id}`);
             return false;
        }
        if (index === 0) return true; // El primer juego (índice 0) siempre está desbloqueado
        const previousGameId = BETA_REWARD_PATH_GAMES[index - 1].id; // Obtiene el ID 'GAME#' del juego anterior en la lista
        return isGameCompleted(previousGameId); // Verifica si el juego anterior está completado usando el helper corregido
    };

    const handleGamePress = (game) => { // 'game' es un objeto de BETA_REWARD_PATH_GAMES, game.id es 'GAME#'
        const completed = isGameCompleted(game.id); // game.id es 'GAME#'
        const unlocked = isGameUnlocked(game.id);   // game.id es 'GAME#'

        if (!unlocked) { // <-- Caso 1: Si no está desbloqueado
            const index = BETA_REWARD_PATH_GAMES.findIndex(g => g.id === game.id);
             if (index === -1 || index === 0) { // Manejar casos borde si hay error en la lista
                 Alert.alert('Bloqueado', 'Este desafío está bloqueado.');
                 return;
             }
            const previousGame = BETA_REWARD_PATH_GAMES[index - 1]; // Obtiene el juego anterior para el mensaje
            Alert.alert('Bloqueado', `Debes completar "${previousGame.label}" antes.`);
        } else if (completed) { // <-- Caso 2: Si ya está completado
            Alert.alert('Completado', `Ya completaste "${game.label}". Puedes volver a jugarlo si deseas.`);
            // --- CAMBIO AQUÍ (Opcional): Permitir navegar si ya completó, pasando el gameId correcto ---
            const correctGameId = BETA_MINIGAMES[game.id]; // Busca el valor string usando la clave 'GAME#'
            if (correctGameId) {
                 console.log(`Re-navegando a ${game.nav} con gameId: ${correctGameId} (Juego ya completado)`); // Log para verificar
                 navigation.navigate(game.nav, { gameId: correctGameId }); // Navega y pasa el gameId correcto
            } else {
                 console.error(`Error: (Re-jugar) No se encontró un gameId válido en BETA_MINIGAMES para la clave ${game.id}`);
                 Alert.alert("Error", "No se pudo iniciar el minijuego (ID no mapeado).");
            }
        } else { // <-- Caso 3: Si está DESBLOQUEADO y NO COMPLETADO (Debería entrar aquí la primera vez)
            // --- CAMBIO AQUÍ: Pasa el gameId correcto (el VALOR string de BETA_MINIGAMES) ---
            const correctGameId = BETA_MINIGAMES[game.id]; // Busca el valor string (ej. 'beta_pases') usando la clave 'GAME#' (ej. 'GAME1')
            if (correctGameId) { // <-- Caso 3a: Si el ID string existe en BETA_MINIGAMES
                // Este log DEBE mostrar el 'nav' correcto y el 'gameId' correcto
                console.log(`Navegando a ${game.nav} con gameId: ${correctGameId}`); // Log para verificar
                navigation.navigate(game.nav, { gameId: correctGameId }); // <-- **Intenta navegar**
            } else { // <-- Caso 3b: Si el ID string NO existe en BETA_MINIGAMES (Esto causaría la alerta de "ID no encontrado")
                // Muestra alerta "Error" (ID no encontrado) y NO navega
                console.error(`Error: No se encontró un gameId válido en BETA_MINIGAMES para la clave ${game.id}`);
                Alert.alert("Error", "No se pudo iniciar el minijuego. ID no encontrado.");
            }
        }
    };

    // La lógica de Recompensa Final ya usa betaEventProgress.finalRewardProgress del contexto
    const isFinalRewardReady = betaEventProgress.finalRewardProgress >= betaEventProgress.finalRewardRequired && !betaEventProgress.finalRewardClaimed;
    // Usa la constante finalRewardRequired del contexto si está disponible, o un valor por defecto
    const finalRewardRequiredDisplay = betaEventProgress.finalRewardRequired !== undefined ? betaEventProgress.finalRewardRequired : 14;
    const finalRewardProgressDisplay = `${betaEventProgress.finalRewardProgress || 0} / ${finalRewardRequiredDisplay}`;


    const handleClaimButtonPress = () => {
        if (isFinalRewardReady) {
            setShowRewardChoiceModal(true);
        } else if (betaEventProgress.finalRewardClaimed) {
            Alert.alert('Recompensa Ya Reclamada');
        } else {
            // El mensaje de alerta usa finalRewardRequired del contexto
            Alert.alert('Falta Progreso', `Aún necesitas completar el Desafío Portero ${finalRewardRequiredDisplay} veces.`);
        }
    };

    // Handler para la elección de recompensa en el modal
    const handleRewardChoice = (choiceDetails) => { // choiceDetails es un objeto que describe la elección { id: '...', type: '...', ... }
        console.log("Elección de recompensa final:", choiceDetails);
        if (!choiceDetails || !choiceDetails.id || !choiceDetails.type) {
             console.warn("handleRewardChoice: Detalles de elección inválidos.", choiceDetails);
             Alert.alert("Error", "Elección de recompensa inválida.");
             setShowRewardChoiceModal(false);
             return;
        }

        // Llama a la función del contexto para reclamar la recompensa, pasándole los detalles
        // Asegúrate de que claimBetaFinalReward en tu contexto maneje este objeto
        if (typeof claimBetaFinalReward === 'function') {
             claimBetaFinalReward(choiceDetails);
        } else {
             console.error("Error: claimBetaFinalReward no es una función en el contexto.");
             Alert.alert("Error", "No se pudo reclamar la recompensa (función no disponible).");
        }

        setShowRewardChoiceModal(false); // Cierra el modal después de intentar reclamar
    };

    // --- Render ---
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Evento: BIENVENIDO A LA BETA</Text>

            {/* Camino de Recompensas */}
            <Text style={styles.sectionTitle}>Camino de Recompensas</Text>
            <ScrollView horizontal contentContainerStyle={styles.rewardPathContainer} showsHorizontalScrollIndicator={false}>
                {BETA_REWARD_PATH_GAMES.map((game, index) => { // game.id aquí es 'GAME1', 'GAME2', etc.
                    const completed = isGameCompleted(game.id); // Verifica completado usando 'GAME#'
                    const unlocked = isGameUnlocked(game.id);   // Verifica desbloqueado usando 'GAME#'
                    const isPortero = game.id === BETA_MINIGAMES.GAME6; // Compara si es el ID 'GAME#' del portero

                    // Accede al progreso de este minijuego usando el VALOR string del gameId ('beta_pases', etc.)
                    const minigameIdString = BETA_MINIGAMES[game.id]; // Obtiene el string id (ej. 'beta_pases')
                    // Asegúrate de que minigameIdString no sea undefined antes de intentar acceder a betaEventProgress
                    const minigameProgress = minigameIdString ? betaEventProgress[minigameIdString] : undefined;
                    const currentCount = minigameProgress?.count || 0; // Contador para este minijuego (si existe el progreso)

                    // El contador de portero se muestra específicamente si es el juego de portero
                    const porteroCountDisplay = isPortero ? currentCount : null; // Solo muestra el contador si es el portero


                    return (
                        <React.Fragment key={game.id}>
                            <TouchableOpacity
                                style={[styles.node, !unlocked && styles.nodeLocked, completed && styles.nodeCompleted]}
                                onPress={() => handleGamePress(game)} // Pasa el objeto game (con id='GAME#', label, nav)
                                disabled={!unlocked} // Botón deshabilitado si no está desbloqueado
                            >
                                <Text style={styles.nodeText}>{index + 1}</Text>
                                <Text style={styles.nodeLabel}>{game.label}</Text>
                                {/* Indicador visual de estado */}
                                {!unlocked && <Text style={styles.markerText}>🔒</Text>} {/* candado si bloqueado */}
                                {completed && <Text style={styles.markerText}>✅</Text>} {/* checkmark si completado */}
                                {/* Contador de portero si es el nodo correcto */}
                                {isPortero && ( // Mostrar contador solo si es el juego de portero
                                    <View style={styles.porteroCounter}>
                                        <Text style={styles.porteroCounterText}>{porteroCountDisplay}</Text>
                                    </View>
                                )}

                            </TouchableOpacity>
                            {/* Línea conectora */}
                            {index < BETA_REWARD_PATH_GAMES.length - 1 && (
                                <View style={[styles.connectingLine, completed && styles.connectingLineCompleted]} />
                            )}
                        </React.Fragment>
                    );
                })}
            </ScrollView>

            {/* Recompensa Final */}
            <Text style={styles.sectionTitle}>Recompensa Final</Text>
            <View style={styles.finalRewardContainer}>
                <Text style={styles.finalRewardProgressText}>
                    {/* Muestra el progreso usando finalRewardProgress del contexto */}
                    {finalRewardProgressDisplay} completaciones del Desafío Portero
                </Text>

                {!betaEventProgress.finalRewardClaimed ? (
                    <TouchableOpacity
                        style={[styles.claimButton, !isFinalRewardReady && styles.claimButtonDisabled]}
                        onPress={handleClaimButtonPress}
                        disabled={!isFinalRewardReady}
                    >
                        <Text style={styles.claimButtonText}>
                            {isFinalRewardReady ? '¡Reclamar Recompensa!' : 'Requisitos Pendientes'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.claimedText}>🎉 Recompensa Final Reclamada 🎉</Text>
                )}
            </View>

            {/* Navegación a otras secciones */}
            <Text style={styles.sectionTitle}>Explora Más</Text>
            {/* --- ESTE ES EL BOTÓN QUE DEBE NAVEGAR --- */}
            <TouchableOpacity style={styles.eventSectionButton} onPress={() => navigation.navigate('CaminoLeyenda')}>
                <Text style={styles.eventSectionButtonText}>👑 camino de Leyenda</Text>
            </TouchableOpacity>
            {/* -------------------------------------- */}
            <TouchableOpacity style={styles.eventSectionButton} onPress={() => navigation.navigate('GaleriaEventoBeta')}>
                <Text style={styles.eventSectionButtonText}>🖼️ Galería del Evento</Text>
            </TouchableOpacity>

            {/* Fichas */}
            <Text style={styles.fichasText}>Fichas de Evento: {eventFichas || 0}</Text>

            {/* Modal de Recompensas */}
            <Modal visible={showRewardChoiceModal} transparent animationType="slide" onRequestClose={() => setShowRewardChoiceModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Elige tu Recompensa Final</Text>
                        <Text style={styles.modalDescription}>Selecciona una de las siguientes recompensas exclusivas:</Text>

                        {/* Las opciones llaman a handleRewardChoice con un objeto que describe la elección */}
                        {/* Asegúrate de que los tipos ('coins', 'card', 'eventFichas') y datos (amount, cardData)
                            coincidan con lo que tu claimBetaFinalReward en el contexto espera */}
                        <TouchableOpacity style={styles.rewardOptionButton} onPress={() => handleRewardChoice({ id: 'coins', type: 'coins', amount: 100 })}>
                            <Text style={styles.rewardOptionButtonText}>💰 100 Monedas</Text>
                        </TouchableOpacity>
                        {/* Ejemplo: Para una carta, necesitarías los datos base de la carta */}
                        <TouchableOpacity style={styles.rewardOptionButton} onPress={() => handleRewardChoice({ id: 'player_88-97', type: 'card', cardData: { /* datos de la carta */ } })}>
                            <Text style={styles.rewardOptionButtonText}>✨ Jugador Especial (88–97 MED)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rewardOptionButton} onPress={() => handleRewardChoice({ id: 'fichas_500', type: 'eventFichas', amount: 500 })}>
                            <Text style={styles.rewardOptionButtonText}>🎟️ 500 Fichas de Evento</Text>
                        </TouchableOpacity>

                        <Pressable style={styles.buttonClose} onPress={() => setShowRewardChoiceModal(false)}>
                            <Text style={styles.textStyle}>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#333', // Color más oscuro para mejor contraste
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 8,
        color: '#555', // Color para títulos de sección
        marginTop: 20, // Espacio extra
    },
    rewardPathContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center', // Centrar nodos verticalmente con la línea
        justifyContent: 'center', // Centrar nodos horizontalmente si caben todos
    },
    node: {
        backgroundColor: '#007bff', // Azul
        paddingVertical: 15, // Ajustado padding
        paddingHorizontal: 20, // Ajustado padding
        borderRadius: 50, // Redondo
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5, // Espacio reducido entre nodos
        width: 90, // Ajustado tamaño del nodo
        height: 90, // Ajustado tamaño del nodo
        elevation: 3, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    nodeLocked: {
        backgroundColor: '#888', // Gris para bloqueado
    },
    nodeCompleted: {
        backgroundColor: '#28a745', // Verde para completado
    },
    nodeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20, // Tamaño más grande para el número
    },
    nodeLabel: {
        color: '#fff',
        fontSize: 10, // Tamaño más pequeño para la etiqueta
        textAlign: 'center',
        marginTop: 2,
    },
    connectingLine: {
        height: 3, // Línea más gruesa
        backgroundColor: '#007bff', // Azul
        width: 20, // Línea más corta
        // Posicionamiento relativo al nodo
        // alignItems: 'center', // Esto no aplica directamente a View para posicionar
    },
    connectingLineCompleted: {
        backgroundColor: '#28a745', // Verde
    },
     markerText: { // Estilo para los marcadores (🔒, ✅)
        position: 'absolute',
        top: 5,
        right: 5,
        fontSize: 18,
        // Ajusta el color si el fondo del nodo cambia mucho
        // color: '#fff',
    },
    porteroCounter: {
        position: 'absolute',
        bottom: -5, // Posición ajustada
        right: -5, // Posición ajustada
        backgroundColor: '#ffc107', // Amarillo para contador
        borderRadius: 10,
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderWidth: 1, // Borde opcional
        borderColor: '#fff', // Color del borde
    },
    porteroCounterText: {
        color: '#333', // Color oscuro para contraste en amarillo
        fontSize: 10, // Tamaño más pequeño
        fontWeight: 'bold',
    },
    finalRewardContainer: {
        marginVertical: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    finalRewardProgressText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    claimButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12, // Ajustado padding
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 18, // Tamaño ligeramente mayor
        fontWeight: 'bold',
    },
    claimButtonDisabled: {
        backgroundColor: '#ccc',
    },
    claimedText: {
        fontSize: 18, // Tamaño ligeramente mayor
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'center',
    },
    eventSectionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12, // Ajustado padding
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
        elevation: 2, // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    eventSectionButtonText: {
        color: '#fff',
        fontSize: 18, // Tamaño ligeramente mayor
        fontWeight: 'bold',
    },
    fichasText: {
        fontSize: 18, // Tamaño ligeramente mayor
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15, // Más espacio
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)', // Fondo más oscuro
    },
    modalView: {
        backgroundColor: '#fff',
        padding: 25, // Más padding
        borderRadius: 10,
        width: '85%', // Ancho ajustable
        alignItems: 'center',
        elevation: 5, // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 22, // Tamaño mayor
        fontWeight: 'bold',
        marginBottom: 15, // Más espacio
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
    },
    rewardOptionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12, // Ajustado padding
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        width: '100%',
        elevation: 2, // Sombra
    },
    rewardOptionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonClose: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        elevation: 2, // Sombra
    },
    textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BienvenidaBetaScreen;
