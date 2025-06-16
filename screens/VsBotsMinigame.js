import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import GameContext from '../context/GameContext';
import { playersData } from '../data/players'; // Ajusta la ruta si es necesario

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#222',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    matchInfoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    matchTime: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 5,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 15,
    },
    teamName: {
        fontSize: 18,
        color: '#ddd',
    },
    teamRosterContainer: {
        marginBottom: 20,
    },
    teamTitle: {
        fontSize: 18,
        color: '#ddd',
        marginBottom: 5,
        textAlign: 'center',
    },
    playerName: {
        color: 'white',
        fontSize: 14,
    },
    eventText: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 3,
    },
    playButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    playButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#555',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    }
});

const VsBotsMinigame = ({ onClose }) => {
    const { team: userTeam, addCoins } = useContext(GameContext);
    const [botTeam, setBotTeam] = useState(null);
    const [userScore, setUserScore] = useState(0);
    const [botScore, setBotScore] = useState(0);
    const [matchTime, setMatchTime] = useState(0);
    const [matchEvents, setMatchEvents] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [rewardMessage, setRewardMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (Object.keys(userTeam).filter(key => userTeam[key]).length < 11) {
            setError('Necesitas 11 jugadores para jugar.');
        } else {
            setError('');
            generateRandomBotTeam();
        }
    }, [userTeam]);

    const generateRandomBotTeam = () => {
        if (!playersData || playersData.length === 0) {
            console.warn("playersData está vacío o indefinido.");
            return;
        }

        const botTeam = {};
        const positions = ['portero', 'defensa_izquierda', 'defensa_central_izquierda', 'defensa_central_derecha', 'defensa_derecha', 'mediocampista_central', 'mediocampista_izquierda', 'mediocampista_derecha', 'delantero_centro', 'delantero_izquierda', 'delantero_derecha'];
        const availablePlayers = [...playersData];
        const generatedTeam = {};

        const shuffledPlayers = availablePlayers.sort(() => Math.random() - 0.5);

        positions.forEach(position => {
            const eligiblePlayers = shuffledPlayers.filter(player => player?.position?.toLowerCase().includes(position.split('_').pop()));
            if (eligiblePlayers.length > 0) {
                generatedTeam[position] = eligiblePlayers[0];
                shuffledPlayers.splice(shuffledPlayers.indexOf(eligiblePlayers[0]), 1);
            } else {
                generatedTeam[position] = null;
            }
        });
        setBotTeam(generatedTeam);
        setUserScore(0);
        setBotScore(0);
        setMatchTime(0);
        setMatchEvents([]);
        setRewardMessage('');
        setIsSimulating(false);
    };

    const simulateMatch = () => {
        if (error) return;
        if (isSimulating) return;
        setIsSimulating(true);
        setUserScore(0);
        setBotScore(0);
        setMatchTime(0);
        setMatchEvents([]);
        setRewardMessage('');

        const interval = setInterval(() => {
            setMatchTime(prevTime => prevTime + 1);
        }, 100); // Simular cada 100ms como 1 minuto

        const gameInterval = setInterval(() => {
            if (matchTime < 90) {
                const userRating = calculateTeamRating(userTeam);
                const botRating = calculateTeamRating(botTeam);

                const userChance = Math.random() * userRating;
                const botChance = Math.random() * botRating;

                if (userChance > botChance + 50) {
                    setUserScore(prevScore => prevScore + 1);
                    setMatchEvents(prevEvents => [...prevEvents, `${matchTime}' ¡Gol del Jugador!`]);
                } else if (botChance > userChance + 50) {
                    setBotScore(prevScore => prevScore + 1);
                    setMatchEvents(prevEvents => [...prevEvents, `${matchTime}' ¡Gol del Bot!`]);
                } else if (Math.random() < 0.1) {
                    setMatchEvents(prevEvents => [...prevEvents, `${matchTime}' Ocasión peligrosa.`]);
                }
            } else {
                clearInterval(interval);
                clearInterval(gameInterval);
                setIsSimulating(false);
                calculateRewards();
            }
        }, 1000); // Eventos cada segundo (simulando varios minutos)
    };

    const calculateTeamRating = (team) => {
        let totalRating = 0;
        let playerCount = 0;
        for (const player of Object.values(team)) {
            if (player?.rating) {
                totalRating += player.rating;
                playerCount++;
            }
        }
        return playerCount > 0 ? totalRating / playerCount : 70;
    };

    const calculateRewards = () => {
        if (userScore > botScore) {
            let reward = 2;
            if (userScore - botScore > 3) {
                reward = 5;
            }
            addCoins(reward);
            setRewardMessage(`¡Ganaste! Obtuviste ${reward} monedas.`);
        } else if (botScore > userScore) {
            setRewardMessage('Perdiste. ¡Inténtalo de nuevo!');
        } else {
            setRewardMessage('¡Empate!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Modo VS Bot</Text>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <View style={styles.matchInfoContainer}>
                    <Text style={styles.matchTime}>Tiempo: {matchTime}'</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.teamName}>Tu Equipo</Text>
                        <Text style={styles.scoreText}>{userScore}</Text>
                        <Text style={styles.scoreText}>-</Text>
                        <Text style={styles.scoreText}>{botScore}</Text>
                        <Text style={styles.teamName}>Bot Equipo</Text>
                    </View>
                </View>
            )}

            <View style={styles.teamRosterContainer}>
                <Text style={styles.teamTitle}>Tu Plantilla:</Text>
                {Object.entries(userTeam).map(([position, player]) => (
                    <Text key={position} style={styles.playerName}>{position}: {player?.name || 'Vacío'}</Text>
                ))}
            </View>

            <View style={styles.teamRosterContainer}>
                <Text style={styles.teamTitle}>Equipo Bot:</Text>
                {botTeam && Object.entries(botTeam).map(([position, player]) => (
                    <Text key={position} style={styles.playerName}>{player?.name || 'Vacío'}</Text>
                ))}
            </View>

            {error ? null : !isSimulating ? (
                <TouchableOpacity style={styles.playButton} onPress={simulateMatch}>
                    <Text style={styles.playButtonText}>Simular Partido</Text>
                </TouchableOpacity>
            ) : (
                <View>
                    <Text style={styles.teamTitle}>Relato del Partido:</Text>
                    {matchEvents.map((event, index) => (
                        <Text key={index} style={styles.eventText}>{event}</Text>
                    ))}
                    {rewardMessage ? <Text style={{ color: 'green', textAlign: 'center', marginTop: 10 }}>{rewardMessage}</Text> : null}
                </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Text style={styles.backButtonText}>Regresar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default VsBotsMinigame;