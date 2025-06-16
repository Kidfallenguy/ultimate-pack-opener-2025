import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ImageBackground, ScrollView, Image, TextInput, Alert } from 'react-native';
import GameContext from '../context/GameContext';
import { Ionicons } from '@expo/vector-icons';
import { playerImages } from '../assets/playerImages'; // Importa playerImages

// Asegúrate de que el archivo '../assets/playerImages.js' exporte



const formacionConexiones = {
  '4-3-3': {
    'portero': [],
    'lateral_izquierdo': ['defensa_central_izquierda', 'mediocampista_central_izquierda'],
    'defensa_central_izquierda': ['lateral_izquierdo', 'defensa_central_derecha', 'mediocampista_central_centro'],
    'defensa_central_derecha': ['defensa_central_izquierda', 'lateral_derecho', 'mediocampista_central_centro'],
    'lateral_derecho': ['defensa_central_derecha', 'mediocampista_central_derecha'],
    'mediocampista_central_izquierda': ['lateral_izquierdo', 'mediocampista_central_centro', 'delantero_izquierda'],
    'mediocampista_central_centro': ['defensa_central_izquierda', 'defensa_central_derecha', 'mediocampista_central_izquierda', 'mediocampista_central_derecha', 'delantero_centro'],
    'mediocampista_central_derecha': ['lateral_derecho', 'mediocampista_central_centro', 'delantero_derecha'],
    'delantero_izquierda': ['mediocampista_central_izquierda', 'delantero_centro'],
    'delantero_centro': ['mediocampista_central_centro', 'delantero_izquierda', 'delantero_derecha'],
    'delantero_derecha': ['mediocampista_central_derecha', 'delantero_centro'],
  },
  '4-4-2': {
    'portero': [],
    'lateral_izquierdo': ['defensa_central_izquierda', 'mediocampista_izquierda'],
    'defensa_central_izquierda': ['lateral_izquierdo', 'defensa_central_derecha', 'mediocampista_central_izquierda'],
    'defensa_central_derecha': ['defensa_central_izquierda', 'lateral_derecho', 'mediocampista_central_derecha'],
    'lateral_derecho': ['defensa_central_derecha', 'mediocampista_derecha'],
    'mediocampista_izquierda': ['lateral_izquierdo', 'mediocampista_central_izquierda', 'delantero_1'],
    'mediocampista_central_izquierda': ['defensa_central_izquierda', 'mediocampista_izquierda', 'mediocampista_central_derecha', 'delantero_2'],
    'mediocampista_central_derecha': ['defensa_central_derecha', 'mediocampista_derecha', 'mediocampista_central_izquierda', 'delantero_1'],
    'mediocampista_derecha': ['lateral_derecho', 'mediocampista_central_derecha', 'delantero_2'],
    'delantero_1': ['mediocampista_izquierda', 'mediocampista_central_derecha', 'delantero_2'],
    'delantero_2': ['mediocampista_central_izquierda', 'mediocampista_derecha', 'delantero_1'],
  },
  '3-5-2': {
    'portero': [],
    'defensa_izquierda': ['defensa_central', 'carrilero_izquierdo'],
    'defensa_central': ['defensa_izquierda', 'defensa_derecha', 'mediocampista_defensivo_izquierda', 'mediocampista_defensivo_derecha'],
    'defensa_derecha': ['defensa_central', 'carrilero_derecho'],
    'carrilero_izquierdo': ['defensa_izquierda', 'mediocampista_izquierda'],
    'mediocampista_izquierda': ['carrilero_izquierdo', 'mediocampista_central'],
    'mediocampista_central': ['mediocampista_izquierda', 'mediocampista_derecha', 'mediocampista_ofensivo'],
    'mediocampista_derecha': ['mediocampista_central', 'carrilero_derecho'],
    'carrilero_derecho': ['defensa_derecha', 'mediocampista_derecha'],
    'delantero_1': ['mediocampista_ofensivo', 'delantero_2'],
    'delantero_2': ['mediocampista_ofensivo', 'delantero_1'],
    'mediocampista_ofensivo': ['mediocampista_central', 'delantero_1', 'delantero_2'],
  },
  '4-2-3-1': {
    'portero': [],
    'lateral_izquierdo': ['defensa_central_izquierda', 'mediocampista_defensivo_izquierda'],
    'defensa_central_izquierda': ['lateral_izquierdo', 'defensa_central_derecha', 'mediocampista_defensivo_izquierda', 'mediocampista_defensivo_derecha'],
    'defensa_central_derecha': ['defensa_central_izquierda', 'lateral_derecho', 'mediocampista_defensivo_izquierda', 'mediocampista_defensivo_derecha'],
    'lateral_derecho': ['defensa_central_derecha', 'mediocampista_defensivo_derecha'],
    'mediocampista_defensivo_izquierda': ['lateral_izquierdo', 'defensa_central_izquierda', 'mediocampista_defensivo_derecha', 'mediocampista_ofensivo_izquierda'],
    'mediocampista_defensivo_derecha': ['lateral_derecho', 'defensa_central_derecha', 'mediocampista_defensivo_izquierda', 'mediocampista_ofensivo_derecha'],
    'mediocampista_ofensivo_izquierda': ['mediocampista_defensivo_izquierda', 'mediocampista_ofensivo_central', 'delantero_centro'],
    'mediocampista_ofensivo_central': ['mediocampista_ofensivo_izquierda', 'mediocampista_ofensivo_derecha', 'delantero_centro'],
    'mediocampista_ofensivo_derecha': ['mediocampista_defensivo_derecha', 'mediocampista_ofensivo_central', 'delantero_centro'],
    'delantero_centro': ['mediocampista_ofensivo_izquierda', 'mediocampista_ofensivo_central', 'mediocampista_ofensivo_derecha'],
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start', // Align items from the top
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  coinText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  valoracionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  quimicaText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  formation: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 8,
    alignItems: 'center',
  },
  positionContainerEmpty: {
    width: 70,
    height: 80,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionContainerFilled: {
    width: 70,
    height: 120, // Aumentar la altura para el nombre y la valoración
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  plusButton: {
    fontSize: 24,
    color: 'white',
  },
  positionName: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2, // Espacio entre la imagen/placeholder y el nombre
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 3,
  },
  playerName: { // Estilo para el nombre del jugador
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  playerRating: {
    color: '#ddd',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  formationSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  formationButton: {
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginHorizontal: 3,
    marginBottom: 5,
  },
  activeFormationButton: {
    backgroundColor: '#64748B',
  },
  formationButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalCard: {
    backgroundColor: '#334155',
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
    alignItems: 'center',
  },
  modalCardImageOnlyContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalCardImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  modalCardImageOnly: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  modalCardInfo: {
    flex: 1,
  },
  modalCardImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCardName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalCardRating: {
    color: '#CBD5E0',
    fontSize: 12,
  },
  modalCloseButton: {
    backgroundColor: '#475569',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalConfirmButton: {
    backgroundColor: '#22C55E',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chemistryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignItems: 'center',
    marginVertical: 2,
  },
  chemistrySpacer: {
    flex: 1,
  },
  chemistryLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  chemistryLineGreen: {
    backgroundColor: 'green',
  },
  chemistryLineYellow: {
    backgroundColor: 'yellow',
  },
  placeholderContainer: {
    width: 70,
    height: 80,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 10,
    marginTop: 5,
  },
  teamNameInput: {
    backgroundColor: '#334155',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  savedTeamsTitle: {
    color: 'white',
    marginTop: 20,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  loadButton: {
    backgroundColor: '#475569',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
    width: '80%',
  },
  loadButtonText: {
    color: 'white',
  },
});

const Placeholder = () => (
  <View style={styles.placeholderContainer}>
    <Ionicons name="person-add-outline" size={30}color="white" />
    <Text style={styles.placeholderText}>Añadir</Text>
  </View>
);

const EquipoScreen = () => {
  const { coins, team, currentFormation, availableFormations, changeFormation, playerCards, addPlayerToTeam, removePlayerFromTeam: removePlayerFromTeamContext, savedTeams, saveTeam: saveTeamContext, loadTeam: loadTeamContext } = useContext(GameContext);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState(null);
  const [valoracionEquipo, setValoracionEquipo] = useState(0);
  const [quimicaEquipo, setQuimicaEquipo] = useState(0);
  const [teamName, setTeamName] = useState('');

  const getChemistryColor = useCallback((player1, player2) => {
    if (!player1 || !player2) {
      return styles.chemistryLine;
    }
    if (player1.nacionalidad === player2.nacionalidad && player1.club === player2.club) {
      return styles.chemistryLineYellow;
    }
    if (player1.nacionalidad === player2.nacionalidad) {
      return styles.chemistryLineGreen;
    }
    return styles.chemistryLine;
  }, []);

const renderPosition = useCallback((position, player) => {
  console.log('Renderizando posición:', position, 'con jugador:', player);

  return (
    <TouchableOpacity
      style={player ? styles.positionContainerFilled : styles.positionContainerEmpty}
      onPress={() => {
        if (player) {
          setPlayerToRemove({ player, position });
          setIsRemoveModalVisible(true);
        } else {
          console.log("Posición tocada:", position);
          setSelectedPosition(position);
          setIsModalVisible(true);
        }
      }}
      key={position}
    >
      {player ? (
        <>
          {console.log('Image URI:', player.imageUri)} {/* <--- LOG DE imageUri */}
          {player.imageUri && playerImages[player.imageUri] ? (
            <>
              {console.log('Image Source:', playerImages[player.imageUri])} {/* <--- LOG DE LA RUTA DE LA IMAGEN */}
              <Image source={playerImages[player.imageUri]} style={styles.playerImage} />
            </>
          ) : (
            <View style={{ width: 50, height: 50, backgroundColor: '#666', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16 }}>?</Text>
            </View>
          )}
          <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
          {player.rating && <Text style={styles.playerRating}>{player.rating}</Text>}
          <TouchableOpacity style={styles.removeButton} onPress={() => {
            removePlayerFromTeamContext(position);
          }}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Placeholder />
      )}
      <Text style={styles.positionName} numberOfLines={1}>{position.replace(/_/g, ' ')}</Text>
    </TouchableOpacity>
  );
}, [playerImages, team, setPlayerToRemove, setIsRemoveModalVisible, setSelectedPosition, setIsModalVisible, removePlayerFromTeamContext]);

  const renderChemistryLine = useCallback((pos1, pos2) => {
    const player1 = team[pos1];
    const player2 = team[pos2];
    const chemistryStyle = getChemistryColor(player1, player2);
    return <View style={[styles.chemistryLine, chemistryStyle]} />;
  }, [getChemistryColor, team]);

 const getFormationRows = useCallback(() => {
    const formationMap = {
      '4-3-3': [
        { positions: ['portero'] },
        { positions: ['lateral_izquierdo', 'defensa_central_izquierda', 'defensa_central_derecha', 'lateral_derecho'], chemistry: [['lateral_izquierdo', 'defensa_central_izquierda'], ['defensa_central_izquierda', 'defensa_central_derecha'], ['defensa_central_derecha', 'lateral_derecho']] },
        { positions: ['mediocampista_central_izquierda', 'mediocampista_central_centro', 'mediocampista_central_derecha'], chemistry: [['mediocampista_central_izquierda', 'mediocampista_central_centro'], ['mediocampista_central_centro', 'mediocampista_central_derecha']] },
        { positions: ['delantero_izquierda', 'delantero_centro', 'delantero_derecha'], chemistry: [['delantero_izquierda', 'delantero_centro'], ['delantero_centro', 'delantero_derecha']] },
      ],
      '4-4-2': [
        { positions: ['portero'] },
        { positions: ['lateral_izquierdo', 'defensa_central_izquierda', 'defensa_central_derecha', 'lateral_derecho'], chemistry: [['lateral_izquierdo', 'defensa_central_izquierda'], ['defensa_central_izquierda', 'defensa_central_derecha'], ['defensa_central_derecha', 'lateral_derecho']] },
        { positions: ['mediocampista_izquierda', 'mediocampista_central_izquierda', 'mediocampista_central_derecha', 'mediocampista_derecha'], chemistry: [['mediocampista_izquierda', 'mediocampista_central_izquierda'], ['mediocampista_central_izquierda', 'mediocampista_central_derecha'], ['mediocampista_central_derecha', 'mediocampista_derecha']] },
        { positions: ['delantero_1', 'delantero_2'], chemistry: [['delantero_1', 'delantero_2']] },
      ],
      '3-5-2': [
        { positions: ['portero'] },
        { positions: ['defensa_izquierda', 'defensa_central', 'defensa_derecha'], chemistry: [['defensa_izquierda', 'defensa_central'], ['defensa_central', 'defensa_derecha']] },
        { positions: ['carrilero_izquierdo', 'mediocampista_defensivo_izquierda', 'mediocampista_central', 'mediocampista_defensivo_derecha', 'carrilero_derecho'], chemistry: [['carrilero_izquierdo', 'mediocampista_defensivo_izquierda'], ['mediocampista_defensivo_izquierda', 'mediocampista_central'], ['mediocampista_central', 'mediocampista_defensivo_derecha'], ['mediocampista_defensivo_derecha', 'carrilero_derecho']] },
        { positions: ['mediocampista_ofensivo'] },
        { positions: ['delantero_1', 'delantero_2'], chemistry: [['delantero_1', 'delantero_2']] },
      ],
      '4-2-3-1': [
        { positions: ['portero'] },
        { positions: ['lateral_izquierdo', 'defensa_central_izquierda', 'defensa_central_derecha', 'lateral_derecho'], chemistry: [['lateral_izquierdo', 'defensa_central_izquierda'], ['defensa_central_izquierda', 'defensa_central_derecha'], ['defensa_central_derecha', 'lateral_derecho']] },
        { positions: ['mediocampista_defensivo_izquierda', 'mediocampista_defensivo_derecha'], chemistry: [['mediocampista_defensivo_izquierda', 'mediocampista_defensivo_derecha']] },
        { positions: ['mediocampista_ofensivo_izquierda', 'mediocampista_ofensivo_central', 'mediocampista_ofensivo_derecha'], chemistry: [['mediocampista_ofensivo_izquierda', 'mediocampista_ofensivo_central'], ['mediocampista_ofensivo_central', 'mediocampista_ofensivo_derecha']] },
        { positions: ['delantero_centro'] },
      ],
    };

    return formationMap[currentFormation]?.map((rowConfig, index) => (
      <View key={`row-${index}`}>
        <View style={styles.row}>
          {rowConfig.positions.map(pos => renderPosition(pos, team[pos]))}
        </View>
        {rowConfig.chemistry && (
          <View style={styles.chemistryRow}>
            {rowConfig.chemistry.map((pair, i) => (
              <React.Fragment key={`chem-${index}-${i}`}>
                {rowConfig.positions[i] && <View style={styles.chemistrySpacer} />}
                {renderChemistryLine(pair[0], pair[1])}
                {rowConfig.positions[i + 1] && <View style={styles.chemistrySpacer} />}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    )) || null;
  }, [currentFormation, renderPosition, renderChemistryLine, team]);

    const handleSelectPlayer = useCallback((player) => {
      if (selectedPosition) {
        addPlayerToTeam(selectedPosition, player); // Se usa 'selectedPosition' aquí
        setIsModalVisible(false);
        setSelectedPosition(null);
      }
    }, [addPlayerToTeam, selectedPosition]);

  const handleRemovePlayer = useCallback(() => {
    if (playerToRemove) {
      removePlayerFromTeamContext(playerToRemove.position);
      setIsRemoveModalVisible(false);
      setPlayerToRemove(null);
    }
  }, [playerToRemove, removePlayerFromTeamContext]);

const renderCardItem = useCallback(({ item }) => (
  <TouchableOpacity style={styles.modalCard} onPress={() => handleSelectPlayer(item)} key={item.id}>
    <View style={styles.modalCardContent}>
      {/* Usar playerImages y item.imageUri para la imagen en el modal */}
      {item.imageUri && playerImages[item.imageUri] ? (
        <Image
          source={playerImages[item.imageUri]}
          style={styles.modalCardImage}
        />
      ) : (
        <View style={styles.modalCardImagePlaceholder}>
          <Placeholder />
        </View>
      )}
      <View style={styles.modalCardInfo}>
        <Text style={styles.modalCardName}>{item.name || 'Cargando...'}</Text>
        <Text style={styles.modalCardRating}>{item.rating || ''}</Text>
      </View>
    </View>
  </TouchableOpacity>
), [playerImages, handleSelectPlayer]);

  const availableCards = useCallback(() => playerCards.filter(card => !Object.values(team).some(p => p && p.id === card.id)), [playerCards, team]);

  const calculateChemistry = useCallback(() => {
    let chemistryScore = 0;
    const currentTeam = Object.keys(team)
      .filter(position => team[position])
      .reduce((acc, pos) => ({ ...acc, [pos]: team[pos] }), {});

    for (const position1 in currentTeam) {
      const player1 = currentTeam[position1];
      const connections = formacionConexiones[currentFormation]?.[position1] || [];
      connections.forEach(position2 => {
        const player2 = currentTeam[position2];
        if (player2) {
          if (player1.nacionalidad === player2.nacionalidad) {
            chemistryScore += 10;
          }
          if (player1.club === player2.club) {
            chemistryScore += 20;
          }
        }
      });
    }
    return chemistryScore;
  }, [team, currentFormation]);

  const handleSaveTeam = () => {
    if (teamName.trim() === '') {
      Alert.alert('Nombre Requerido', 'Por favor, introduce un nombre para guardar tu equipo.');
      return;
    }
    saveTeamContext(teamName);
    setTeamName('');
  };

  const handleLoadTeam = (selectedTeamName) => {
    loadTeamContext(selectedTeamName);
    setTeamName(selectedTeamName); // Opcional: mostrar el nombre del equipo cargado
  };

  useEffect(() => {
    let totalRating = 0;
    let playersInTeam = 0;
    for (const position in team) {
      if (team[position]?.rating) {
        totalRating += team[position].rating;
        playersInTeam++;
      }
    }
    setValoracionEquipo(playersInTeam > 0 ? Math.round(totalRating / playersInTeam) : 0);
    setQuimicaEquipo(calculateChemistry());
  }, [team, calculateChemistry]);

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/474x/b4/4a/9b/b44a9b450ec26cb7b78d543fb843d054.jpg' }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.coinText}>Monedas: {coins}</Text>
        <Text style={styles.title}>Mi Equipo ({currentFormation})</Text>
        <TextInput
          style={styles.teamNameInput}
          placeholder="Nombre del Equipo"
          value={teamName}
          onChangeText={setTeamName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTeam}>
          <Text style={styles.saveButtonText}>Guardar Equipo</Text>
        </TouchableOpacity>

        <Text style={styles.savedTeamsTitle}>Equipos Guardados</Text>
        {Object.keys(savedTeams).length > 0 ? (
          Object.keys(savedTeams).map(name => (
            <TouchableOpacity key={name} style={styles.loadButton} onPress={() => handleLoadTeam(name)}>
              <Text style={styles.loadButtonText}>{name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: 'white', marginTop: 5 }}>No hay equipos guardados.</Text>
        )}

        <Text style={styles.valoracionText}>Valoración del Equipo: {valoracionEquipo}</Text>
        <Text style={styles.quimicaText}>Química del Equipo: {quimicaEquipo}</Text>
        <View style={styles.formation}>
          {getFormationRows()}
        </View>

        <View style={styles.formationSelector}>
          {availableFormations && availableFormations.map(formation => (
            <TouchableOpacity
              key={formation}
              style={[styles.formationButton, currentFormation === formation && styles.activeFormationButton]}
              onPress={() => changeFormation(formation)}
            >
              <Text style={styles.formationButtonText}>{formation}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Jugador para {selectedPosition?.replace(/_/g, ' ')}</Text>
              <FlatList
                data={availableCards()}
                renderItem={renderCardItem}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isRemoveModalVisible}
          transparent={true}
          onRequestClose={() => setIsRemoveModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¿Remover a {playerToRemove?.player?.name || 'este jugador'}?</Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleRemovePlayer}>
                  <Text style={styles.modalConfirmButtonText}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsRemoveModalVisible(false)}>
                  <Text style={styles.modalCancelButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

export default EquipoScreen;