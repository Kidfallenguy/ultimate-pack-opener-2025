import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native'; // Importar Alert
import { useNavigation } from '@react-navigation/native';

// Importar el GameContext para acceder a las fichas y el estado de jugadores reclamados
import { GameContext } from '../context/GameContext'; // <-- Asegúrate de que la ruta sea correcta

// URL de la imagen de fondo para la pantalla del evento Champions
const CHAMPIONS_BACKGROUND_URL = 'https://wallpapers.com/images/hd/metallic-gradient-ball-star-champions-league-jaz519adfhwmzhfk.jpg';
// URL de la imagen de la Ficha Champions
const CHAMPIONS_TOKEN_IMAGE_URL = 'http://imgfz.com/i/npgM2sB.png'; // <-- URL de la ficha

// Lista de jugadores canjeables con sus datos, costo en fichas Y RUTA DE IMAGEN LOCAL
const REDEEMABLE_PLAYERS = [
    { id: 'donnarumma_95', name: 'Gianluigi Donnarumma', club: 'PSG', grl: 95, cost: 2000, image: require('../assets/imagecartas/champions/donnarumma_95.png') },
    { id: 'dumfries_93', name: 'Denzel Dumfries', club: 'Inter', grl: 93, cost: 550, image: require('../assets/imagecartas/champions/dumfries_93.png') },
    { id: 'bastoni_93', name: 'Alessandro Bastoni', club: 'Inter', grl: 93, cost: 700, image: require('../assets/imagecartas/champions/bastoni_93.png') },
    { id: 'saliba_95', name: 'William Saliba', club: 'Arsenal', grl: 95, cost: 1300, image: require('../assets/imagecartas/champions/saliba_95.png') },
    { id: 'hakimi_94', name: 'Achraf Hakimi', club: 'PSG', grl: 94, cost: 1000, image: require('../assets/imagecartas/champions/hakimi_94.png') },
    { id: 'vitinha_94', name: 'Vitinha', club: 'PSG', grl: 94, cost: 900, image: require('../assets/imagecartas/champions/vitinha_94.png') },
    { id: 'rice_95', name: 'Declan Rice', club: 'Arsenal', grl: 95, cost: 1000, image: require('../assets/imagecartas/champions/rice_95.png') },
    { id: 'pedri_95', name: 'Pedri', club: 'Barcelona', grl: 95, cost: 1500, image: require('../assets/imagecartas/champions/pedri_95.png') },
    { id: 'dembele_95', name: 'Ousmane Dembélé', club: 'PSG', grl: 95, cost: 1600, image: require('../assets/imagecartas/champions/dembele_95.png') },
    { id: 'lautaro_95', name: 'Lautaro Martínez', club: 'Inter', grl: 95, cost: 1500, image: require('../assets/imagecartas/champions/lautaro_95.png') },
    { id: 'yamal_95', name: 'Lamine Yamal', club: 'Barcelona', grl: 95, cost: 1600, image: require('../assets/imagecartas/champions/yamal_95.png') },
    { id: 'szczesny_92', name: 'Szczesny', club: 'Juventus', grl: 92, cost: 450, image: require('../assets/imagecartas/champions/szczesny_92.png') }, // Asumo club Juventus y nombre de archivo
    { id: 'mendes_93', name: 'Nuno Mendes', club: 'PSG', grl: 93, cost: 650, image: require('../assets/imagecartas/champions/mendes_93.png') },
    { id: 'inigo_martinez_92', name: 'Íñigo Martinez', club: 'Barcelona', grl: 92, cost: 350, image: require('../assets/imagecartas/champions/inigo_martinez_92.png') }, // Asumo club Barcelona y nombre de archivo
    { id: 'acerbi_90', name: 'Acerbi', club: 'Inter', grl: 90, cost: 100, image: require('../assets/imagecartas/champions/acerbi_90.png') },
    { id: 'skelly_93', name: 'Lewis Skelly', club: 'Arsenal', grl: 93, cost: 600, image: require('../assets/imagecartas/champions/skelly_93.png') }, // Asumo club Arsenal y nombre de archivo
    { id: 'joao_neves_94', name: 'Joao Neves', club: 'Benfica', grl: 94, cost: 850, image: require('../assets/imagecartas/champions/joao_neves_94.png') }, // Asumo club Benfica y nombre de archivo
    { id: 'odegard_93', name: 'Odegaard', club: 'Arsenal', grl: 93, cost: 750, image: require('../assets/imagecartas/champions/odegard_93.png') }, // Corregido nombre y asumo club Arsenal y nombre de archivo
    { id: 'dani_olmo_93', name: 'Dani Olmo', club: 'RB Leipzig', grl: 93, cost: 700, image: require('../assets/imagecartas/champions/dani_olmo_93.png') }, // Asumo club RB Leipzig y nombre de archivo
    { id: 'raphinha_94', name: 'Raphinha', club: 'Barcelona', grl: 94, cost: 900, image: require('../assets/imagecartas/champions/raphinha_94.png') }, // Asumo club Barcelona y nombre de archivo
    { id: 'kvaratskhelia_94', name: 'Kvaratskhelia', club: 'Napoli', grl: 94, cost: 900, image: require('../assets/imagecartas/champions/kvaratskhelia_94.png') }, // Asumo club Napoli y nombre de archivo
    { id: 'lewandowski_94', name: 'Lewandowski', club: 'Barcelona', grl: 94, cost: 850, image: require('../assets/imagecartas/champions/lewandowski_94.png') }, // Asumo club Barcelona y nombre de archivo
    { id: 'sommer_93', name: 'Sommer', club: 'Inter', grl: 93, cost: 500, image: require('../assets/imagecartas/champions/sommer_93.png') }, // Asumo club Inter y nombre de archivo
    { id: 'ferran_torres_92', name: 'Ferran Torres', club: 'Barcelona', grl: 92, cost: 400, image: require('../assets/imagecartas/champions/ferran_torres_92.png') }, // Asumo club Barcelona y nombre de archivo
];


const ChampionsLeagueEventScreen = () => {
    const navigation = useNavigation();
    // Acceder a las fichas Champions y al estado de jugadores reclamados desde el contexto
    // Debes añadir 'championsTokens' y 'claimedEventPlayers' (o similar) a tu GameContext
    const { championsTokens, claimedEventPlayers, subtractChampionsTokens, addPlayerToInventory, markEventPlayerAsClaimed } = useContext(GameContext);

    // Configurar opciones del header
    useEffect(() => {
        navigation.setOptions({
            title: '¡Noche de Champions!', // Título específico para esta pantalla
            // Puedes añadir headerLeft o headerRight aquí si quieres botones específicos
        });
    }, [navigation]);

        // Effect to log state changes for debugging
        useEffect(() => {
            console.log('DEBUG_CHAMPIONS_SCREEN: championsTokens changed:', championsTokens);
        }, [championsTokens]);

        useEffect(() => {
            console.log('DEBUG_CHAMPIONS_SCREEN: claimedEventPlayers changed:', claimedEventPlayers);
        }, [claimedEventPlayers]);


    // Función para navegar a desafíos específicos de la Champions (si los creas)
    const navigateToChampionsChallenge = (challengeName) => {
        console.log(`DEBUG_CHAMPIONS_SCREEN: Navegando a desafío de Champions: ${challengeName}`);
        // Ejemplo: navigation.navigate('ChampionsChallengeFinal');
        // Asegúrate de haber registrado estas pantallas en EventosStack en App.js
    };

    // Función para navegar a la pantalla de Intercambio de Jugadores
    const navigateToExchange = () => {
        console.log('DEBUG_CHAMPIONS_SCREEN: Navegando a Intercambio de Jugadores Champions');
        // *** DESCOMENTAR ESTA LÍNEA Y ASEGURARSE DE QUE 'ChampionsExchange' SEA EL NOMBRE DE RUTA CORRECTO ***
        // *** Y QUE LA PANTALLA ChampionsExchangeScreen ESTÉ REGISTRADA EN App.js ***
        navigation.navigate('ChampionsExchange'); // <-- Descomentado
    };

    // Función para intentar reclamar un jugador
    const handleClaimPlayer = (player) => {
        console.log(`DEBUG_CHAMPIONS_SCREEN: Intentando canjear jugador: ${player.name} (ID: ${player.id}) por ${player.cost} fichas.`);
        // Verificar si el jugador ya ha sido reclamado (usando el estado del contexto)
        if (claimedEventPlayers && claimedEventPlayers[player.id]) {
            console.log(`DEBUG_CHAMPIONS_SCREEN: Jugador ${player.id} ya reclamado.`);
            Alert.alert('Ya Reclamado', `Ya has reclamado a ${player.name}.`);
            return;
        }

        // Verificar si tiene suficientes fichas
        if (championsTokens >= player.cost) {
            console.log(`DEBUG_CHAMPIONS_SCREEN: Suficientes fichas (${championsTokens}) para canjear (${player.cost}). Mostrando alerta de confirmación.`);
            Alert.alert(
                'Confirmar Reclamo',
                `¿Estás seguro de que quieres canjear a ${player.name} por ${player.cost} Fichas Champions?`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                        onPress: () => console.log('DEBUG_CHAMPIONS_SCREEN: Canje cancelado.')
                    },
                    {
                        text: 'Canjear',
                        onPress: () => {
                                console.log('DEBUG_CHAMPIONS_SCREEN: Confirmación de canje aceptada. Llamando a funciones del contexto.');
                            // Lógica para restar fichas, añadir jugador al inventario y marcar como reclamado
                            // Estas funciones deben existir en tu GameContext
                            if (subtractChampionsTokens && addPlayerToInventory && markEventPlayerAsClaimed) {
                                console.log(`DEBUG_CHAMPIONS_SCREEN: Llamando a subtractChampionsTokens(${player.cost})`);
                                subtractChampionsTokens(player.cost); // Restar fichas
                                console.log(`DEBUG_CHAMPIONS_SCREEN: Llamando a addPlayerToInventory(${player.name})`);
                                addPlayerToInventory(player); // Añadir jugador al inventario
                                console.log(`DEBUG_CHAMPIONS_SCREEN: Llamando a markEventPlayerAsClaimed(${player.id})`);
                                markEventPlayerAsClaimed(player.id); // Marcar como reclamado en el contexto
                                Alert.alert('¡Jugador Reclamado!', `¡Has añadido a ${player.name} a tu equipo!`);
                                console.log('DEBUG_CHAMPIONS_SCREEN: Alerta de éxito mostrada.');
                            } else {
                                // Manejar el caso si las funciones del contexto no están definidas
                                console.error("DEBUG_CHAMPIONS_SCREEN: Error: GameContext functions for claiming players are not defined.");
                                Alert.alert("Error", "No se pudo completar el canje. Funciones del juego no disponibles.");
                            }
                        },
                    },
                ]
            );
        } else {
            console.log(`DEBUG_CHAMPIONS_SCREEN: Fichas insuficientes. Necesitas ${player.cost}, tienes ${championsTokens}.`);
            Alert.alert('Fichas Insuficientes', `Necesitas ${player.cost} Fichas Champions para canjear a ${player.name}. Tienes ${championsTokens !== undefined ? championsTokens : 0}.`);
        }
    };


    // Función para calcular las fichas obtenidas por GRL (para mostrar información, no para la lógica de canje real aquí)
    const calculateExchangeValue = (grl) => {
        if (grl >= 97) return 50; // 97+
        if (grl === 96) return 40; // 96
        if (grl === 95) return 35; // 95
        if (grl >= 93) return 30; // 93-94
        if (grl >= 91) return 25; // 91-92
        if (grl >= 89) return 20; // 89-90
        if (grl >= 86) return 15; // 86-88
        if (grl >= 80) return 10; // 80-85
        if (grl >= 75) return 5; // 75-80
        return 0; // GRL por debajo de 75
    };


    return (
        <ImageBackground
            source={{ uri: CHAMPIONS_BACKGROUND_URL }} // Usando la imagen de fondo de Champions
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>¡Bienvenido a la Noche de Champions!</Text>
                <Text style={styles.description}>
                    Participa en desafíos especiales inspirados en la UEFA Champions League para ganar recompensas exclusivas.
                </Text>

                {/* Mostrar la cantidad de Fichas Champions que tiene el usuario */}
                <View style={styles.tokenContainer}>
                    <Image source={{ uri: CHAMPIONS_TOKEN_IMAGE_URL }} style={styles.tokenImage} onError={(e) => console.error("Error loading token image:", e.nativeEvent.error)} />
                    <Text style={styles.tokenText}>Mis Fichas Champions: {championsTokens !== undefined ? championsTokens : 'Cargando...'}</Text>
                </View>


                <Text style={styles.sectionTitle}>Desafíos Disponibles:</Text>

                {/* Ejemplo de botón para un desafío específico de la Champions */}
                <TouchableOpacity
                    style={styles.challengeButton}
                    onPress={() => navigateToChampionsChallenge('ChampionsChallengeFinal')} // Reemplaza con el nombre de tu ruta real si la creas
                >
                    <Text style={styles.challengeButtonText}>Desafío: Final Histórica</Text>
                </TouchableOpacity>

                {/* Añade más botones para otros desafíos de la Champions aquí */}
                <TouchableOpacity
                    style={styles.challengeButton}
                    onPress={() => navigateToChampionsChallenge('ChampionsChallengeGroupStage')} // Reemplaza con el nombre de tu ruta real
                >
                    <Text style={styles.challengeButtonText}>Desafío: Fase de Grupos</Text>
                </TouchableOpacity>

                {/* SECCIÓN DE INTERCAMBIO DE JUGADORES (INFORMACIÓN Y BOTÓN) */}
                <Text style={styles.sectionTitle}>Intercambio de Jugadores:</Text>

                <Text style={styles.exchangeInfoText}>
                    Canjea jugadores de tu inventario por Fichas Champions.
                    La cantidad de fichas depende del GRL del jugador:
                </Text>
                {/* Mostrar la tabla de valores de intercambio */}
                <View style={styles.exchangeTable}>
                    <Text style={styles.exchangeTableRow}>Jugadores para el intercambio:</Text>
                    <Text style={styles.exchangeTableRow}>75-80 GRL: {calculateExchangeValue(75)} Fichas</Text>
                    <Text style={styles.exchangeTableRow}>80-85 GRL: {calculateExchangeValue(80)} Fichas</Text>
                    <Text style={styles.exchangeTableRow}>86-88 GRL: {calculateExchangeValue(86)} Fichas</Text>
                    <Text style={styles.exchangeTableRow}>89-90 GRL: {calculateExchangeValue(89)} Fichas</Text>
                    <Text style={styles.exchangeTableRow}>91-92 GRL: {calculateExchangeValue(91)} Fichas</Text>
                    <Text style={styles.exchangeTableRow}>93-94 GRL: {calculateExchangeValue(93)} Fichas</Text>
                    <Text style={styles.exchangeTableRow}>95 GRL: {calculateExchangeValue(95)} Fichas</Text> {/* Corregido para mostrar 95 */}
                    <Text style={styles.exchangeTableRow}>96 GRL: {calculateExchangeValue(96)} Fichas</Text> {/* Corregido para mostrar 96 */}
                    <Text style={styles.exchangeTableRow}>97+ GRL: {calculateExchangeValue(97)} Fichas</Text> {/* Corregido para mostrar 97+ */}
                </View>


                <TouchableOpacity
                    style={[styles.challengeButton, styles.exchangeButton]}
                    onPress={navigateToExchange} // Llama a la función para navegar a la pantalla de canje
                >
                    <Text style={styles.challengeButtonText}>Ir a Canjear Jugadores</Text>
                </TouchableOpacity>
                {/* FIN SECCIÓN DE INTERCAMBIO */}


                {/* *** SECCIÓN DE JUGADORES CANJEABLES *** */}
                <Text style={styles.sectionTitle}>Jugadores Canjeables:</Text>

                <View style={styles.redeemablePlayersContainer}>
                    {REDEEMABLE_PLAYERS.map(player => {
                        // Verificar si el jugador ha sido reclamado (usando el estado del contexto)
                        const isClaimed = claimedEventPlayers && claimedEventPlayers[player.id];

                        return (
                            <View key={player.id} style={styles.playerItem}>
                                {/* *** IMAGEN DEL JUGADOR *** */}
                                {/* Asegúrate de que la ruta en REDEEMABLE_PLAYERS sea correcta */}
                                <Image
                                    source={player.image} // Usa la imagen local importada
                                    style={styles.playerImage} // Aplica el nuevo estilo
                                    resizeMode="contain"
                                        onError={(e) => console.error(`Error loading player image ${player.id}:`, e.nativeEvent.error)} // Log error for image loading
                                />
                                {/* *** FIN IMAGEN DEL JUGADOR *** */}

                                <View style={styles.playerInfo}>
                                    <Text style={styles.playerName}>{player.name}</Text>
                                    <Text style={styles.playerDetails}>{player.club} | GRL {player.grl}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.claimButton, isClaimed && styles.claimedButton]} // Cambiar estilo si está reclamado
                                    onPress={() => handleClaimPlayer(player)}
                                    disabled={isClaimed} // Deshabilitar si está reclamado
                                >
                                    {isClaimed ? (
                                        <Text style={styles.claimedButtonText}>☑️ Reclamado</Text> // Mostrar checkmark y texto si está reclamado
                                    ) : (
                                        <View style={styles.claimButtonContent}>
                                            <Image source={{ uri: CHAMPIONS_TOKEN_IMAGE_URL }} style={styles.claimButtonTokenImage} onError={(e) => console.error("Error loading claim button token image:", e.nativeEvent.error)} />
                                            <Text style={styles.claimButtonText}>{player.cost}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
                {/* *** FIN SECCIÓN *** */}


            </ScrollView>
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
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,50,0.7)', // Fondo azul oscuro semi-transparente
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffeb3b', // Amarillo/Dorado
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    description: {
        fontSize: 16,
        color: '#e0e0e0', // Gris claro
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 15,
        textDecorationLine: 'underline', // Subrayado
    },
    // Estilo para mostrar la cantidad de fichas del usuario
    tokenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffeb3b',
    },
    tokenImage: {
        width: 25,
        height: 25,
        marginRight: 10,
        resizeMode: 'contain',
    },
    tokenText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Estilos de los botones de desafío
    challengeButton: {
        backgroundColor: '#3f51b5', // Azul medio
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginVertical: 8,
        width: '85%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4.65,
        elevation: 6,
    },
    challengeButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    // Estilo específico para el botón de intercambio
    exchangeButton: {
        backgroundColor: '#ff9800', // Naranja para diferenciarlo
    },
    // Estilos para la información de intercambio
    exchangeInfoText: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    exchangeTable: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        width: '90%',
    },
    exchangeTableRow: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 3,
    },
    // Estilos para la lista de jugadores canjeables
    redeemablePlayersContainer: {
        width: '100%',
        alignItems: 'center',
    },
    playerItem: {
        flexDirection: 'row',
        alignItems: 'center', // Alinear verticalmente al centro
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 10, // Reducir padding ligeramente
        marginVertical: 5,
        width: '95%',
        borderWidth: 1,
        borderColor: '#ffeb3b',
    },
    // *** NUEVO ESTILO PARA LA IMAGEN DEL JUGADOR ***
    playerImage: {
        width: 50, // Ancho de la imagen del jugador
        height: 50, // Alto de la imagen del jugador
        marginRight: 15, // Espacio a la derecha de la imagen
        resizeMode: 'contain',
    },
    playerInfo: {
        flex: 1, // Permite que la info del jugador ocupe el espacio restante
        marginRight: 10,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    playerDetails: {
        fontSize: 14,
        color: '#e0e0e0',
    },
    claimButton: {
        backgroundColor: '#4CAF50', // Verde para canjear
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        minWidth: 100, // Ancho mínimo para el botón
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Para alinear la imagen y el texto
    },
    claimedButton: {
        backgroundColor: '#757575', // Gris cuando está reclamado
    },
    claimButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    claimButtonTokenImage: {
        width: 20,
        height: 20,
        marginRight: 5,
        resizeMode: 'contain',
    },
    claimButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChampionsLeagueEventScreen;