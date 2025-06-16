import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
    ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GameContext } from '../context/GameContext';
// --- ¡IMPORTACIÓN DE IMÁGENES ACTUALIZADA! ---
// Ajusta la ruta a tu archivo playerimages.js según su ubicación real
import { playerImages, DEFAULT_PLAYER_IMAGE } from '../assets/playerImages'; // <-- ¡VERIFICA ESTA RUTA!

// --- IMAGE IMPORTS DE OTROS ELEMENTOS ---
const FICHA_IMAGE = { uri: 'https://i.ibb.co/Z1mCQhX3/451-sin-t-tulo-20250513212634.png' }; // URL de la ficha
const BACKGROUND_IMAGE = { uri: 'https://media.istockphoto.com/id/1423747813/es/vector/fondo-verde-moderno.jpg?s=612x612&w=0&k=20&c=3HIwKoGXgouC_7-exk-SkXiUYvhqbBR_UC9LP7aKwbg=' }; // URL del fondo

// Función para calcular fichas ganadas según el GRL del jugador
const calculateExchangeFichas = (rating) => {
    if (rating >= 97) return 50;
    if (rating >= 96) return 40;
    if (rating >= 95) return 35;
    if (rating >= 93) return 30;
    if (rating >= 91) return 25;
    if (rating >= 89) return 20;
    if (rating >= 86) return 15;
    if (rating >= 80) return 10;
    if (rating >= 75) return 5;
    return 1; // Por defecto para jugadores con GRL inferior a 75
};

const IntercambioJugadoresScreen = () => {
      console.log('IntercambioJugadoresScreen component mounted/re-rendered.');
    const navigation = useNavigation();
    const { collection, eventFichas, setCollection, setEventFichas } = useContext(GameContext);

    const [selectedPlayerInstanceIds, setSelectedPlayerInstanceIds] = useState([]);
    const [totalFichasToReceive, setTotalFichasToReceive] = useState(0);
    console.log('GameContext: collection state in screen:', collection);
    console.log('GameContext: eventFichas state in screen:', eventFichas);
    // Configura las opciones del encabezado de navegación
    useEffect(() => {
        navigation.setOptions({
            title: 'Canjear Jugadores',
        });
    }, [navigation]);

    // Recalcula las fichas totales a recibir cada vez que cambia la selección
    useEffect(() => {
        let calculatedFichas = 0;
        if (collection && Array.isArray(collection)) {
            const selectedPlayers = collection.filter(player =>
                selectedPlayerInstanceIds.includes(player.instanceId)
            );
            selectedPlayers.forEach(player => {
                calculatedFichas += calculateExchangeFichas(player.rating);
            });
        }
        setTotalFichasToReceive(calculatedFichas);
    }, [selectedPlayerInstanceIds, collection]);

    // Alternar selección de jugador
const togglePlayerSelection = (playerInstanceId) => {
    console.log('Toggling player selection for:', playerInstanceId);
    setSelectedPlayerInstanceIds(prevSelected => {
        const newSelection = prevSelected.includes(playerInstanceId)
            ? prevSelected.filter(id => id !== playerInstanceId)
            : [...prevSelected, playerInstanceId];
        console.log('New selectedPlayerInstanceIds:', newSelection);
        return newSelection;
    });
};

    // Manejar el intercambio
    const handleExchangeCards = () => {
        if (selectedPlayerInstanceIds.length === 0) {
            Alert.alert('Selecciona Jugadores', 'Debes seleccionar al menos un jugador para intercambiar.');
            return;
        }

        Alert.alert(
            'Confirmar Intercambio',
            `¿Estás seguro de que quieres intercambiar ${selectedPlayerInstanceIds.length} jugador(es) por ${totalFichasToReceive} fichas?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        console.log('--- Iniciando Intercambio ---');
                        console.log('Fichas actuales antes:', eventFichas);
                        console.log('Jugadores seleccionados para eliminar:', selectedPlayerInstanceIds);
                        console.log('Cantidad de fichas a recibir:', totalFichasToReceive);

                        const newCollection = (collection || []).filter(
                            card => !selectedPlayerInstanceIds.includes(card.instanceId)
                        );
                        console.log('Nueva colección (después de filtrar):', newCollection.length, 'jugadores restantes');

                        // Actualizar contexto
                        setEventFichas(prevFichas => {
                            const updatedFichas = (prevFichas || 0) + totalFichasToReceive;
                            console.log('Fichas actualizadas a:', updatedFichas);
                            return updatedFichas;
                        });
                        setCollection(newCollection);

                        // Limpiar selección y total
                        setSelectedPlayerInstanceIds([]);
                        setTotalFichasToReceive(0);

                        Alert.alert('¡Intercambio Exitoso!', `¡Recibiste ${totalFichasToReceive} fichas!`);
                        console.log('--- Intercambio Finalizado ---');
                    },
                },
            ]
        );
    };

    // Renderiza cada jugador en la FlatList
    const renderPlayerItem = ({ item }) => {
        const isSelected = selectedPlayerInstanceIds.includes(item.instanceId);
        const fichasForThisPlayer = calculateExchangeFichas(item.rating);

        // --- ¡CAMBIO CLAVE PARA LA IMAGEN! ---
        // Obtenemos la imagen del mapa playerImages usando item.imageUri como clave
        const playerImageSource = playerImages[item.imageUri] || DEFAULT_PLAYER_IMAGE;

        // Si no se encuentra la imagen en el mapa, mostramos una advertencia en consola
        if (!playerImages[item.imageUri]) {
            console.warn(`No se encontró la imagen para el jugador: ${item.name} (imageUri: '${item.imageUri}') en 'playerimages'. Usando imagen por defecto.`);
        }
        // --- FIN CAMBIO CLAVE ---

        return (
            <TouchableOpacity
                style={[styles.playerItem, isSelected && styles.selectedPlayerItem]}
                onPress={() => togglePlayerSelection(item.instanceId)}
            >
                <Image
                    source={playerImageSource}
                    style={styles.playerImage}
                    resizeMode="contain"
                    onError={(e) => console.log('Error al cargar imagen:', item.name, e.nativeEvent.error)}
                />
                <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{item.name}</Text>
                    <Text style={styles.playerDetails}>{item.club} | GRL {item.rating}</Text>
                </View>
                <View style={styles.fichasValueContainer}>
                    <Image source={FICHA_IMAGE} style={styles.fichasValueImage} />
                    <Text style={styles.fichasValueText}>{fichasForThisPlayer}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Intercambiar Jugadores</Text>

                <View style={styles.currentFichasContainer}>
                    <Text style={styles.currentFichasText}>Tus Fichas:</Text>
                    <Image source={FICHA_IMAGE} style={styles.fichaIconBig} />
                    <Text style={styles.currentFichasText}>{eventFichas || 0}</Text>
                </View>

                <Text style={styles.sectionTitle}>Selecciona Jugadores de tu Colección:</Text>

                {(collection && collection.length > 0) ? (
                    <FlatList
                        data={collection}
                        renderItem={renderPlayerItem}
                        keyExtractor={(item) => item.instanceId}
                        contentContainerStyle={styles.playerList}
                        extraData={selectedPlayerInstanceIds}
                    />
                ) : (
                    <Text style={styles.emptyStateText}>No tienes jugadores en tu colección para intercambiar.</Text>
                )}

                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>Jugadores seleccionados: {selectedPlayerInstanceIds.length}</Text>
                    <View style={styles.totalFichasContainer}>
                        <Text style={styles.summaryText}>Recibirás:</Text>
                        <Image source={FICHA_IMAGE} style={styles.fichaIconSmall} />
                        <Text style={styles.summaryText}>{totalFichasToReceive}</Text>
                        <Text style={styles.summaryText}>Fichas</Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.exchangeButton,
                            selectedPlayerInstanceIds.length === 0 && styles.exchangeButtonDisabled,
                        ]}
                        onPress={handleExchangeCards}
                        disabled={selectedPlayerInstanceIds.length === 0}
                    >
                        <Text style={styles.exchangeButtonText}>Intercambiar Seleccionados</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    currentFichasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#ffeb3b',
        alignSelf: 'center',
    },
    currentFichasText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginHorizontal: 5,
    },
    fichaIconBig: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
        resizeMode: 'contain',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    playerList: {
        paddingBottom: 20,
    },
    playerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPlayerItem: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    playerImage: {
        width: 60,
        height: 75,
        marginRight: 15,
        borderRadius: 5,
        backgroundColor: '#ccc',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 3,
    },
    playerDetails: {
        fontSize: 14,
        color: '#e0e0e0',
    },
    fichasValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    fichasValueImage: {
        width: 20,
        height: 20,
        marginRight: 5,
        resizeMode: 'contain',
    },
    fichasValueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffeb3b',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        marginTop: 30,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 8,
        marginHorizontal: 20,
    },
    summaryContainer: {
        marginTop: 25,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00bcd4',
    },
    summaryText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    totalFichasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    fichaIconSmall: {
        width: 22,
        height: 22,
        marginHorizontal: 5,
        resizeMode: 'contain',
    },
    exchangeButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginTop: 15,
        width: '90%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    exchangeButtonDisabled: {
        backgroundColor: '#757575',
    },
    exchangeButtonText: {
        fontSize: 19,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default IntercambioJugadoresScreen;