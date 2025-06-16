

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider'; // <<-- IMPORTA EL SLIDER
import { GameContext } from '../context/GameContext';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { ALL_AUDIO_FILES } from '../data/audio';

const SettingsScreen = ({ navigation }) => {
    const {
        isMusicEnabled,
        toggleMusic,
        playBackgroundMusic,
        stopBackgroundMusic,
        clearAllGameData,
        currentPlayingMusicKey,
        setCurrentPlayingMusicKey,
        musicVolume,           // <<-- Obtén el estado del volumen
        setBackgroundMusicVolume, // <<-- Obtén la función para establecer el volumen
    } = useContext(GameContext);

    const [musicToggle, setMusicToggle] = useState(isMusicEnabled);
    const [localMusicVolume, setLocalMusicVolume] = useState(musicVolume); // <<-- NUEVO ESTADO LOCAL para el Slider

    // Sincronizar el estado del switch y volumen con el contexto cuando cambian
    useEffect(() => {
        setMusicToggle(isMusicEnabled);
    }, [isMusicEnabled]);

    useEffect(() => {
        setLocalMusicVolume(musicVolume); // Sincroniza el slider con el volumen del contexto
    }, [musicVolume]);


    const handleMusicToggle = () => {
        const newState = !musicToggle;
        setMusicToggle(newState);
        toggleMusic(newState);

        if (newState) {
            if (!currentPlayingMusicKey) {
                playBackgroundMusic('algoSuperficial', true);
                setCurrentPlayingMusicKey('algoSuperficial');
            } else {
                playBackgroundMusic(currentPlayingMusicKey, true);
            }
        } else {
            stopBackgroundMusic();
        }
    };

    const handleClearData = () => {
        Alert.alert(
            "Borrar Datos del Juego",
            "¿Estás seguro de que quieres borrar TODOS tus datos de juego? Esta acción es irreversible.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Borrar",
                    onPress: () => {
                        clearAllGameData();
                        Alert.alert("Datos Borrados", "Todos tus datos de juego han sido eliminados.");
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleSelectMusic = (musicKey) => {
        if (isMusicEnabled) {
            stopBackgroundMusic(); // Pausa la música actual antes de cambiar
        }
        playBackgroundMusic(musicKey, true);
        setCurrentPlayingMusicKey(musicKey);
        if (!isMusicEnabled) {
             toggleMusic(true); // Habilita la música si estaba deshabilitada
        }
    };

    // --- NUEVA FUNCIÓN: Manejar el cambio del Slider de volumen ---
    const handleVolumeChange = (value) => {
        setLocalMusicVolume(value); // Actualiza el estado local del slider
        setBackgroundMusicVolume(value); // Llama a la función del contexto para aplicar el volumen
    };

    const getMusicTitle = (key) => {
        if (key.includes('Sound')) return null; // Filtrar efectos de sonido
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ajustes</Text>

            {/* Opción de Música ON/OFF */}
            <View style={styles.settingItem}>
                <Ionicons name="musical-notes" size={24} color="#FFF" style={styles.icon} />
                <Text style={styles.settingText}>Música del Juego</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={musicToggle ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleMusicToggle}
                    value={musicToggle}
                />
            </View>

            {/* Control de Volumen de Música */}
            <View style={styles.settingItem}>
                <Ionicons name="volume-high" size={24} color="#FFF" style={styles.icon} />
                <Text style={styles.settingText}>Volumen de Música</Text>
                <Slider
                    style={{ width: '50%', height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={localMusicVolume} // Usa el estado local para el slider
                    onSlidingComplete={handleVolumeChange} // Cuando el usuario suelta el slider
                    minimumTrackTintColor="#1abc9c" // Color de la pista mínima
                    maximumTrackTintColor="#ecf0f1" // Color de la pista máxima
                    thumbTintColor="#f5dd4b" // Color del pulgar
                />
            </View>

            {/* Lista de Canciones Seleccionables */}
            <Text style={styles.subheader}>Seleccionar Pista de Fondo</Text>
            <ScrollView style={styles.musicListContainer}>
                {Object.keys(ALL_AUDIO_FILES).map((key) => {
                    if (key.includes('Sound')) return null;

                    const isSelected = key === currentPlayingMusicKey;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.musicItem,
                                isSelected && styles.selectedMusicItem
                            ]}
                            onPress={() => handleSelectMusic(key)}
                        >
                            <Text style={[
                                styles.musicItemText,
                                isSelected && styles.selectedMusicItemText
                            ]}>
                                {getMusicTitle(key)}
                            </Text>
                            {isSelected && (
                                <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Botón para borrar datos del juego */}
            <CustomButton
                title="Borrar Todos los Datos del Juego"
                onPress={handleClearData}
                style={styles.clearDataButton}
                textStyle={styles.clearDataButtonText}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 40,
        marginTop: 50,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    settingText: {
        flex: 1,
        fontSize: 18,
        color: '#FFF',
    },
    subheader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 20,
        marginBottom: 15,
        alignSelf: 'flex-start',
        marginLeft: '5%',
    },
    musicListContainer: {
        width: '90%',
        maxHeight: 200,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
    },
    musicItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    musicItemText: {
        color: '#CCC',
        fontSize: 16,
    },
    selectedMusicItem: {
        backgroundColor: '#3a3a3a',
    },
    selectedMusicItemText: {
        color: '#27ae60',
        fontWeight: 'bold',
    },
    clearDataButton: {
        backgroundColor: '#e74c3c',
        marginTop: 50,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '80%',
    },
    clearDataButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SettingsScreen;