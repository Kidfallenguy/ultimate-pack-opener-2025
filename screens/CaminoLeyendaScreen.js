import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Importa useIsFocused

// Importa el GameContext y las constantes necesarias (LEGEND_TASKS, LEGEND_TASK_REQUIREMENTS)
// Asegúrate de que estas constantes y la lógica de progreso estén definidas en tu GameContext.js
import { GameContext, LEGEND_TASKS, LEGEND_TASK_REQUIREMENTS } from '../context/GameContext';

// Obtener dimensiones de la pantalla para ajustar el tamaño de las imágenes si es necesario
const { width } = Dimensions.get('window');

// --- Jugadores Legendarios Disponibles (Potenciales Recompensas) ---
// Asegúrate de que las rutas de las imágenes sean correctas en tu proyecto
const LEGENDARY_PLAYERS = [
    {
        id: 'bochini_92',
        name: 'Bochini',
        position: 'MCO',
        rating: 92,
        imageSource: require('../assets/imagecartas/elcamino/bochini.png') // <-- Asegúrate de que la ruta sea correcta
    },
    {
        id: 'blanc_92',
        name: 'Blanc',
        position: 'MCO',
        rating: 92,
        imageSource: require('../assets/imagecartas/elcamino/blanc.png') // <-- Asegúrate de que la ruta sea correcta
    },
    {
        id: 'dani_alves_92',
        name: 'Dani Alves',
        position: 'LD',
        rating: 92,
        imageSource: require('../assets/imagecartas/elcamino/danialves.png') // <-- Asegúrate de que la ruta sea correcta
    },
    {
        id: 'cech_92',
        name: 'Cech',
        position: 'POR',
        rating: 92,
        imageSource: require('../assets/imagecartas/elcamino/cech.png') // <-- Asegúrate de que la ruta sea correcta
    },
    {
        id: 'di_stefano_92',
        name: 'Di Stéfano',
        position: 'DEL',
        rating: 92,
        imageSource: require('../assets/imagecartas/elcamino/distefano.png') // <-- Asegúrate de que la ruta sea correcta
    },
];

const CaminoLeyendaScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Hook para saber si la pantalla está enfocada

    // Obtener el progreso de las tareas, el estado de completado y si ya se reclamó del contexto
    const {
        legendTasksProgress = {}, // Progreso actual de cada tarea (ej: { 'complete_portero_14': 5 })
        areLegendTasksCompleted = false, // Booleano que indica si todas las tareas están hechas
        legendRewardClaimed = false, // Booleano que indica si la recompensa ya fue reclamada
        claimLegendReward, // Función para reclamar la recompensa
        claimedLegendPlayerId // El ID del jugador que se reclamó (opcional, para mostrar cuál se eligió)
    } = useContext(GameContext);

    // Estado para guardar el jugador seleccionado por el usuario (solo si las tareas están completadas)
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Efecto para resetear la selección del jugador si la pantalla se enfoca y la recompensa no ha sido reclamada
    // Esto evita que se muestre un jugador seleccionado si el usuario sale y vuelve sin reclamar
    useEffect(() => {
        if (isFocused && !legendRewardClaimed) {
            setSelectedPlayer(null);
        }
         // Si ya se reclamó, intenta encontrar el jugador reclamado para mostrarlo
         if (isFocused && legendRewardClaimed && claimedLegendPlayerId) {
             const claimed = LEGENDARY_PLAYERS.find(p => p.id === claimedLegendPlayerId);
             if (claimed) {
                 setSelectedPlayer(claimed);
             }
         }
    }, [isFocused, legendRewardClaimed, claimedLegendPlayerId]);


    // Helper para obtener el progreso actual de una tarea
    const getTaskProgress = (taskId) => {
        // Accede a legendTasksProgress, si es undefined, usa un objeto vacío {}
        return (legendTasksProgress || {})[taskId] || 0;
    };

    // Handler para seleccionar un jugador (solo habilitado si las tareas están completadas y no se ha reclamado)
    const handleSelectPlayer = (player) => {
        if (!areLegendTasksCompleted) {
            Alert.alert("Tareas Pendientes", "Debes completar todas las tareas antes de elegir a tu jugador legendario.");
            return;
        }
        // *** VERIFICACIÓN CLAVE: No permitir seleccionar si ya se reclamó ***
        if (legendRewardClaimed) {
             Alert.alert("Recompensa Ya Reclamada", `Ya has elegido a ${selectedPlayer?.name || 'tu jugador legendario'}.`);
             return;
        }
        // *** FIN VERIFICACIÓN CLAVE ***

        setSelectedPlayer(player);
        console.log("Jugador seleccionado:", player.name);
    };

    // Handler para confirmar la elección y reclamar la recompensa
    const handleConfirmChoice = () => {
        if (!areLegendTasksCompleted) {
            Alert.alert("Tareas Pendientes", "Debes completar todas las tareas antes de reclamar tu recompensa.");
            return;
        }
        if (!selectedPlayer) {
            Alert.alert("Elige un Jugador", "Por favor, selecciona un jugador legendario antes de reclamar tu recompensa.");
            return;
        }

        // *** VERIFICACIÓN CLAVE: No permitir confirmar si ya se reclamó ***
        if (legendRewardClaimed) {
             Alert.alert("Recompensa Ya Reclamada", `Ya has elegido a ${selectedPlayer?.name || 'tu jugador legendario'}.`);
             return;
        }
        // *** FIN VERIFICACIÓN CLAVE ***


        // Confirmación antes de reclamar
        Alert.alert(
            "Confirmar Elección",
            `¿Estás seguro de que quieres reclamar a ${selectedPlayer.name} como tu jugador legendario? ¡Esta acción no se puede deshacer!`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                    onPress: () => console.log("Elección cancelada")
                },
                {
                    text: "Confirmar",
                    onPress: () => {
                        // Llama a la función del contexto para reclamar la recompensa
                        if (typeof claimLegendReward === 'function') {
                            claimLegendReward(selectedPlayer.id); // Pasa el ID del jugador seleccionado
                            console.log(`Recompensa legendaria reclamada: ${selectedPlayer.name}`);
                            Alert.alert("¡Recompensa Reclamada!", `¡Felicidades! Has obtenido a ${selectedPlayer.name}.`);
                            // La UI se actualizará automáticamente si el contexto actualiza legendRewardClaimed
                        } else {
                             console.error("Error: claimLegendReward no es una función en el contexto.");
                             Alert.alert("Error", "No se pudo reclamar la recompensa (función no disponible).");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>El Camino de Leyenda</Text>
                <Text style={styles.description}>
                    Completa las siguientes tareas para desbloquear la oportunidad de añadir a una leyenda a tu equipo.
                </Text>

                {/* Sección de Tareas */}
                <Text style={styles.sectionTitle}>Tareas para Desbloquear</Text>
                <View style={styles.tasksContainer}>
                    {/* Mapea las tareas definidas en GameContext (debes importarlas) */}
                    {/* Usar (LEGEND_TASKS || []) para asegurar que siempre es un array */}
                    {(LEGEND_TASKS || []).map(task => {
                        // Asegúrate de que LEGEND_TASK_REQUIREMENTS no sea undefined al acceder
                        const required = (LEGEND_TASK_REQUIREMENTS || {})[task.id] || 0;
                        const currentProgress = getTaskProgress(task.id);
                        const isCompleted = currentProgress >= required;

                        return (
                            <View key={task.id} style={styles.taskItem}>
                                <Text style={[styles.taskText, isCompleted && styles.taskCompletedText]}>
                                    {isCompleted ? '✅' : '⏳'} {task.description} ({currentProgress}/{required})
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Mensaje condicional */}
                {!areLegendTasksCompleted ? (
                    <Text style={styles.statusMessagePending}>
                        Completa todas las tareas para poder elegir tu Leyenda.
                    </Text>
                ) : (
                    legendRewardClaimed ? (
                         <Text style={styles.statusMessageClaimed}>
                             🎉 ¡Ya reclamaste a {selectedPlayer?.name || 'tu jugador legendario'}! 🎉
                         </Text>
                    ) : (
                        <Text style={styles.statusMessageReady}>
                            ¡Tareas Completadas! Ahora elige y reclama a tu jugador legendario.
                        </Text>
                    )
                )}


                {/* Sección de Jugadores (Potenciales Recompensas) */}
                <Text style={styles.sectionTitle}>Jugadores Legendarios Disponibles</Text>
                <View style={styles.playersContainer}>
                    {/* LEGENDARY_PLAYERS es una constante local, menos probable que sea undefined */}
                    {(LEGENDARY_PLAYERS || []).map(player => ( // Añadimos verificación también aquí por seguridad
                        <TouchableOpacity
                            key={player.id}
                            style={[
                                styles.playerCard,
                                selectedPlayer?.id === player.id && styles.selectedCard, // Estilo si está seleccionado
                                !areLegendTasksCompleted && styles.playerCardLocked, // Estilo si las tareas no están completas
                                legendRewardClaimed && styles.claimedCard // Estilo si ya se reclamó
                            ]}
                            onPress={() => handleSelectPlayer(player)}
                            // *** VERIFICACIÓN CLAVE: Deshabilitar si las tareas no están completas O si ya se reclamó ***
                            disabled={!areLegendTasksCompleted || legendRewardClaimed}
                            // *** FIN VERIFICACIÓN CLAVE ***
                        >
                            <Image
                                source={player.imageSource}
                                style={styles.playerImage}
                                resizeMode="contain"
                                onError={(e) => console.error(`Error cargando imagen para ${player.name}:`, e.nativeEvent.error)}
                            />
                            <View style={styles.playerInfo}>
                                <Text style={styles.playerName}>{player.name}</Text>
                                <Text style={styles.playerDetails}>{player.position} | {player.rating} MED</Text>
                            </View>
                             {/* Indicador visual si está bloqueado (tareas pendientes) */}
                             {!areLegendTasksCompleted && (
                                 <View style={styles.lockedOverlay}>
                                     <Text style={styles.lockedText}>🔒</Text>
                                 </View>
                             )}
                             {/* Indicador visual si es el reclamado */}
                              {legendRewardClaimed && selectedPlayer?.id === player.id && (
                                  <View style={styles.claimedOverlay}>
                                      <Text style={styles.claimedText}>✅</Text>
                                  </View>
                              )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Botón de Confirmar */}
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        (!selectedPlayer || !areLegendTasksCompleted || legendRewardClaimed) && styles.confirmButtonDisabled // Deshabilita si no hay selección, tareas pendientes o ya reclamado
                    ]}
                    onPress={handleConfirmChoice}
                    // *** VERIFICACIÓN CLAVE: Deshabilitar si no hay selección, tareas pendientes o ya reclamado ***
                    disabled={!selectedPlayer || !areLegendTasksCompleted || legendRewardClaimed}
                    // *** FIN VERIFICACIÓN CLAVE ***
                >
                    <Text style={styles.confirmButtonText}>
                        {!areLegendTasksCompleted ? 'Tareas Pendientes' :
                         legendRewardClaimed ? `Reclamado: ${selectedPlayer?.name || 'Leyenda'}` :
                         (selectedPlayer ? `Reclamar a ${selectedPlayer.name}` : 'Selecciona un Jugador')}
                    </Text>
                </TouchableOpacity>

                 {/* Botón para volver */}
                 <TouchableOpacity
                     style={styles.backButton}
                     onPress={() => navigation.goBack()} // O navigation.navigate('SomePreviousScreen')
                 >
                     <Text style={styles.backButtonText}>Volver</Text>
                 </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a2e3f', // Fondo oscuro
    },
    scrollViewContent: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 100, // Espacio al final para evitar que el último elemento quede tapado
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffc107', // Dorado
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    description: {
        fontSize: 16,
        color: '#ddd', // Gris claro
        textAlign: 'center',
        marginBottom: 20,
    },
     claimedMessage: { // Este estilo no se usa directamente en el render actual, pero se mantiene por si acaso
         fontSize: 18,
         fontWeight: 'bold',
         color: '#28a745', // Verde
         textAlign: 'center',
         marginVertical: 15,
     },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffc107', // Dorado
        marginTop: 25,
        marginBottom: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    tasksContainer: {
        backgroundColor: '#2c3e50', // Fondo oscuro para las tareas
        borderRadius: 10,
        padding: 15,
        width: '100%', // Ocupa casi todo el ancho
        maxWidth: 400, // Ancho máximo opcional
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    taskItem: {
        marginBottom: 10,
    },
    taskText: {
        fontSize: 16,
        color: '#ecf0f1', // Blanco grisáceo
    },
    taskCompletedText: {
        color: '#28a745', // Verde para tareas completadas
        fontWeight: 'bold',
    },
    statusMessagePending: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffc107', // Amarillo/Dorado para pendiente
        textAlign: 'center',
        marginVertical: 20,
    },
    statusMessageReady: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745', // Verde para listo
        textAlign: 'center',
        marginVertical: 20,
    },
     statusMessageClaimed: {
         fontSize: 18,
         fontWeight: 'bold',
         color: '#17a2b8', // Azul/Cyan para reclamado
         textAlign: 'center',
         marginVertical: 20,
     },
    playersContainer: {
        alignItems: 'center', // Centra las tarjetas si no llenan el ancho
        width: '100%', // Asegura que el contenedor ocupe el ancho para centrar
    },
    playerCard: {
        flexDirection: 'row', // Imagen e info lado a lado
        backgroundColor: '#2c3e50', // Fondo de tarjeta oscuro
        borderRadius: 10,
        marginVertical: 8,
        padding: 15,
        width: width * 0.9, // Ancho de la tarjeta (90% del ancho de la pantalla)
        maxWidth: 400, // Ancho máximo opcional
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 2, // Borde para indicar selección
        borderColor: 'transparent', // Borde transparente por defecto
        position: 'relative', // Necesario para posicionar el overlay
    },
    playerCardLocked: {
        opacity: 0.6, // Reduce la opacidad si está bloqueado
        backgroundColor: '#555', // Fondo grisáceo si está bloqueado
    },
    selectedCard: {
        borderColor: '#ffc107', // Borde dorado cuando está seleccionado
        backgroundColor: '#34495e', // Fondo ligeramente diferente al seleccionar
    },
     claimedCard: {
         opacity: 0.7, // Reduce la opacidad si ya se reclamó
         backgroundColor: '#555', // Fondo grisáceo si ya se reclamó
         borderColor: '#17a2b8', // Borde azul/cyan si ya se reclamó
     },
    playerImage: {
        width: 80, // Tamaño de la imagen
        height: 80, // Tamaño de la imagen
        borderRadius: 5, // Bordes redondeados para la imagen
        marginRight: 15,
    },
    playerInfo: {
        flex: 1, // Permite que la información ocupe el espacio restante
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ecf0f1', // Blanco grisáceo
    },
    playerDetails: {
        fontSize: 14,
        color: '#bdc3c7', // Gris más claro
        marginTop: 5,
    },
     lockedOverlay: {
         position: 'absolute',
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro semitransparente
         borderRadius: 10,
         justifyContent: 'center',
         alignItems: 'center',
     },
     lockedText: {
         fontSize: 40,
         color: '#fff', // Candado blanco
     },
     claimedOverlay: {
         position: 'absolute',
         top: 5,
         right: 5,
         // backgroundColor: 'rgba(40, 167, 69, 0.8)', // Fondo verde semitransparente
         borderRadius: 15,
         padding: 3,
     },
     claimedText: {
         fontSize: 30,
         color: '#28a745', // Checkmark verde
         fontWeight: 'bold',
     },
    confirmButton: {
        backgroundColor: '#28a745', // Verde
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10, // Espacio antes del botón de volver
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '90%', // Ancho del botón
        maxWidth: 400, // Ancho máximo opcional
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#888', // Gris para deshabilitado
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center', // Centra el texto
    },
     backButton: {
         backgroundColor: '#555', // Gris oscuro
         paddingVertical: 10,
         paddingHorizontal: 20,
         borderRadius: 10,
         marginTop: 10,
         elevation: 3,
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.2,
         shadowRadius: 3,
     },
     backButtonText: {
         color: 'white',
         fontSize: 16,
     },
});

export default CaminoLeyendaScreen;

