import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import {
  loadInitialSBCs,
  loadSBCsFromStorage,
  completeSBCLogic,
} from "../utils/sbcLogic";
import { allFormations } from "../data/formations";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [collection, setCollection] = useState([]);
  const [team, setTeam] = useState({});
  const [formation, setFormation] = useState("4-3-3");
  const [savedTeams, setSavedTeams] = useState({});
  const [usedCodes, setUsedCodes] = useState([]);
  const [sbcList, setSbcList] = useState([]);
  const [eventFichas, setEventFichas] = useState(0);

  // Utilidad para limpiar posiciones inválidas al cambiar de formación
  const cleanTeamForFormation = (oldTeam, newFormation) => {
    const validPositions = allFormations[newFormation]?.positions || [];
    const newTeam = {};
    validPositions.forEach((pos) => {
      if (oldTeam[pos]) {
        newTeam[pos] = oldTeam[pos];
      }
    });
    return newTeam;
  };

  const changeFormation = async (newFormation) => {
    setFormation(newFormation);
    const cleanedTeam = cleanTeamForFormation(team, newFormation);
    setTeam(cleanedTeam);
    await AsyncStorage.setItem("formation", newFormation);
    await AsyncStorage.setItem("team", JSON.stringify(cleanedTeam));
  };

  const saveTeam = async (name) => {
    const updatedSavedTeams = { ...savedTeams, [name]: { team, formation } };
    setSavedTeams(updatedSavedTeams);
    await AsyncStorage.setItem("savedTeams", JSON.stringify(updatedSavedTeams));
  };

  const loadTeam = async (name) => {
    const saved = savedTeams[name];
    if (saved) {
      setFormation(saved.formation);
      setTeam(saved.team);
      await AsyncStorage.setItem("formation", saved.formation);
      await AsyncStorage.setItem("team", JSON.stringify(saved.team));
    }
  };

  const applyCode = async (code) => {
    if (usedCodes.includes(code)) {
      Alert.alert("Código ya usado");
      return;
    }

    let reward = 0;
    switch (code) {
      case "CHACHO":
        reward = 100;
        break;
      case "PACKOPENER":
        reward = 200;
        break;
      case "AKIRA":
        reward = 300;
        break;
      default:
        Alert.alert("Código inválido");
        return;
    }

    setCoins((prev) => prev + reward);
    const updatedUsedCodes = [...usedCodes, code];
    setUsedCodes(updatedUsedCodes);

    await AsyncStorage.setItem("coins", (coins + reward).toString());
    await AsyncStorage.setItem("usedCodes", JSON.stringify(updatedUsedCodes));
    Alert.alert("¡Código canjeado!", `Has recibido ${reward} monedas.`);
  };

  const loadSBCs = async () => {
    const initialSBCs = loadInitialSBCs();
    const savedSBCs = await loadSBCsFromStorage();

    if (savedSBCs) {
      setSbcList(savedSBCs);
    } else {
      setSbcList(initialSBCs);
    }
  };

  const completeSBC = async (sbcId, submittedPlayers) => {
    const { updatedCollection, updatedSBCList, coinsEarned } = completeSBCLogic(
      collection,
      sbcList,
      sbcId,
      submittedPlayers
    );

    setCollection(updatedCollection);
    setSbcList(updatedSBCList);
    setCoins((prev) => prev + coinsEarned);

    await AsyncStorage.setItem("collection", JSON.stringify(updatedCollection));
    await AsyncStorage.setItem("sbcList", JSON.stringify(updatedSBCList));
    await AsyncStorage.setItem("coins", (coins + coinsEarned).toString());

    Alert.alert("¡SBC completado!", `Has ganado ${coinsEarned} monedas.`);
  };

  const addEventFichas = async (amount) => {
    const newFichas = eventFichas + amount;
    setEventFichas(newFichas);
    await AsyncStorage.setItem("eventFichas", newFichas.toString());
  };

  useEffect(() => {
    const loadGameData = async () => {
      const storedCoins = await AsyncStorage.getItem("coins");
      const storedCollection = await AsyncStorage.getItem("collection");
      const storedTeam = await AsyncStorage.getItem("team");
      const storedFormation = await AsyncStorage.getItem("formation");
      const storedSavedTeams = await AsyncStorage.getItem("savedTeams");
      const storedUsedCodes = await AsyncStorage.getItem("usedCodes");
      const storedEventFichas = await AsyncStorage.getItem("eventFichas");

      if (storedCoins) setCoins(parseInt(storedCoins));
      if (storedCollection) setCollection(JSON.parse(storedCollection));
      if (storedTeam) setTeam(JSON.parse(storedTeam));
      if (storedFormation) setFormation(storedFormation);
      if (storedSavedTeams) setSavedTeams(JSON.parse(storedSavedTeams));
      if (storedUsedCodes) setUsedCodes(JSON.parse(storedUsedCodes));
      if (storedEventFichas) setEventFichas(parseInt(storedEventFichas));

      await loadSBCs();
    };

    loadGameData();
  }, []);

  return (
    <GameContext.Provider
      value={{
        coins,
        collection,
        team,
        formation,
        savedTeams,
        usedCodes,
        sbcList,
        eventFichas,
        setCollection,
        setTeam,
        setCoins,
        changeFormation,
        saveTeam,
        loadTeam,
        applyCode,
        loadSBCs,
        completeSBC,
        addEventFichas,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
