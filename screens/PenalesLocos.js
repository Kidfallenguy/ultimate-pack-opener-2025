import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
// *** NO IMPORTAMOS useNavigation AQUÍ porque no es una pantalla de navegación principal en este uso ***
// import { useNavigation, StackActions } from '@react-navigation/native';

// Import GameContext
import { GameContext } from '../context/GameContext'; // <--- Asegúrate de la ruta

const LEGEND_TASK_GOALS_ID = 'score_30_goals_minijuegos'; // <--- Asegúrate de que coincida con tu contexto

// --- Constants ---
const { width, height } = Dimensions.get('window');

const MODES = {
  selection: 'selection',
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

const ECONOMY = {
  easy: { cost: 10, win: 15, lose: 5 },
  medium: { cost: 25, win: 40, lose: 10 },
  hard: { cost: 50, win: 75, lose: 20 },
};

const ANIMATION_DURATION = 800;
const RESULT_DISPLAY_DURATION = 1500;

const GOAL_CONTAINER_WIDTH = width * 0.9;
const GOAL_CONTAINER_HEIGHT = GOAL_CONTAINER_WIDTH * 0.6;
const GOAL_POST_IMAGE_URL = 'https://media.istockphoto.com/id/508552766/es/foto/poste-de-porter%C3%ADa.jpg?s=612x612&w=0&k=20&c=n4RVMXHBhbflThK9GBaCxHNgqJ419nG6H1gu1DAdF G=';

const BALL_START_POS_Y_OFFSET = height * 0.1;
const BALL_SIZE = 30;

const KEEPER_INITIAL_POS_X = GOAL_CONTAINER_WIDTH / 2;
const KEEPER_INITIAL_POS_Y = GOAL_CONTAINER_HEIGHT * 0.4;
const KEEPER_SIZE = 80;

const BACKGROUND_URL = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Estadio_mas_monumental.jpg';
const BALL_URL = 'https://static.vecteezy.com/system/resources/previews/011/421/474/non_2x/soccer-ball-realistic-png.png';
const KEEPER_URL = 'https://www.pngplay.com/wp-content/uploads/13/Iker-Casillas-Background-PNG-Image.png';

const ZONES = {
  easy: {
    left_up: { x: GOAL_CONTAINER_WIDTH * 0.15, y: GOAL_CONTAINER_HEIGHT * 0.1 },
    left_down: { x: GOAL_CONTAINER_WIDTH * 0.15, y: GOAL_CONTAINER_HEIGHT * 0.5 },
    middle_up: { x: GOAL_CONTAINER_WIDTH * 0.5, y: GOAL_CONTAINER_HEIGHT * 0.1 },
    middle_down: { x: GOAL_CONTAINER_WIDTH * 0.5, y: GOAL_CONTAINER_HEIGHT * 0.5 },
    right_up: { x: GOAL_CONTAINER_WIDTH * 0.85, y: GOAL_CONTAINER_HEIGHT * 0.1 },
    right_down: { x: GOAL_CONTAINER_WIDTH * 0.85, y: GOAL_CONTAINER_HEIGHT * 0.5 },
    chip: { x: GOAL_CONTAINER_WIDTH * 0.5, y: GOAL_CONTAINER_HEIGHT * 0.05 },
  },
  medium: {
    left: { x: GOAL_CONTAINER_WIDTH * 0.25, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    middle: { x: GOAL_CONTAINER_WIDTH * 0.5, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    right: { x: GOAL_CONTAINER_WIDTH * 0.75, y: GOAL_CONTAINER_HEIGHT * 0.3 },
  },
  hard: {
    left_total: { x: GOAL_CONTAINER_WIDTH * 0.1, y: GOAL_CONTAINER_HEIGHT * 0.4 },
    right_total: { x: GOAL_CONTAINER_WIDTH * 0.9, y: GOAL_CONTAINER_HEIGHT * 0.4 },
  },
};

const KEEPER_SAVES = {
  easy: {
    save_left: { x: GOAL_CONTAINER_WIDTH * 0.15, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    save_right: { x: GOAL_CONTAINER_WIDTH * 0.85, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    save_center: { x: GOAL_CONTAINER_WIDTH * 0.5, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    stay_center: { x: GOAL_CONTAINER_WIDTH * 0.5, y: KEEPER_INITIAL_POS_Y },
  },
  medium: {
    save_left_wide: { x: GOAL_CONTAINER_WIDTH * 0.15, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    save_right_wide: { x: GOAL_CONTAINER_WIDTH * 0.85, y: GOAL_CONTAINER_HEIGHT * 0.3 },
    save_center_medium: { x: GOAL_CONTAINER_WIDTH * 0.5, y: GOAL_CONTAINER_HEIGHT * 0.4 },
    random_dive: null,
  },
  hard: {
    save_left_full: { x: GOAL_CONTAINER_WIDTH * 0.1, y: GOAL_CONTAINER_HEIGHT * 0.4 },
    right_full: { x: GOAL_CONTAINER_WIDTH * 0.9, y: GOAL_CONTAINER_HEIGHT * 0.4 },
    super_reflex: null,
  },
};

const SAVE_LOGIC = {
  easy: {
    save_left: ['left_up', 'left_down'],
    save_right: ['right_up', 'right_down'],
    save_center: ['middle_up', 'middle_down'],
    stay_center: ['chip'],
  },
  medium: {
    save_left_wide: ['left'],
    save_right_wide: ['right'],
    save_center_medium: ['middle'],
    random_dive: ['left', 'middle', 'right'],
  },
  hard: {
    save_left_full: ['left_total'],
    right_full: ['right_total'],
    super_reflex: ['left_total', 'right_total'],
  },
};

const KEEPER_SAVE_PROBABILITIES = {
  easy: { save_left: 0.25, save_right: 0.25, save_center: 0.3, stay_center: 0.2 },
  medium: { save_left_wide: 0.3, save_right_wide: 0.3, save_center_medium: 0.3, random_dive: 0.1 },
  hard: { save_left_full: 0.45, right_full: 0.45, super_reflex: 0.1 },
};

// --- Component ---
// Acepta la prop onExit
const PenalesLocosScreen = ({ onExit }) => {
  // Usa GameContext
  const { coins, subtractCoins, addCoins, updateLegendTaskProgress } = useContext(GameContext);

  // State hooks
  const [currentMode, setCurrentMode] = useState(MODES.selection);
  const [localScore, setLocalScore] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerShotZone, setPlayerShotZone] = useState(null);
  const [keeperSaveZone, setKeeperSaveZone] = useState(null);

  // Animated values
  const ballTranslateX = useRef(new Animated.Value(0)).current;
  const ballTranslateY = useRef(new Animated.Value(0)).current;
  const keeperTranslateX = useRef(new Animated.Value(0)).current;
  const keeperTranslateY = useRef(new Animated.Value(0)).current;

  // *** REMOVEMOS el useEffect que configura el header, ya que no es una pantalla de navegación principal ***
  // useEffect(() => { ... navigation.setOptions ... }, [...]);

  // Reset animations after result message disappears
  useEffect(() => {
    if (gameMessage) {
      const timer = setTimeout(() => {
        setGameMessage('');
        setGameResult(null);
        setIsAnimating(false);
        ballTranslateX.setValue(0);
        ballTranslateY.setValue(0);
        keeperTranslateX.setValue(0);
        keeperTranslateY.setValue(0);
      }, RESULT_DISPLAY_DURATION);
      return () => clearTimeout(timer);
    }
  }, [gameMessage]);

  // --- Helper Functions ---
  const getKeeperRandomSave = (mode) => { /* ... existing logic ... */
        const saves = Object.keys(KEEPER_SAVE_PROBABILITIES[mode]);
        const probabilities = Object.values(KEEPER_SAVE_PROBABILITIES[mode]);
        let i, sum = 0;
        const r = Math.random();
        for (i in saves) {
          sum += probabilities[i];
          if (r <= sum) return saves[i];
        }
        return saves[saves.length - 1];
    };

  const determineOutcome = (mode, shotZone, saveZone) => { /* ... existing logic ... */
        if (mode === MODES.medium && saveZone === 'random_dive') {
            const canSave = SAVE_LOGIC[mode].random_dive.includes(shotZone);
            const randomSaveChance = 0.6;
            return canSave && Math.random() < randomSaveChance ? 'saved' : 'goal';

        } else if (mode === MODES.hard && saveZone === 'super_reflex') {
            const canSave = SAVE_LOGIC[mode].super_reflex.includes(shotZone);
            const superReflexChance = 0.8;
            return canSave && Math.random() < superReflexChance ? 'saved' : 'goal';

        } else {
            const zonesBlockedBySave = SAVE_LOGIC[mode][saveZone] || [];
            return zonesBlockedBySave.includes(shotZone) ? 'saved' : 'goal';
        }
    };

  // --- Event Handlers ---
  const handleModeSelect = (mode) => {
    setCurrentMode(mode);
    setLocalScore(0);
    setGameResult(null);
    setGameMessage('');
    setIsAnimating(false);
    ballTranslateX.setValue(0);
    ballTranslateY.setValue(0);
    keeperTranslateX.setValue(0);
    keeperTranslateY.setValue(0);
  };

  const handleShot = (shotZone) => {
    if (isAnimating || currentMode === MODES.selection || gameResult !== null) return;

    const modeEconomy = ECONOMY[currentMode];
    if (coins < modeEconomy.cost) {
      setGameMessage('¡Monedas Insuficientes!');
      setGameResult('not_enough_coins');
      setTimeout(() => {
         setGameMessage('');
         setGameResult(null);
      }, RESULT_DISPLAY_DURATION);
      return;
    }

    subtractCoins(modeEconomy.cost);
    setIsAnimating(true);
    setPlayerShotZone(shotZone);

    const keeperSave = getKeeperRandomSave(currentMode);
    setKeeperSaveZone(keeperSave);

    const ballTarget = ZONES[currentMode][shotZone];
    const keeperTarget = KEEPER_SAVES[currentMode][keeperSave];

    let finalKeeperTarget = keeperTarget;
    if (currentMode === MODES.medium && keeperSave === 'random_dive') {
      finalKeeperTarget = ballTarget;
    } else if (currentMode === MODES.hard && keeperSave === 'super_reflex') {
      finalKeeperTarget = ballTarget;
    }

    const goalAreaYStart = (height - GOAL_CONTAINER_HEIGHT) / 2;
    const ballAnimTargetX = (ballTarget.x + (width / 2 - GOAL_CONTAINER_WIDTH / 2)) - (width / 2 - BALL_SIZE / 2);
    const ballAnimTargetY = (ballTarget.y + goalAreaYStart) - (height - BALL_START_POS_Y_OFFSET - BALL_SIZE / 2);

    const keeperAnimTargetX = (finalKeeperTarget ? finalKeeperTarget.x : KEEPER_INITIAL_POS_X) - KEEPER_INITIAL_POS_X;
    const keeperAnimTargetY = (finalKeeperTarget ? finalKeeperTarget.y : KEEPER_INITIAL_POS_Y) - KEEPER_INITIAL_POS_Y;


    Animated.parallel([
        ballTranslateX.timing( { toValue: ballAnimTargetX, duration: ANIMATION_DURATION, easing: Easing.ease, useNativeDriver: true } ),
        ballTranslateY.timing( { toValue: ballAnimTargetY, duration: ANIMATION_DURATION, easing: Easing.ease, useNativeDriver: true } ),
        keeperTranslateX.timing( { toValue: keeperAnimTargetX, duration: ANIMATION_DURATION * 0.7, easing: Easing.ease, useNativeDriver: true } ),
        keeperTranslateY.timing( { toValue: keeperAnimTargetY, duration: ANIMATION_DURATION * 0.7, easing: Easing.ease, useNativeDriver: true } ),
    ]).start(() => {
      const outcome = determineOutcome(currentMode, shotZone, keeperSave);
      if (outcome === 'goal') {
        addCoins(modeEconomy.win);
        setLocalScore(prev => prev + 1);
        updateLegendTaskProgress(LEGEND_TASK_GOALS_ID, 1);
        setGameResult('goal');
        setGameMessage('¡GOL!');
      } else {
        subtractCoins(modeEconomy.lose);
        setGameResult('saved');
        setGameMessage('¡ATAJADA!');
      }
    });
  };

  // --- Render Functions ---
  const renderModeSelection = () => (
    <View style={styles.modeSelectionContainer}>
      <Text style={styles.modeSelectionTitle}>Selecciona Dificultad</Text>
      <TouchableOpacity style={styles.modeButton} onPress={() => handleModeSelect(MODES.easy)}>
        <Text style={styles.modeButtonText}>Fácil (Costo: {ECONOMY.easy.cost})</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeButton} onPress={() => handleModeSelect(MODES.medium)}>
        <Text style={styles.modeButtonText}>Medio (Costo: {ECONOMY.medium.cost})</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeButton} onPress={() => handleModeSelect(MODES.hard)}>
        <Text style={styles.modeButtonText}>Difícil (Costo: {ECONOMY.hard.cost})</Text>
      </TouchableOpacity>
      {/* Botón Salir dentro de la vista de selección de modo */}
      {onExit && (
        <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Text style={styles.exitButtonText}>← Salir</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderGame = () => {
    const currentZones = ZONES[currentMode];
    const zoneKeys = Object.keys(currentZones);

    let zoneStyleMap = {};
    if (currentMode === MODES.easy) {
        zoneStyleMap = {
            left_up: { top: '0%', left: '0%', width: '33%', height: '50%' },
            left_down: { top: '50%', left: '0%', width: '33%', height: '50%' },
            middle_up: { top: '0%', left: '33%', width: '34%', height: '50%' },
            middle_down: { top: '50%', left: '33%', width: '34%', height: '50%' },
            right_up: { top: '0%', left: '67%', width: '33%', height: '50%' },
            right_down: { top: '50%', left: '67%', width: '33%', height: '50%' },
            chip: { top: '-15%', left: '33%', width: '34%', height: '25%' },
        };
    } else if (currentMode === MODES.medium) {
        zoneStyleMap = {
            left: { top: '0%', left: '0%', width: '33%', height: '100%' },
            middle: { top: '0%', left: '33%', width: '34%', height: '100%' },
            right: { top: '0%', left: '67%', width: '33%', height: '100%' },
        };
    } else if (currentMode === MODES.hard) {
          zoneStyleMap = {
            left_total: { top: '0%', left: '0%', width: '50%', height: '100%' },
            right_total: { top: '0%', left: '50%', width: '50%', height: '100%' },
        };
    }

    return (
      <View style={styles.gameContainer}>
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Goles: {localScore}</Text>
          <Text style={styles.scoreText}>Monedas: {coins}</Text>
        </View>

        {/* Botón Salir dentro de la vista del juego */}
        {onExit && (
          <TouchableOpacity style={styles.exitButtonGame} onPress={onExit}>
            <Text style={styles.exitButtonText}>← Salir</Text>
          </TouchableOpacity>
        )}

        {/* Goal Area */}
        <View style={styles.goalContainer}>
            {/* Goal Post Image */}
            <Image
              source={{ uri: GOAL_POST_IMAGE_URL }}
              style={styles.goalImage}
              resizeMode="stretch"
            />

          {/* Zone Hitboxes */}
          {zoneKeys.map((zoneKey) => {
            const zoneStyle = zoneStyleMap[zoneKey];
            return (
              <TouchableOpacity
                key={zoneKey}
                style={[styles.zoneHitbox, zoneStyle]}
                onPress={() => handleShot(zoneKey)}
                disabled={isAnimating || gameResult !== null}
              >
              </TouchableOpacity>
            );
          })}

            {/* Keeper */}
            <Animated.View
             style={[
               styles.keeper,
               {
                 top: KEEPER_INITIAL_POS_Y - KEEPER_SIZE / 2,
                 left: KEEPER_INITIAL_POS_X - KEEPER_SIZE / 2,
                 transform: [
                   { translateX: keeperTranslateX },
                   { translateY: keeperTranslateY },
                 ],
               },
             ]}
            >
              <Image
                  source={{ uri: KEEPER_URL }}
                  style={styles.keeperImage}
                  resizeMode="contain"
              />
            </Animated.View>

            {/* Result Text Overlay */}
            {gameMessage ? (
             <View style={styles.resultOverlay}>
               <Text style={[
                 styles.resultText,
                 gameResult === 'goal' ? styles.resultTextGoal : (gameResult === 'saved' ? styles.resultTextSaved : {}),
                 gameResult === 'not_enough_coins' && styles.resultTextWarning
               ]}>
                 {gameMessage}
               </Text>
             </View>
            ) : null}

        </View>

          {/* Ball */}
          <Animated.View
              style={[
                styles.ball,
                {
                  bottom: BALL_START_POS_Y_OFFSET - BALL_SIZE / 2,
                  left: width / 2 - BALL_SIZE / 2,
                  width: BALL_SIZE,
                  height: BALL_SIZE,
                  zIndex: 3,
                },
              ]}
           >
              <Image
                 source={{ uri: BALL_URL }}
                 style={styles.ballImage}
                 resizeMode="contain"
              />
           </Animated.View>

      </View>
    );
  };

  // --- Main Render ---
  return (
    <ImageBackground
      source={{ uri: BACKGROUND_URL }}
      style={styles.background}
      resizeMode="cover"
    >
      {currentMode === MODES.selection ? renderModeSelection() : renderGame()}
    </ImageBackground>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // *** REMOVEMOS los estilos de headerButton porque ya no se controlan desde aquí ***
  // headerButtonLeft: { ... },
  // headerButtonRight: { ... },
  // headerButtonText: { ... },

  // Mode Selection Styles
  modeSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 30,
    borderRadius: 15,
    width: '80%',
    alignSelf: 'center',
    marginVertical: '10%',
  },
  modeSelectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Estilos para el botón Salir interno
  exitButton: {
    backgroundColor: '#FF6347', // Color Tomato
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20, // Espacio arriba
    alignItems: 'center',
  },
  exitButtonGame: { // Estilo para el botón Salir cuando se está jugando
    position: 'absolute', // Posicionamiento absoluto
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 99, 71, 0.7)', // Tomato con transparencia
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 10, // Asegura que esté por encima de los elementos del juego
  },
  exitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Game Styles
  gameContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  goalContainer: {
      width: GOAL_CONTAINER_WIDTH,
      height: GOAL_CONTAINER_HEIGHT,
      position: 'relative',
      alignSelf: 'center',
      borderWidth: 3,
      borderColor: '#006400',
  },
  goalImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
  },
  zoneHitbox: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 165, 0, 0.4)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  ball: {
    position: 'absolute',
    bottom: BALL_START_POS_Y_OFFSET - BALL_SIZE / 2,
    left: width / 2 - BALL_SIZE / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    zIndex: 3,
  },
  ballImage: {
      width: '100%',
      height: '100%',
  },
  keeper: {
    position: 'absolute',
      top: KEEPER_INITIAL_POS_Y - KEEPER_SIZE / 2,
      left: KEEPER_INITIAL_POS_X - KEEPER_SIZE / 2,
    width: KEEPER_SIZE,
    height: KEEPER_SIZE,
    zIndex: 2,
  },
  keeperImage: {
      width: '100%',
      height: '100%',
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 4,
  },
  resultText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 7,
  },
  resultTextGoal: {
    color: '#32CD32',
  },
  resultTextSaved: {
    color: '#DC143C',
  },
  resultTextWarning: {
      color: '#FFFF00',
  }
});

export default PenalesLocosScreen;