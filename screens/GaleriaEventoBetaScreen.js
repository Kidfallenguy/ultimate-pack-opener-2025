import React, { useContext, useEffect, useMemo } from 'react'; // Agregamos useMemo
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GameContext } from '../context/GameContext'; // Asegúrate de que esta ruta sea correcta

// --- DIMENSIONS FOR CARD LAYOUT ---
const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30; // Para 2 columnas con margen

// --- IMAGE IMPORTS ---
const FICHA_IMAGE = { uri: 'https://i.ibb.co/Z1mCQhX3/451-sin-t-tulo-20250513212634.png' }; // URL de la ficha
const BACKGROUND_IMAGE = { uri: 'https://static.vecteezy.com/system/resources/previews/001/576/504/non_2x/abstract-wavy-green-background-free-vector.jpg' }; // URL del fondo

// --- JUGADORES PIONERO (DATA INTEGRADA AQUÍ) ---
// ¡IMPORTANTE! Asegúrate de que los archivos de imagen existan en la carpeta: '../assets/imagecartas/pionero/'
const REDEEMABLE_PIONERO_PLAYERS = [
  // PORTEROS (GK)
  { id: 'pionero_dida_95', name: 'Dida', club: 'Icono', rating: 95, cost: 1000, image: require('../assets/imagecartas/pionero/dida_95.png'), position: 'GK', nationality: 'Brazil' },
  { id: 'pionero_valdes_94', name: 'Victor Valdés', club: 'Icono', rating: 94, cost: 650, image: require('../assets/imagecartas/pionero/valdes_94.png'), position: 'GK', nationality: 'Spain' },
  { id: 'pionero_campos_93', name: 'Jorge Campos', club: 'Héroe', rating: 93, cost: 300, image: require('../assets/imagecartas/pionero/campos_93.png'), position: 'GK', nationality: 'Mexico' },

  // DEFENSAS CENTRALES (CB)
  { id: 'pionero_kompany_94', name: 'Vincent Kompany', club: 'Héroe', rating: 94, cost: 700, image: require('../assets/imagecartas/pionero/kompany_94.png'), position: 'CB', nationality: 'Belgium' },
  { id: 'pionero_stam_95', name: 'Jaap Stam', club: 'Héroe', rating: 95, cost: 850, image: require('../assets/imagecartas/pionero/stam_95.png'), position: 'CB', nationality: 'Netherlands' },
  { id: 'pionero_pique_95', name: 'Piqué', club: 'Icono', rating: 95, cost: 550, image: require('../assets/imagecartas/pionero/pique_95.png'), position: 'CB', nationality: 'Spain' },
  { id: 'pionero_beckenbauber_97', name: 'Beckenbauber', club: 'Icono', rating: 97, cost: 1500, image: require('../assets/imagecartas/pionero/beckenbauber_97.png'), position: 'CB', nationality: 'Germany' },
  { id: 'pionero_cannavaro_96', name: 'Fabio Cannavaro', club: 'Icono', rating: 96, cost: 1000, image: require('../assets/imagecartas/pionero/cannavaro_96.png'), position: 'CB', nationality: 'Italy' },

  // LATERALES IZQUIERDOS (LB)
  { id: 'pionero_marcelo_96', name: 'Marcelo', club: 'Icono', rating: 96, cost: 1250, image: require('../assets/imagecartas/pionero/marcelo_96.png'), position: 'LB', nationality: 'Brazil' },
  { id: 'pionero_nilsantos_95', name: 'Nilton Santos', club: 'Icono', rating: 95, cost: 850, image: require('../assets/imagecartas/pionero/nilsantos_95.png'), position: 'LB', nationality: 'Brazil' },

  // LATERALES DERECHOS (RB)
  { id: 'pionero_djalma_santos_94', name: 'Djalma Santos', club: 'Icono', rating: 94, cost: 550, image: require('../assets/imagecartas/pionero/djalma_santos_94.png'), position: 'RB', nationality: 'Brazil' },
  { id: 'pionero_zanetti_95', name: 'Zanetti', club: 'Icono', rating: 95, cost: 800, image: require('../assets/imagecartas/pionero/zanetti_95.png'), position: 'RB', nationality: 'Argentina' },

  // MEDIOCENTROS DEFENSIVOS (CDM)
  { id: 'pionero_gatusso_94', name: 'Gattuso', club: 'Icono', rating: 94, cost: 800, image: require('../assets/imagecartas/pionero/gattuso_94.png'), position: 'CDM', nationality: 'Italy' },
  { id: 'pionero_cambiasso_94', name: 'Cambiasso', club: 'Icono', rating: 94, cost: 800, image: require('../assets/imagecartas/pionero/cambiasso_94.png'), position: 'CDM', nationality: 'Argentina' },

  // MEDIOCENTROS (CM)
  { id: 'pionero_iniesta_96', name: 'Andrés Iniesta', club: 'Icono', rating: 96, cost: 1000, image: require('../assets/imagecartas/pionero/iniesta_96.png'), position: 'CM', nationality: 'Spain' },
  { id: 'pionero_xavi_97', name: 'Xavi', club: 'Icono', rating: 97, cost: 1500, image: require('../assets/imagecartas/pionero/xavi_97.png'), position: 'CM', nationality: 'Spain' },
  { id: 'pionero_marchisio_94', name: 'Marchisio', club: 'Héroe', rating: 94, cost: 750, image: require('../assets/imagecartas/pionero/marchisio_94.png'), position: 'CM', nationality: 'Italy' },
  { id: 'pionero_matthaus_95', name: 'Matthaus', club: 'Icono', rating: 95, cost: 900, image: require('../assets/imagecartas/pionero/matthaus_95.png'), position: 'CM', nationality: 'Germany' },

  // MEDIOCENTROS OFENSIVOS (CAM)
  { id: 'pionero_maradona_97', name: 'Diego Maradona', club: 'Icono', rating: 97, cost: 2000, image: require('../assets/imagecartas/pionero/maradona_97.png'), position: 'CAM', nationality: 'Argentina' },
  { id: 'pionero_pele_97', name: 'Pelé', club: 'Icono', rating: 97, cost: 2000, image: require('../assets/imagecartas/pionero/pele_97.png'), position: 'CAM', nationality: 'Brazil' },
  { id: 'pionero_cruyff_96', name: 'Cruyff', club: 'Icono', rating: 96, cost: 1500, image: require('../assets/imagecartas/pionero/cruyff_96.png'), position: 'CAM', nationality: 'Netherlands' },
  { id: 'pionero_kaka_96', name: 'Kaká', club: 'Icono', rating: 96, cost: 1200, image: require('../assets/imagecartas/pionero/kaka_96.png'), position: 'CAM', nationality: 'Brazil' },

  // MEDIOCENTROS IZQUIERDOS (LM)
  { id: 'pionero_nedved_94', name: 'Pavel Nedved', club: 'Icono', rating: 94, cost: 900, image: require('../assets/imagecartas/pionero/nedved_94.png'), position: 'LM', nationality: 'Czech Republic' },
  { id: 'pionero_giggs_93', name: 'Ryan Giggs', club: 'Icono', rating: 93, cost: 450, image: require('../assets/imagecartas/pionero/giggs_93.png'), position: 'LM', nationality: 'Wales' },

  // MEDIOCENTROS DERECHOS (RM)
  { id: 'pionero_robben_93', name: 'Arjen Robben', club: 'Icono', rating: 93, cost: 400, image: require('../assets/imagecartas/pionero/robben_93.png'), position: 'RM', nationality: 'Netherlands' },

  // EXTREMOS IZQUIERDOS (LW)
  { id: 'pionero_ronaldinho_97', name: 'Ronaldinho', club: 'Icono', rating: 97, cost: 2000, image: require('../assets/imagecartas/pionero/ronaldinho_97.png'), position: 'LW', nationality: 'Brazil' },
  { id: 'pionero_henry_96', name: 'Henry', club: 'Icono', rating: 96, cost: 1200, image: require('../assets/imagecartas/pionero/henry_96.png'), position: 'LW', nationality: 'France' },
  { id: 'pionero_gento_95', name: 'Paco Gento', club: 'Icono', rating: 95, cost: 1000, image: require('../assets/imagecartas/pionero/gento_95.png'), position: 'LW', nationality: 'Spain' },

  // EXTREMOS DERECHOS (RW)
  { id: 'pionero_best_93', name: 'George Best', club: 'Icono', rating: 93, cost: 550, image: require('../assets/imagecartas/pionero/best_93.png'), position: 'RW', nationality: 'Northern Ireland' },
  { id: 'pionero_dimaria_94', name: 'Ángel Di María', club: 'Icono', rating: 94, cost: 650, image: require('../assets/imagecartas/pionero/dimaria_94.png'), position: 'RW', nationality: 'Argentina' },
  { id: 'pionero_quaresma_95', name: 'Ricardo Quaresma', club: 'Héroe', rating: 95, cost: 750, image: require('../assets/imagecartas/pionero/quaresma_95.png'), position: 'RW', nationality: 'Portugal' },

  // DELANTEROS (ST)
  { id: 'pionero_batistuta_93', name: 'Gabriel Batistuta', club: 'Icono', rating: 93, cost: 400, image: require('../assets/imagecartas/pionero/batistuta_93.png'), position: 'ST', nationality: 'Argentina' },
  { id: 'pionero_zlatan_94', name: 'Zlatan Ibrahimović', club: 'Icono', rating: 94, cost: 600, image: require('../assets/imagecartas/pionero/zlatan_94.png'), position: 'ST', nationality: 'Sweden' },
  { id: 'pionero_david_villa_93', name: 'David Villa', club: 'Icono', rating: 93, cost: 400, image: require('../assets/imagecartas/pionero/david_villa_93.png'), position: 'ST', nationality: 'Spain' },
  { id: 'pionero_forlan_92', name: 'Forlán', club: 'Héroe', rating: 92, cost: 200, image: require('../assets/imagecartas/pionero/forlan_92.png'), position: 'ST', nationality: 'Uruguay' },
  { id: 'pionero_bienvenida_courtois_92', name: 'Thibaut Courtois', club: 'Real Madrid', rating: 92, cost: 250, image: require('../assets/imagecartas/pionero/courtois_92.png'), position: 'GK', nationality: 'Belgium' },

  // DEFENSAS CENTRALES (CB)
  { id: 'pionero_bienvenida_araujo_91', name: 'Ronald Araújo', club: 'FC Barcelona', rating: 91, cost: 100, image: require('../assets/imagecartas/pionero/araujo_91.png'), position: 'CB', nationality: 'Uruguay' },
  { id: 'pionero_bienvenida_saliba_95', name: 'William Saliba', club: 'Arsenal', rating: 95, cost: 800, image: require('../assets/imagecartas/pionero/saliba_95.png'), position: 'CB', nationality: 'France' },

  // LATERALES (LB / RB)
  { id: 'pionero_bienvenida_theo_hernandez_94', name: 'Theo Hernández', club: 'AC Milan', rating: 94, cost: 550, image: require('../assets/imagecartas/pionero/theo_hernandez_94.png'), position: 'LB', nationality: 'France' },
  { id: 'pionero_bienvenida_alphonso_davies_93', name: 'Alphonso Davies', club: 'Bayern Munich', rating: 93, cost: 500, image: require('../assets/imagecartas/pionero/davies_93.png'), position: 'LB', nationality: 'Canada' },

  // MEDIOCENTROS DEFENSIVOS (CDM)
  { id: 'pionero_bienvenida_rodri_93', name: 'Rodri', club: 'Manchester City', rating: 93, cost: 450, image: require('../assets/imagecartas/pionero/rodri_93.png'), position: 'CDM', nationality: 'Spain' },
  { id: 'pionero_bienvenida_declan_rice_93', name: 'Declan Rice', club: 'Arsenal', rating: 93, cost: 450, image: require('../assets/imagecartas/pionero/declan_rice_93.png'), position: 'CDM', nationality: 'England' },

  // MEDIOCENTROS (CM)
  { id: 'pionero_bienvenida_valverde_92', name: 'Federico Valverde', club: 'Real Madrid', rating: 92, cost: 300, image: require('../assets/imagecartas/pionero/valverde_92.png'), position: 'CM', nationality: 'Uruguay' },
  { id: 'pionero_bienvenida_bellingham_93', name: 'Jude Bellingham', club: 'Real Madrid', rating: 93, cost: 400, image: require('../assets/imagecartas/pionero/bellingham_93.png'), position: 'CM', nationality: 'England' },

  // MEDIOCENTROS OFENSIVOS (CAM)
  { id: 'pionero_bienvenida_odegaard_91', name: 'Martin Ødegaard', club: 'Arsenal', rating: 91, cost: 150, image: require('../assets/imagecartas/pionero/odegaard_91.png'), position: 'CAM', nationality: 'Norway' },
  { id: 'pionero_bienvenida_florian_wirtz_92', name: 'Florian Wirtz', club: 'Bayer Leverkusen', rating: 92, cost: 250, image: require('../assets/imagecartas/pionero/wirtz_92.png'), position: 'CAM', nationality: 'Germany' },

  // EXTREMOS (LW / RW)
  { id: 'pionero_bienvenida_mbappe_94', name: 'Kylian Mbappé', club: 'Paris Saint-Germain', rating: 94, cost: 650, image: require('../assets/imagecartas/pionero/mbappe_94.png'), position: 'LW', nationality: 'France' },
  { id: 'pionero_bienvenida_vinicius_jr_94', name: 'Vinícius Jr.', club: 'Real Madrid', rating: 94, cost: 650, image: require('../assets/imagecartas/pionero/vinicius_94.png'), position: 'LW', nationality: 'Brazil' },
  { id: 'pionero_bienvenida_salah_94', name: 'Mohamed Salah', club: 'Liverpool FC', rating: 94, cost: 650, image: require('../assets/imagecartas/pionero/salah_94.png'), position: 'RW', nationality: 'Egypt' },
  { id: 'pionero_bienvenida_rafael_leao_93', name: 'Rafael Leão', club: 'AC Milan', rating: 93, cost: 400, image: require('../assets/imagecartas/pionero/leao_93.png'), position: 'LW', nationality: 'Portugal' },
  { id: 'pionero_bienvenida_bukayo_saka_91', name: 'Bukayo Saka', club: 'Arsenal', rating: 91, cost: 250, image: require('../assets/imagecartas/pionero/saka_91.png'), position: 'RW', nationality: 'England' },
  { id: 'pionero_bienvenida_messi_93', name: 'Lionel Messi', club: 'Inter Miami CF', rating: 93, cost: 500, image: require('../assets/imagecartas/pionero/messi_93.png'), position: 'RW', nationality: 'Argentina' },

  // DELANTEROS (ST)
  { id: 'pionero_bienvenida_haaland_94', name: 'Erling Haaland', club: 'Manchester City', rating: 94, cost: 600, image: require('../assets/imagecartas/pionero/haaland_94.png'), position: 'ST', nationality: 'Norway' },
  { id: 'pionero_bienvenida_harry_kane_92', name: 'Harry Kane', club: 'Bayern Munich', rating: 92, cost: 200, image: require('../assets/imagecartas/pionero/kane_92.png'), position: 'ST', nationality: 'England' },
  { id: 'pionero_bienvenida_lautaro_martinez_92', name: 'Lautaro Martínez', club: 'Inter Milan', rating: 92, cost: 250, image: require('../assets/imagecartas/pionero/lautaro_martinez_92.png'), position: 'ST', nationality: 'Argentina' },
  { id: 'pionero_bienvenida_julian_alvarez_92', name: 'Julián Álvarez', club: 'Manchester City', rating: 92, cost: 200, image: require('../assets/imagecartas/pionero/julian_alvarez_92.png'), position: 'ST', nationality: 'Argentina' },
  // PORTEROS (GK)
  { id: 'pionero_bienvenida_maignan_91', name: 'Mike Maignan', club: 'AC Milan', rating: 91, cost: 200, image: require('../assets/imagecartas/pionero/maignan_91.png'), position: 'GK', nationality: 'France' },
  { id: 'pionero_bienvenida_alisson_becker_91', name: 'Alisson Becker', club: 'Liverpool FC', rating: 91, cost: 210, image: require('../assets/imagecartas/pionero/alisson_becker_91.png'), position: 'GK', nationality: 'Brazil' },

  // DEFENSAS CENTRALES (CB)
  { id: 'pionero_bienvenida_rudiger_92', name: 'Antonio Rüdiger', club: 'Real Madrid', rating: 92, cost: 400, image: require('../assets/imagecartas/pionero/rudiger_92.png'), position: 'CB', nationality: 'Germany' },
  { id: 'pionero_bienvenida_pau_cubarsi_91', name: 'Pau Cubarsí', club: 'FC Barcelona', rating: 91, cost: 120, image: require('../assets/imagecartas/pionero/pau_cubarsi_91.png'), position: 'CB', nationality: 'Spain' },
  { id: 'pionero_bienvenida_inigo_martinez_92', name: 'Íñigo Martínez', club: 'FC Barcelona', rating: 92, cost: 250, image: require('../assets/imagecartas/pionero/inigo_martinez_92.png'), position: 'CB', nationality: 'Spain' },
  { id: 'pionero_bienvenida_kim_min_jae_89', name: 'Kim Min-jae', club: 'Bayern Munich', rating: 89, cost: 50, image: require('../assets/imagecartas/pionero/kim_min_jae_89.png'), position: 'CB', nationality: 'South Korea' },

  // LATERALES (LB / RB)
  { id: 'pionero_bienvenida_grimaldo_90', name: 'Grimaldo', club: 'Bayer Leverkusen', rating: 90, cost: 100, image: require('../assets/imagecartas/pionero/grimaldo_90.png'), position: 'LB', nationality: 'Spain' },
  { id: 'pionero_bienvenida_hakimi_91', name: 'Achraf Hakimi', club: 'Paris Saint-Germain', rating: 91, cost: 250, image: require('../assets/imagecartas/pionero/hakimi_91.png'), position: 'RB', nationality: 'Morocco' },
  { id: 'pionero_bienvenida_trent_alexander_arnold_92', name: 'Trent Alexander-Arnold', club: 'Liverpool FC', rating: 92, cost: 300, image: require('../assets/imagecartas/pionero/trent_alexander_arnold_92.png'), position: 'RB', nationality: 'England' },
  { id: 'pionero_bienvenida_nuno_mendes_90', name: 'Nuno Mendes', club: 'Paris Saint-Germain', rating: 90, cost: 150, image: require('../assets/imagecartas/pionero/nuno_mendes_90.png'), position: 'LB', nationality: 'Portugal' },
  { id: 'pionero_bienvenida_balde_90', name: 'Balde', club: 'FC Barcelona', rating: 90, cost: 100, image: require('../assets/imagecartas/pionero/balde_90.png'), position: 'LB', nationality: 'Spain' },
  { id: 'pionero_bienvenida_kounde_93', name: 'Kounde', club: 'FC Barcelona', rating: 93, cost: 500, image: require('../assets/imagecartas/pionero/kounde_93.png'), position: 'RB', nationality: 'France' },

  // MEDIOCENTROS (CM)
  { id: 'pionero_bienvenida_pedri_93', name: 'Pedri', club: 'FC Barcelona', rating: 93, cost: 550, image: require('../assets/imagecartas/pionero/pedri_93.png'), position: 'CM', nationality: 'Spain' },
  { id: 'pionero_bienvenida_mac_allister_92', name: 'Alexis Mac Allister', club: 'Liverpool FC', rating: 92, cost: 350, image: require('../assets/imagecartas/pionero/mac_allister_92.png'), position: 'CM', nationality: 'Argentina' },
  { id: 'pionero_bienvenida_reijnders_91', name: 'Tijjani Reijnders', club: 'AC Milan', rating: 91, cost: 200, image: require('../assets/imagecartas/pionero/reijnders_91.png'), position: 'CM', nationality: 'Netherlands' },

  // MEDIOCENTROS OFENSIVOS (CAM)
  { id: 'pionero_bienvenida_dani_olmo_90', name: 'Dani Olmo', club: 'RB Leipzig', rating: 90, cost: 100, image: require('../assets/imagecartas/pionero/dani_olmo_90.png'), position: 'CAM', nationality: 'Spain' },

  // EXTREMOS (LW / RW)
  { id: 'pionero_bienvenida_rodrygo_91', name: 'Rodrygo', club: 'Real Madrid', rating: 91, cost: 100, image: require('../assets/imagecartas/pionero/rodrygo_91.png'), position: 'RW', nationality: 'Brazil' },
  { id: 'pionero_bienvenida_kvaratskhelia_91', name: 'Khvicha Kvaratskhelia', club: 'Napoli', rating: 91, cost: 100, image: require('../assets/imagecartas/pionero/kvaratskhelia_91.png'), position: 'LW', nationality: 'Georgia' },
  { id: 'pionero_bienvenida_raphinha_95', name: 'Raphinha', club: 'FC Barcelona', rating: 95, cost: 850, image: require('../assets/imagecartas/pionero/raphinha_95.png'), position: 'RW', nationality: 'Brazil' },
  { id: 'pionero_bienvenida_luis_diaz_90', name: 'Luis Díaz', club: 'Liverpool FC', rating: 90, cost: 150, image: require('../assets/imagecartas/pionero/luis_diaz_90.png'), position: 'LW', nationality: 'Colombia' },
  { id: 'pionero_bienvenida_yamal_94', name: 'Lamine Yamal', club: 'FC Barcelona', rating: 94, cost: 800, image: require('../assets/imagecartas/pionero/yamal_94.png'), position: 'RW', nationality: 'Spain' },

  // DELANTEROS (ST)
  { id: 'pionero_bienvenida_osimhen_92', name: 'Victor Osimhen', club: 'Napoli', rating: 92, cost: 250, image: require('../assets/imagecartas/pionero/osimhen_92.png'), position: 'ST', nationality: 'Nigeria' },
  { id: 'pionero_bienvenida_alexander_isak_90', name: 'Alexander Isak', club: 'Newcastle Utd', rating: 90, cost: 90, image: require('../assets/imagecartas/pionero/alexander_isak_90.png'), position: 'ST', nationality: 'Sweden' },
  { id: 'pionero_bienvenida_cristiano_ronaldo_93', name: 'Cristiano Ronaldo', club: 'Al Nassr', rating: 93, cost: 500, image: require('../assets/imagecartas/pionero/cristiano_ronaldo_93.png'), position: 'ST', nationality: 'Portugal' },
  { id: 'pionero_bienvenida_son_90', name: 'Heung-min Son', club: 'Tottenham Hotspur', rating: 90, cost: 150, image: require('../assets/imagecartas/pionero/son_90.png'), position: 'LW', nationality: 'South Korea' }, // Son puede ser LW o ST, lo puse como LW
  // PORTEROS (GK)
  { id: 'pionero_bienvenida_neuer_97', name: 'Manuel Neuer', club: 'Icono', rating: 97, cost: 2000, image: require('../assets/imagecartas/pionero/neuer_97.png'), position: 'GK', nationality: 'Germany' },
  { id: 'pionero_bienvenida_casillas_97', name: 'Iker Casillas', club: 'Icono', rating: 97, cost: 2000, image: require('../assets/imagecartas/pionero/casillas_97.png'), position: 'GK', nationality: 'Spain' },
  { id: 'pionero_bienvenida_yashin_95', name: 'Lev Yashin', club: 'Icono', rating: 95, cost: 1000, image: require('../assets/imagecartas/pionero/yashin_95.png'), position: 'GK', nationality: 'Russia' },
  { id: 'pionero_bienvenida_buffon_96', name: 'Gianluigi Buffon', club: 'Icono', rating: 96, cost: 1500, image: require('../assets/imagecartas/pionero/buffon_96.png'), position: 'GK', nationality: 'Italy' },

  // DEFENSAS CENTRALES (CB)
  { id: 'pionero_bienvenida_sergio_ramos_96', name: 'Sergio Ramos', club: 'Icono', rating: 96, cost: 1000, image: require('../assets/imagecartas/pionero/sergio_ramos_96.png'), position: 'CB', nationality: 'Spain' },
  { id: 'pionero_bienvenida_ricardo_carvalho_95', name: 'Ricardo Carvalho', club: 'Héroe', rating: 95, cost: 800, image: require('../assets/imagecartas/pionero/ricardo_carvalho_95.png'), position: 'CB', nationality: 'Portugal' },
  { id: 'pionero_bienvenida_paolo_maldini_97', name: 'Paolo Maldini', club: 'Icono', rating: 97, cost: 2000, image: require('../assets/imagecartas/pionero/maldini_97.png'), position: 'CB', nationality: 'Italy' },

  // LATERALES DERECHOS (RB)
  { id: 'pionero_bienvenida_cafu_96', name: 'Cafu', club: 'Icono', rating: 96, cost: 2000, image: require('../assets/imagecartas/pionero/cafu_96.png'), position: 'RB', nationality: 'Brazil' },
  { id: 'pionero_bienvenida_lilian_thuram_95', name: 'Lilian Thuram', club: 'Icono', rating: 95, cost: 1000, image: require('../assets/imagecartas/pionero/thuram_95.png'), position: 'RB', nationality: 'France' },
  { id: 'pionero_bienvenida_gary_neville_94', name: 'Gary Neville', club: 'Icono', rating: 94, cost: 850, image: require('../assets/imagecartas/pionero/gary_neville_94.png'), position: 'RB', nationality: 'England' },

  // LATERALES IZQUIERDOS (LB)
  { id: 'pionero_bienvenida_facchetti_95', name: 'Giacinto Facchetti', club: 'Icono', rating: 95, cost: 800, image: require('../assets/imagecartas/pionero/facchetti_95.png'), position: 'LB', nationality: 'Italy' },
  { id: 'pionero_bienvenida_riise_94', name: 'John Arne Riise', club: 'Héroe', rating: 94, cost: 700, image: require('../assets/imagecartas/pionero/riise_94.png'), position: 'LB', nationality: 'Norway' },
  { id: 'pionero_bienvenida_roberto_carlos_96', name: 'Roberto Carlos', club: 'Icono', rating: 96, cost: 2000, image: require('../assets/imagecartas/pionero/roberto_carlos_96.png'), position: 'LB', nationality: 'Brazil' },

  // MEDIOCENTROS OFENSIVOS (CAM)
  { id: 'pionero_bienvenida_ruud_gullit_96', name: 'Ruud Gullit', club: 'Icono', rating: 96, cost: 1500, image: require('../assets/imagecartas/pionero/gullit_96.png'), position: 'CAM', nationality: 'Netherlands' },
  { id: 'pionero_bienvenida_zico_94', name: 'Zico', club: 'Héroe', rating: 94, cost: 900, image: require('../assets/imagecartas/pionero/zico_94.png'), position: 'CAM', nationality: 'Brazil' },

  // MEDIOCENTROS (CM)
  { id: 'pionero_bienvenida_beckham_94', name: 'David Beckham', club: 'Icono', rating: 94, cost: 700, image: require('../assets/imagecartas/pionero/beckham_94.png'), position: 'CM', nationality: 'England' },

  // DELANTEROS (ST)
  { id: 'pionero_bienvenida_van_basten_96', name: 'Marco Van Basten', club: 'Icono', rating: 96, cost: 1000, image: require('../assets/imagecartas/pionero/van_basten_96.png'), position: 'ST', nationality: 'Netherlands' },
  { id: 'pionero_bienvenida_george_weah_95', name: 'George Weah', club: 'Héroe', rating: 95, cost: 800, image: require('../assets/imagecartas/pionero/weah_95.png'), position: 'ST', nationality: 'Liberia' },
  { id: 'pionero_bienvenida_eusebio_95', name: 'Eusébio', club: 'Icono', rating: 95, cost: 800, image: require('../assets/imagecartas/pionero/eusebio_95.png'), position: 'ST', nationality: 'Portugal' },
  { id: 'pionero_bienvenida_ronaldo_nazario_97', name: 'Ronaldo Nazário', club: 'Icono', rating: 97, cost: 1900, image: require('../assets/imagecartas/pionero/ronaldo_nazario_97.png'), position: 'ST', nationality: 'Brazil' },
];

// --- COMPONENTE PlayerCard (INTEGRADO AQUÍ) ---
const PlayerCard = ({ player, onBuyPress, userHasPlayer }) => {
  return (
    <View style={playerCardStyles.cardContainer}>
      <Image source={player.image} style={playerCardStyles.playerImage} />
      <View style={playerCardStyles.infoContainer}>
        <Text style={playerCardStyles.playerName}>{player.name}</Text>
        <Text style={playerCardStyles.playerRating}>GRL: {player.rating}</Text>
        <Text style={playerCardStyles.playerPosition}>{player.position} | {player.club}</Text>
        <Text style={playerCardStyles.playerNationality}>{player.nationality}</Text>
        {player.cost && (
          <View style={playerCardStyles.costContainer}>
            <Text style={playerCardStyles.playerCost}>Costo: {player.cost}</Text>
            <Image source={FICHA_IMAGE} style={playerCardStyles.fichaIconSmall} />
          </View>
        )}
        <TouchableOpacity
          style={[
            playerCardStyles.buyButton,
            userHasPlayer && playerCardStyles.buyButtonDisabled // Estilo si el jugador ya lo tiene
          ]}
          onPress={() => onBuyPress(player)}
          disabled={userHasPlayer} // Deshabilita el botón si el jugador ya está en la colección
        >
          <Text style={playerCardStyles.buyButtonText}>
            {userHasPlayer ? 'Ya Tienes' : 'Comprar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- STYLES FOR PlayerCard (INTEGRADOS AQUÍ) ---
const playerCardStyles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    backgroundColor: '#333', // Fondo oscuro para la tarjeta
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  playerImage: {
    width: cardWidth * 0.9, // La imagen ocupa casi todo el ancho de la tarjeta
    height: cardWidth * 1.2, // Altura proporcional a la imagen de carta
    resizeMode: 'contain',
    borderRadius: 5,
    marginBottom: 8,
  },
  infoContainer: {
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  playerRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700', // Dorado
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 12,
    color: '#CCC',
    marginBottom: 2,
  },
  playerNationality: {
    fontSize: 12,
    color: '#AAA',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 8,
  },
  playerCost: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00FF00', // Verde para el costo
    marginRight: 5,
  },
  fichaIconSmall: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buyButton: {
    backgroundColor: '#007bff', // Azul para el botón de compra
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buyButtonDisabled: {
    backgroundColor: '#6c757d', // Gris si ya lo tiene
  },
});

// --- MAIN SCREEN COMPONENT ---
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
    return 1; // Default for players below 75 GRL
};

const GaleriaEventoBetaScreen = () => {
    const navigation = useNavigation();
    // Asegúrate de que GameContext proporcione estas funciones/estados:
    const { eventFichas, userPlayers, deductEventFichas, addPlayerToUserCollection } = useContext(GameContext);

    useEffect(() => {
        navigation.setOptions({
            title: 'Galería del Evento BETA',
        });
    }, [navigation]);

    const handleBuyPlayer = (player) => {
        if (!player.cost || player.cost > eventFichas) {
            Alert.alert('Fichas Insuficientes', `Necesitas ${player.cost} Fichas para comprar a ${player.name}. Actualmente tienes ${eventFichas}.`);
            return;
        }

        // Confirmación antes de la compra
        Alert.alert(
            'Confirmar Compra',
            `¿Estás seguro de que quieres comprar a ${player.name} por ${player.cost} Fichas?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Comprar',
                    onPress: () => {
                        deductEventFichas(player.cost); // Deduce las fichas
                        addPlayerToUserCollection(player); // Añade el jugador a la colección
                        Alert.alert('¡Compra Exitosa!', `${player.name} ha sido añadido a tu colección.`);
                    },
                },
            ]
        );
    };

    const navigateToExchangePlayers = () => {
        navigation.navigate('IntercambioJugadores'); // Asegúrate de que esto coincida con el nombre de tu ruta
    };

    // FIX para 'Cannot read properties of undefined (reading 'some')'
    // userPlayers podría ser undefined o null al inicio si el contexto aún no carga datos.
    // Usamos `|| []` para asegurar que siempre sea un array.
    const checkIfUserHasPlayer = (playerId) => {
      // Asegúrate de que userPlayers sea un array antes de llamar a .some()
      return (userPlayers || []).some(p => p.id === playerId);
    };

    // Ordenar los jugadores de mayor a menor rating
    // Usamos useMemo para evitar re-ordenar la lista innecesariamente en cada render
    const sortedPlayers = useMemo(() => {
        // Creamos una copia para no mutar el array original
        return [...REDEEMABLE_PIONERO_PLAYERS].sort((a, b) => b.rating - a.rating);
    }, [REDEEMABLE_PIONERO_PLAYERS]); // Re-ordenar solo si la lista original cambia

    return (
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.title}>¡Bienvenido al Evento BETA!</Text>

                    {/* Display Current Fichas */}
                    <View style={styles.currentFichasContainer}>
                        <Text style={styles.currentFichasText}>Tus Fichas:</Text>
                        <Image source={FICHA_IMAGE} style={styles.fichaIconBig} />
                        <Text style={styles.currentFichasText}>{eventFichas || 0}</Text>
                    </View>

                    {/* Section for "Intercambiar Jugadores" Button and Info */}
                    <Text style={styles.sectionTitle}>Intercambiar Jugadores:</Text>
                    <Text style={styles.infoText}>
                        Canjea jugadores de tu colección por Fichas de Evento.
                        La cantidad de fichas obtenidas dependerá del GRL (Nivel General) del jugador:
                    </Text>

                    {/* Exchange Rate Table (for display only) */}
                    <View style={styles.exchangeTable}>
                        <Text style={styles.tableRow}>75-80 GRL: {calculateExchangeFichas(75)} Fichas</Text>
                        <Text style={styles.tableRow}>80-85 GRL: {calculateExchangeFichas(80)} Fichas</Text>
                        <Text style={styles.tableRow}>86-88 GRL: {calculateExchangeFichas(86)} Fichas</Text>
                        <Text style={styles.tableRow}>89-90 GRL: {calculateExchangeFichas(89)} Fichas</Text>
                        <Text style={styles.tableRow}>91-92 GRL: {calculateExchangeFichas(91)} Fichas</Text>
                        <Text style={styles.tableRow}>93-94 GRL: {calculateExchangeFichas(93)} Fichas</Text>
                        <Text style={styles.tableRow}>95 GRL: {calculateExchangeFichas(95)} Fichas</Text>
                        <Text style={styles.tableRow}>96 GRL: {calculateExchangeFichas(96)} Fichas</Text>
                        <Text style={styles.tableRow}>97+ GRL: {calculateExchangeFichas(97)} Fichas</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.exchangeNavigateButton}
                        onPress={navigateToExchangePlayers}
                    >
                        <Text style={styles.exchangeNavigateButtonText}>Ir a Intercambiar Jugadores</Text>
                    </TouchableOpacity>

                    {/* Sección: Galería de Jugadores del Evento */}
                    <Text style={styles.sectionTitle}>Jugadores del Evento Pionero:</Text>
                    <Text style={styles.infoText}>
                        Estos son los jugadores exclusivos que puedes obtener con tus Fichas de Evento. ¡Haz clic en 'Comprar' si tienes suficientes fichas!
                    </Text>

                    {/* FlatList para la galería de jugadores */}
                    <FlatList
                        data={sortedPlayers} // Usamos la lista ordenada aquí
                        renderItem={({ item }) => (
                          <PlayerCard
                            player={item}
                            onBuyPress={handleBuyPlayer}
                            userHasPlayer={checkIfUserHasPlayer(item.id)}
                          />
                        )}
                        keyExtractor={item => item.id}
                        numColumns={2} // Muestra 2 columnas por fila
                        scrollEnabled={false} // Deshabilita el scroll interno de FlatList ya que está dentro de ScrollView
                        contentContainerStyle={styles.galleryListContent}
                        ListEmptyComponent={<Text style={styles.emptyListText}>No hay jugadores Pionero disponibles en este momento.</Text>}
                    />

                    <View style={styles.placeholderSection}>
                        <Text style={styles.placeholderText}>Más secciones emocionantes próximamente...</Text>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

// --- STYLES FOR THE MAIN SCREEN ---
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
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
        marginTop: 25,
        marginBottom: 10,
        textAlign: 'center',
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    infoText: {
        fontSize: 15,
        color: '#e0e0e0',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    exchangeTable: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        width: '90%',
    },
    tableRow: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 3,
        textAlign: 'center',
    },
    exchangeNavigateButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    exchangeNavigateButtonText: {
        fontSize: 19,
        color: '#fff',
        fontWeight: 'bold',
    },
    galleryListContent: {
        justifyContent: 'space-around',
        paddingHorizontal: 5,
    },
    emptyListText: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        marginTop: 20,
    },
    placeholderSection: {
        marginTop: 30,
        width: '90%',
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#9E9E9E',
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    placeholderText: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
    }
});

export default GaleriaEventoBetaScreen;