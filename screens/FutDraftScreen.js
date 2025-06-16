import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ImageBackground, Modal } from 'react-native';
import { playerImages } from '../assets/playerImages';
import Card from '../components/Card';
import {playersData} from '../data/players'; // <-- ¡Esta es la línea clave que necesitas!


// Importa todas tus imágenes aquí
import Neuer94 from '../assets/imagecartas/ICONS/neuer-94.png';
import Casillas93 from '../assets/imagecartas/ICONS/casillas-93.png';
import Yashin92 from '../assets/imagecartas/ICONS/yashin-92.png';
import Buffon92 from '../assets/imagecartas/ICONS/buffon-92.png';
import VanDerSar90 from '../assets/imagecartas/ICONS/van-der-sar-90.png';
import OliverKahn90 from '../assets/imagecartas/ICONS/oliver-kahn-90.png';
import VictorValdes89 from '../assets/imagecartas/ICONS/victor-valdes-89.png';
import Dida89 from '../assets/imagecartas/ICONS/dida-89.png';
import Fillol88 from '../assets/imagecartas/ICONS/fillol-88.png';
import Schmeichel88 from '../assets/imagecartas/ICONS/schmeichel-88.png';
import Bravo88 from '../assets/imagecartas/ICONS/bravo-88.png';
import Cech88 from '../assets/imagecartas/ICONS/cech-88.png';
import Chilavert87 from '../assets/imagecartas/ICONS/chilavert-87.png';
import Banks87 from '../assets/imagecartas/ICONS/banks-87.png';
import DinoZoff87 from '../assets/imagecartas/ICONS/dino-zoff-87.png';
import Higuita87 from '../assets/imagecartas/ICONS/higuita-87.png';
import Preudhomme87 from '../assets/imagecartas/ICONS/preud-homme-87.png';
import Seaman87 from '../assets/imagecartas/ICONS/seaman-87.png';
import Maldini94 from '../assets/imagecartas/ICONS/maldini-94.png';
import Beckenbauer94 from '../assets/imagecartas/ICONS/beckenbauer-94.png';
import Ramos93 from '../assets/imagecartas/ICONS/ramos-93.png';
import Pepe92 from '../assets/imagecartas/ICONS/pepe-92.png';
import Passarella92 from '../assets/imagecartas/ICONS/passarella-92.png';
import Figueroa92 from '../assets/imagecartas/ICONS/figueroa-92.png';
import Baresi91 from '../assets/imagecartas/ICONS/baresi-91.png';
import Pique90 from '../assets/imagecartas/ICONS/pique-90.png';
import Puyol90 from '../assets/imagecartas/ICONS/puyol-90.png';
import Blanc90 from '../assets/imagecartas/ICONS/blanc-90.png';
import Lucio90 from '../assets/imagecartas/ICONS/lucio-90.png';
import Nesta89 from '../assets/imagecartas/ICONS/nesta-89.png';
import Varane89 from '../assets/imagecartas/ICONS/varane-89.png';
import Cannavaro89 from '../assets/imagecartas/ICONS/cannavaro-89.png';
import CesareMaldini89 from '../assets/imagecartas/ICONS/cesare-maldini-89.png';
import Ferdinand89 from '../assets/imagecartas/ICONS/ferdinand-89.png';
import Nasazzi89 from '../assets/imagecartas/ICONS/nasazzi-89.png';
import ThiagoSilva89 from '../assets/imagecartas/ICONS/thiago-silva-89.png';
import Sammer89 from '../assets/imagecartas/ICONS/sammer-89.png';
import Moore89 from '../assets/imagecartas/ICONS/moore-89.png';
import Koeman88 from '../assets/imagecartas/ICONS/koeman-88.png';
import Vidic88 from '../assets/imagecartas/ICONS/vidic-88.png';
import Costacurta88 from '../assets/imagecartas/ICONS/costacurta-88.png';
import Desailly88 from '../assets/imagecartas/ICONS/desailly-88.png';
import FernandoHierro88 from '../assets/imagecartas/ICONS/fernando-hierro-88.png';
import Campbell88 from '../assets/imagecartas/ICONS/campbell-88.png';

import RobertoCarlos93 from '../assets/imagecartas/ICONS/roberto-carlos-93.png';
import Marcelo92 from '../assets/imagecartas/ICONS/marcelo-92.png';
import NiltonSantos91 from '../assets/imagecartas/ICONS/nilton-santos-91.png';
import JordiAlba90 from '../assets/imagecartas/ICONS/jordi-alba-90.png';
import Brehme89 from '../assets/imagecartas/ICONS/brehme-89.png';
import Facchetti90 from '../assets/imagecartas/ICONS/facchetti-90.png';
import Cole87 from '../assets/imagecartas/ICONS/cole-87.png';
import Evra86 from '../assets/imagecartas/ICONS/evra-86.png';

import Cafu93 from '../assets/imagecartas/ICONS/cafu-93.png';
import DaniAlves92 from '../assets/imagecartas/ICONS/dani-alves-92.png';
import Zanetti91 from '../assets/imagecartas/ICONS/zanetti-91.png';
import CarlosAlberto91 from '../assets/imagecartas/ICONS/carlos-alberto-91.png';
import Lahm90 from '../assets/imagecartas/ICONS/lahm-90.png';
import Thuram90 from '../assets/imagecartas/ICONS/thuram-90.png';
import DjalmaSantos90 from '../assets/imagecartas/ICONS/djalma-santos-90.png';
import Zambrotta89 from '../assets/imagecartas/ICONS/zambrotta-89.png';
import Bergomi88 from '../assets/imagecartas/ICONS/bergomi-88.png';
import GaryNeville88 from '../assets/imagecartas/ICONS/gary-neville-88.png';

import Busquets92 from '../assets/imagecartas/ICONS/busquets-92.png';
import Casemiro92 from '../assets/imagecartas/ICONS/casemiro-92.png';
import Vieira91 from '../assets/imagecartas/ICONS/vieira-91.png';
import Pirlo91 from '../assets/imagecartas/ICONS/pirlo-91.png';
import Rijkaard90 from '../assets/imagecartas/ICONS/rijkaard-90.png';
import Toure90 from '../assets/imagecartas/ICONS/toure-90.png';
import Vidal90 from '../assets/imagecartas/ICONS/vidal-90.png';
import Matthaus90 from '../assets/imagecartas/ICONS/matthaus-90.png';
import XabiAlonso90 from '../assets/imagecartas/ICONS/xabi-alonso-90.png';
import Keane89 from '../assets/imagecartas/ICONS/keane-89.png';
import Didi90 from '../assets/imagecartas/ICONS/didi-90.png';
import Guardiola90 from '../assets/imagecartas/ICONS/guardiola-90.png';
import Redondo89 from '../assets/imagecartas/ICONS/redondo-89.png';
import Petit89 from '../assets/imagecartas/ICONS/petit-89.png';
import Cambiasso89 from '../assets/imagecartas/ICONS/cambiasso-89.png';
import Totti89MCD from '../assets/imagecartas/ICONS/totti-89.png'; // Distinguir de Totti MCO
import Gerson89 from '../assets/imagecartas/ICONS/gerson-89.png';
import Gattuso89 from '../assets/imagecartas/ICONS/gattuso-89.png';
import Davids88 from '../assets/imagecartas/ICONS/davids-88.png';
import Makelele88 from '../assets/imagecartas/ICONS/makelele-88.png';
import Essien88 from '../assets/imagecartas/ICONS/essien-88.png';

import XaviHernandez94 from '../assets/imagecartas/ICONS/xavi-hernandez-94.png';
import Iniesta94 from '../assets/imagecartas/ICONS/iniesta-94.png';
import Gullit92 from '../assets/imagecartas/ICONS/gullit-92.png';
import Kroos93 from '../assets/imagecartas/ICONS/kroos-93.png';
import LuisSuarezEsp92 from '../assets/imagecartas/ICONS/luis-suarez-esp-92.png';
import Ballack89 from '../assets/imagecartas/ICONS/ballack-89.png';
import Lampard89 from '../assets/imagecartas/ICONS/lampard-89.png';
import Gerrard89 from '../assets/imagecartas/ICONS/gerrard-89.png';
import Ancelotti89 from '../assets/imagecartas/ICONS/ancelloti-89.png';
import Beckham89 from '../assets/imagecartas/ICONS/beckham-89.png';
import Seedorf89 from '../assets/imagecartas/ICONS/seedorf-89.png';
import DavidSilva87 from '../assets/imagecartas/ICONS/david-silva-87.png';
import Schweinsteiger88 from '../assets/imagecartas/ICONS/schweinsteiger-88.png';
import Aimar88 from '../assets/imagecartas/ICONS/aimar-88.png';
import Fabregas88 from '../assets/imagecartas/ICONS/fabregas-88.png';
import Sneijder88 from '../assets/imagecartas/ICONS/sneijder-88.png';
import Scholes88 from '../assets/imagecartas/ICONS/scholes-88.png';
import Veron88 from '../assets/imagecartas/ICONS/veron-88.png';

import Maradona95 from '../assets/imagecartas/ICONS/maradona-95.png';
import Pele95 from '../assets/imagecartas/ICONS/pele-95.png';
import Cruyff94 from '../assets/imagecartas/ICONS/cruyff-94.png';
import Platini94 from '../assets/imagecartas/ICONS/platini-94.png';
import Charlton91 from '../assets/imagecartas/ICONS/charlton-91.png';
import Zico91 from '../assets/imagecartas/ICONS/zico-91.png';
import Kaka91 from '../assets/imagecartas/ICONS/kaka-91.png';
import Francescoli90 from '../assets/imagecartas/ICONS/francescoli-90.png';
import Baggio90 from '../assets/imagecartas/ICONS/baggio-90.png';
import Scarone90 from '../assets/imagecartas/ICONS/scarone-90.png';
import DelPiero90 from '../assets/imagecartas/ICONS/del-piero-90.png';
import Riquelme90 from '../assets/imagecartas/ICONS/riquelme-90.png';
import Rivera90 from '../assets/imagecartas/ICONS/rivera-90.png';
import Ozil89 from '../assets/imagecartas/ICONS/ozil-89.png';
import Valderrama89 from '../assets/imagecartas/ICONS/valderrama-89.png';
import Sivori89 from '../assets/imagecartas/ICONS/sivori-89.png';
import Socrates89 from '../assets/imagecartas/ICONS/socrates-89.png';
import Boniek88 from '../assets/imagecartas/ICONS/boniek-88.png';
import MagicoGonzalez88 from '../assets/imagecartas/ICONS/magico-gonzalez-88.png';
import Laudrup88 from '../assets/imagecartas/ICONS/laudrup-88.png';
import Zola88 from '../assets/imagecartas/ICONS/zola-88.png';
import Hagi88 from '../assets/imagecartas/ICONS/hagi-88.png';
import Zidane94 from '../assets/imagecartas/ICONS/zidane.png';

import Ribery90 from '../assets/imagecartas/ICONS/ribery-90.png';
import Netzer90 from '../assets/imagecartas/ICONS/netzer-90.png';
import Giggs89 from '../assets/imagecartas/ICONS/giggs-89.png';
import Effenberg89 from '../assets/imagecartas/ICONS/effenberg-89.png';
import Nedved89 from '../assets/imagecartas/ICONS/nedved-89.png';
import Pires88 from '../assets/imagecartas/ICONS/pires-88.png';

import Robben90 from '../assets/imagecartas/ICONS/robben-90.png';
import Bergkamp89 from '../assets/imagecartas/ICONS/bergkamp-89.png';
import Sastre89 from '../assets/imagecartas/ICONS/sastre-89.png';
import Souness89 from '../assets/imagecartas/ICONS/souness-89.png';
import RobertoRivelino89 from '../assets/imagecartas/ICONS/roberto-rivelino-89.png';
import Okocha88 from '../assets/imagecartas/ICONS/okocha-88.png';

import Ronaldinho93 from '../assets/imagecartas/ICONS/ronaldhino-93.png';
import ThierryHenry92 from '../assets/imagecartas/ICONS/thierry-henry-92.png';
import Rivaldo90 from '../assets/imagecartas/ICONS/rivaldo-90.png';
import PacoGento91 from '../assets/imagecartas/ICONS/paco-gento-91.png';
import Stoichkov89 from '../assets/imagecartas/ICONS/stoichkov-89.png';
import Hoeness88 from '../assets/imagecartas/ICONS/hoeness-88.png';
import Barnes88 from '../assets/imagecartas/ICONS/barnes-88.png';

import Garrincha92 from '../assets/imagecartas/ICONS/garrincha-92.png';
import DiMaria91 from '../assets/imagecartas/ICONS/di-maria-91.png';
import Meazza91 from '../assets/imagecartas/ICONS/meazza-91.png';
import Best90 from '../assets/imagecartas/ICONS/best-90.png';
import GarethBale92 from '../assets/imagecartas/ICONS/gareth-bale-92.png';
import Jairzinho89 from '../assets/imagecartas/ICONS/jairzinho-89.png';
import LuisFigo89 from '../assets/imagecartas/ICONS/luis-figo-89.png';
import Kopa89 from '../assets/imagecartas/ICONS/kopa-89.png';

import RonaldoNazario94 from '../assets/imagecartas/ICONS/ronaldo-nazario-94.png';
import DiStefano94 from '../assets/imagecartas/ICONS/di-stefano-94.png';
import VanBasten93 from '../assets/imagecartas/ICONS/van-basten-93.png';
import Puskas92 from '../assets/imagecartas/ICONS/puskas-92.png';
import Eusebio91 from '../assets/imagecartas/ICONS/eusebio-91.png';
import Kempes91 from '../assets/imagecartas/ICONS/kempes-91.png';
import Muller92 from '../assets/imagecartas/ICONS/muller-92.png';
import Ibrahimovic91 from '../assets/imagecartas/ICONS/ibrahimovic-91.png';
import Aguero90 from '../assets/imagecartas/ICONS/aguero-90.png';
import DenisLaw89 from '../assets/imagecartas/ICONS/denis-law-89.png';
import Batistuta90 from '../assets/imagecartas/ICONS/batistuta-90.png';
import Raul90 from '../assets/imagecartas/ICONS/raul-90.png';
import Benzema90 from '../assets/imagecartas/ICONS/benzema-90.png';
import Etoo90 from '../assets/imagecartas/ICONS/etoo-90.png';
import Romario90 from '../assets/imagecartas/ICONS/romario-90.png';
import Dalglish90 from '../assets/imagecartas/ICONS/dalglish-90.png';
import Papin89 from '../assets/imagecartas/ICONS/papin-89.png';
import Voller88 from '../assets/imagecartas/ICONS/voller-88.png';
import Drogba90 from '../assets/imagecartas/ICONS/drogba-90.png';
import VanNistelrooy89 from '../assets/imagecartas/ICONS/van-nistelrooy-89.png';
import Shevchenko89 from '../assets/imagecartas/ICONS/schevchenko-89.png';
import Inzaghi89 from '../assets/imagecartas/ICONS/inzaghi-89.png';
import Weah89 from '../assets/imagecartas/ICONS/weah-89.png';
import Villa89 from '../assets/imagecartas/ICONS/villa-89.png';
import Bican89 from '../assets/imagecartas/ICONS/bican-89.png';
import HugoSanchez89 from '../assets/imagecartas/ICONS/hugo-sanchez-89.png';
import Lineker89 from '../assets/imagecartas/ICONS/lineker-89.png';
import Cantona89 from '../assets/imagecartas/ICONS/cantona-89.png';
import Butragueno88 from '../assets/imagecartas/ICONS/butragueno-88.png';
import Milla88 from '../assets/imagecartas/ICONS/milla-88.png';
import Owen88 from '../assets/imagecartas/ICONS/owen-88.png';
import Griezmann88 from '../assets/imagecartas/ICONS/griezmann-88.png';
import Shearer88 from '../assets/imagecartas/ICONS/shearer-88.png';
import Klose88 from '../assets/imagecartas/ICONS/klose-88.png';
import VanPersie88 from '../assets/imagecartas/ICONS/van-persie-88.png';
import Rooney88 from '../assets/imagecartas/ICONS/rooney-88.png';
import Wright87 from '../assets/imagecartas/ICONS/wright-87.png';
import Rush87 from '../assets/imagecartas/ICONS/rush-87.png';
import Kluivert87 from '../assets/imagecartas/ICONS/kluivert-87.png';
import Suker87 from '../assets/imagecartas/ICONS/suker-87.png';
import FernandoTorres87 from '../assets/imagecartas/ICONS/fernando-torres-87.png';
import Crespo88 from '../assets/imagecartas/ICONS/crespo-88.png';
import Larsson86 from '../assets/imagecartas/ICONS/larsson-86.png';
// import Trezeguet86 from '../assets/imagecartas/ICONS/trezeguet-86.png'; // Comentado como solicitaste

import matheusLahoz from '../assets/imagecartas/ICONS/matheus-lahoz-91.png';
import negreira from '../assets/imagecartas/ICONS/negreira-91.png';

import TetoUtau90 from '../assets/imagecartas/ICONS/teto-utau-90.png';
import TetoSynth92 from '../assets/imagecartas/ICONS/teto-synth-92.png';
import MikuBase91 from '../assets/imagecartas/ICONS/miku-base-91.png';
import Miku92 from '../assets/imagecartas/ICONS/miku-92.png';
import Neru92 from '../assets/imagecartas/ICONS/neru-92.png';
import NeruBase90 from '../assets/imagecartas/ICONS/neru-base-90.png';

const jugadoresData = [
  { id: 'neuer-94', name: 'Neuer', rating: 94, club: 'Icon', nation: 'Alemania', position: 'GK', imageUri: Neuer94, type: 'Icono' },
  { id: 'casillas-93', name: 'Casillas', rating: 93, club: 'Icon', nation: 'España', position: 'GK', imageUri: Casillas93, type: 'Icono' },
  { id: 'yashin-92', name: 'Yashin', rating: 92, club: 'Icon', nation: 'Rusia', position: 'GK', imageUri: Yashin92, type: 'Icono' },
  { id: 'buffon-92', name: 'Buffon', rating: 92, club: 'Icon', nation: 'Italia', position: 'GK', imageUri: Buffon92, type: 'Icono' },
  { id: 'van-der-sar-90', name: 'Van der Sar', rating: 90, club: 'Icon', nation: 'Países Bajos', position: 'GK', imageUri: VanDerSar90, type: 'Icono' },
  { id: 'oliver-kahn-90', name: 'Oliver Kahn', rating: 90, club: 'Icon', nation: 'Alemania', position: 'GK', imageUri: OliverKahn90, type: 'Icono' },
  { id: 'victor-valdes-89', name: 'Víctor Valdés', rating: 89, club: 'Icon', nation: 'España', position: 'GK', imageUri: VictorValdes89, type: 'Icono' },
  { id: 'dida-89', name: 'Dida', rating: 89, club: 'Icon', nation: 'Brasil', position: 'GK', imageUri: Dida89, type: 'Icono' },
  { id: 'fillol-88', name: 'Fillol', rating: 88, club: 'Icon', nation: 'Argentina', position: 'GK', imageUri: Fillol88, type: 'Icono' },
  { id: 'schmeichel-88', name: 'Schmeichel', rating: 88, club: 'Icon', nation: 'Dinamarca', position: 'GK', imageUri: Schmeichel88, type: 'Icono' },
  { id: 'bravo-88', name: 'Bravo', rating: 88, club: 'Icon', nation: 'Chile', position: 'GK', imageUri: Bravo88, type: 'Icono' },
  { id: 'cech-88', name: 'Čech', rating: 88, club: 'Icon', nation: 'República Checa', position: 'GK', imageUri: Cech88, type: 'Icono' },
  { id: 'chilavert-87', name: 'Chilavert', rating: 87, club: 'Icon', nation: 'Paraguay', position: 'GK', imageUri: Chilavert87, type: 'Icono' },
  { id: 'banks-87', name: 'Banks', rating: 87, club: 'Icon', nation: 'Inglaterra', position: 'GK', imageUri: Banks87, type: 'Icono' },
  { id: 'dino-zoff-87', name: 'Dino Zoff', rating: 87, club: 'Icon', nation: 'Italia', position: 'GK', imageUri: DinoZoff87, type: 'Icono' },
  { id: 'higuita-87', name: 'Higuita', rating: 87, club: 'Icon', nation: 'Colombia', position: 'GK', imageUri: Higuita87, type: 'Icono' },
  { id: 'preudhomme-87', name: 'Preud\'homme', rating: 87, club: 'Icon', nation: 'Bélgica', position: 'GK', imageUri: Preudhomme87, type: 'Icono' },
  { id: 'seaman-87', name: 'Seaman', rating: 87, club: 'Icon', nation: 'Inglaterra', position: 'GK', imageUri: Seaman87, type: 'Icono' },

  // Defensas (DFC)
  { id: 'maldini-94', name: 'Maldini', rating: 94, club: 'Icon', nation: 'Italia', position: 'DFC', imageUri: Maldini94, type: 'Icono' },
  { id: 'beckenbauer-94', name: 'Beckenbauer', rating: 94, club: 'Icon', nation: 'Alemania', position: 'DFC', imageUri: Beckenbauer94, type: 'Icono' },
  { id: 'ramos-93', name: 'Ramos', rating: 93, club: 'Icon', nation: 'España', position: 'DFC', imageUri: Ramos93, type: 'Icono' },
  { id: 'pepe-92', name: 'Pepe', rating: 92, club: 'Icon', nation: 'Portugal', position: 'DFC', imageUri: Pepe92, type: 'Icono' },
  { id: 'passarella-92', name: 'Passarella', rating: 92, club: 'Icon', nation: 'Argentina', position: 'DFC', imageUri: Passarella92, type: 'Icono' },
  { id: 'figueroa-92', name: 'Figueroa', rating: 92, club: 'Icon', nation: 'Chile', position: 'DFC', imageUri: Figueroa92, type: 'Icono' },
  { id: 'baresi-91', name: 'Baresi', rating: 91, club: 'Icon', nation: 'Italia', position: 'DFC', imageUri: Baresi91, type: 'Icono' },
  { id: 'pique-90', name: 'Piqué', rating: 90, club: 'Icon', nation: 'España', position: 'DFC', imageUri: Pique90, type: 'Icono' },
  { id: 'puyol-90', name: 'Puyol', rating: 90, club: 'Icon', nation: 'España', position: 'DFC', imageUri: Puyol90, type: 'Icono' },
  { id: 'blanc-90', name: 'Blanc', rating: 90, club: 'Icon', nation: 'Francia', position: 'DFC', imageUri: Blanc90, type: 'Icono' },
  { id: 'lucio-90', name: 'Lúcio', rating: 90, club: 'Icon', nation: 'Brasil', position: 'DFC', imageUri: Lucio90, type: 'Icono' },
  { id: 'nesta-89', name: 'Nesta', rating: 89, club: 'Icon', nation: 'Italia', position: 'DFC', imageUri: Nesta89, type: 'Icono' },
  { id: 'varane-89', name: 'Varane', rating: 89, club: 'Icon', nation: 'Francia', position: 'DFC', imageUri: Varane89, type: 'Icono' },
  { id: 'cannavaro-89', name: 'Cannavaro', rating: 89, club: 'Icon', nation: 'Italia', position: 'DFC', imageUri: Cannavaro89, type: 'Icono' },
  { id: 'cesare-maldini-89', name: 'Cesare Maldini', rating: 89, club: 'Icon', nation: 'Italia', position: 'DFC', imageUri: CesareMaldini89, type: 'Icono' },
  { id: 'ferdinand-89', name: 'Ferdinand', rating: 89, club: 'Icon', nation: 'Inglaterra', position: 'DFC', imageUri: Ferdinand89, type: 'Icono' },
  { id: 'nasazzi-89', name: 'Nasazzi', rating: 89, club: 'Icon', nation: 'Uruguay', position: 'DFC', imageUri: Nasazzi89, type: 'Icono' },
  { id: 'thiago-silva-89', name: 'Thiago Silva', rating: 89, club: 'Icon', nation: 'Brasil', position: 'DFC', imageUri: ThiagoSilva89, type: 'Icono' },
  { id: 'sammer-89', name: 'Sammer', rating: 89, club: 'Icon', nation: 'Alemania', position: 'DFC', imageUri: Sammer89, type: 'Icono' },
  { id: 'moore-89', name: 'Moore', rating: 89, club: 'Icon', nation: 'Inglaterra', position: 'DFC', imageUri: Moore89, type: 'Icono' },
  { id: 'koeman-88', name: 'Koeman', rating: 88, club: 'Icon', nation: 'Países Bajos', position: 'DFC', imageUri: Koeman88, type: 'Icono' },
  { id: 'vidic-88', name: 'Vidić', rating: 88, club: 'Icon', nation: 'Serbia', position: 'DFC', imageUri: Vidic88, type: 'Icono' },
  { id: 'costacurta-88', name: 'Costacurta', rating: 88, club: 'Icon', nation: 'Italia', position: 'DFC', imageUri: Costacurta88, type: 'Icono' },
  { id: 'desailly-88', name: 'Desailly', rating: 88, club: 'Icon', nation: 'Francia', position: 'DFC', imageUri: Desailly88, type: 'Icono' },
  { id: 'fernando-hierro-88', name: 'Fernando Hierro', rating: 88, club: 'Icon', nation: 'España', position: 'DFC', imageUri: FernandoHierro88, type: 'Icono' },
  { id: 'campbell-88', name: 'Campbell', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'DFC', imageUri: Campbell88, type: 'Icono' },

  // Lateral izquierdo (LI)
  { id: 'roberto-carlos-93', name: 'Roberto Carlos', rating: 93, club: 'Icon', nation: 'Brasil', position: 'LI', imageUri: RobertoCarlos93, type: 'Icono' },
  { id: 'marcelo-92', name: 'Marcelo', rating: 92, club: 'Icon', nation: 'Brasil', position: 'LI', imageUri: Marcelo92, type: 'Icono' },
  { id: 'nilton-santos-91', name: 'Nilton Santos', rating: 91, club: 'Icon', nation: 'Brasil', position: 'LI', imageUri: NiltonSantos91, type: 'Icono' },
  { id: 'jordi-alba-90', name: 'Jordi Alba', rating:90, club: 'Icon', nation: 'España', position: 'LI', imageUri: JordiAlba90, type: 'Icono' },
  { id: 'brehme-89', name: 'Brehme', rating: 89, club: 'Icon', nation: 'Alemania', position: 'LI', imageUri: Brehme89, type: 'Icono' },
  { id: 'facchetti-90', name: 'Facchetti', rating: 90, club: 'Icon', nation: 'Italia', position: 'LI', imageUri: Facchetti90, type: 'Icono' },
  { id: 'cole-87', name: 'Cole', rating: 87, club: 'Icon', nation: 'Inglaterra', position: 'LI', imageUri: Cole87, type: 'Icono' },
  { id: 'evra-86', name: 'Evra', rating: 86, club: 'Icon', nation: 'Francia', position: 'LI', imageUri: Evra86, type: 'Icono' },

  // Lateral derecho (LD)
  { id: 'cafu-93', name: 'Cafu', rating: 93, club: 'Icon', nation: 'Brasil', position: 'LD', imageUri: Cafu93, type: 'Icono' },
  { id: 'dani-alves-92', name: 'Dani Alves', rating: 92, club: 'Icon', nation: 'Brasil', position: 'LD', imageUri: DaniAlves92, type: 'Icono' },
  { id: 'zanetti-91', name: 'Zanetti', rating: 91, club: 'Icon', nation: 'Argentina', position: 'LD', imageUri: Zanetti91, type: 'Icono' },
  { id: 'carlos-alberto-91', name: 'Carlos Alberto', rating: 91, club: 'Icon', nation: 'Brasil', position: 'LD', imageUri: CarlosAlberto91, type: 'Icono' },
  { id: 'lahm-90', name: 'Lahm', rating: 90, club: 'Icon', nation: 'Alemania', position: 'LD', imageUri: Lahm90, type: 'Icono' },
  { id: 'thuram-90', name: 'Thuram', rating: 90, club: 'Icon', nation: 'Francia', position: 'LD', imageUri: Thuram90, type: 'Icono' },
  { id: 'djalma-santos-90', name: 'Djalma Santos', rating: 90, club: 'Icon', nation: 'Brasil', position: 'LD', imageUri: DjalmaSantos90, type: 'Icono' },
  { id: 'zambrotta-89', name: 'Zambrotta', rating: 89, club: 'Icon', nation: 'Italia', position: 'LD', imageUri: Zambrotta89, type: 'Icono' },
  { id: 'bergomi-88', name: 'Bergomi', rating: 88, club: 'Icon', nation: 'Italia', position: 'LD', imageUri: Bergomi88, type: 'Icono' },
  { id: 'gary-neville-88', name: 'Gary Neville', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'LD', imageUri: GaryNeville88, type: 'Icono' },

  // Mediocampistas Defensivos (MCD)
  { id: 'busquets-92', name: 'Busquets', rating: 92, club: 'Icon', nation: 'España', position: 'MCD', imageUri: Busquets92, type: 'Icono' },
  { id: 'casemiro-92', name: 'Casemiro', rating: 92, club: 'Icon', nation: 'Brasil', position: 'MCD', imageUri: Casemiro92, type: 'Icono' },
  { id: 'vieira-91', name: 'Vieira', rating: 91, club: 'Icon', nation: 'Francia', position: 'MCD', imageUri: Vieira91, type: 'Icono' },
  { id: 'pirlo-91', name: 'Pirlo', rating: 91, club: 'Icon', nation: 'Italia', position: 'MCD', imageUri: Pirlo91, type: 'Icono' },
  { id: 'rijkard-90', name: 'Rijkaard', rating: 90, club: 'Icon', nation: 'Países Bajos', position: 'MCD', imageUri: Rijkaard90, type: 'Icono' },
  { id: 'toure-90', name: 'Touré', rating: 90, club: 'Icon', nation: 'Costa de Marfil', position: 'MCD', imageUri: Toure90, type: 'Icono' },
  { id: 'vidal-90', name: 'Vidal', rating: 90, club: 'Icon', nation: 'Chile', position: 'MCD', imageUri: Vidal90, type: 'Icono' },
  { id: 'matthaus-90', name: 'Matthaus', rating: 90, club: 'Icon', nation: 'Alemania', position: 'MCD', imageUri: Matthaus90, type: 'Icono' },
  { id: 'xabi-alonso-90', name: 'Xabi Alonso', rating: 90, club: 'Icon', nation: 'España', position: 'MCD', imageUri: XabiAlonso90, type: 'Icono' },
  { id: 'keane-89', name: 'Keane', rating: 89, club: 'Icon', nation: 'Irlanda', position: 'MCD', imageUri: Keane89, type: 'Icono' },
  { id: 'didi-90', name: 'Didi', rating: 90, club: 'Icon', nation: 'Brasil', position: 'MCD', imageUri: Didi90, type: 'Icono' },
  { id: 'guardiola-90', name: 'Guardiola', rating: 90, club: 'Icon', nation: 'España', position: 'MCD', imageUri: Guardiola90, type: 'Icono' },
  { id: 'redondo-89', name: 'Redondo', rating: 89, club: 'Icon', nation: 'Argentina', position: 'MCD', imageUri: Redondo89, type: 'Icono' },
  { id: 'petit-89', name: 'Petit', rating: 89, club: 'Icon', nation: 'Francia', position: 'MCD', imageUri: Petit89, type: 'Icono' },
  { id: 'cambiasso-89', name: 'Cambiasso', rating: 89, club: 'Icon', nation: 'Argentina', position: 'MCD', imageUri: Cambiasso89, type: 'Icono' },
  { id: 'totti-89-mcd', name: 'Totti', rating: 89, club: 'Icon', nation: 'Italia', position: 'MCD', imageUri: Totti89MCD, type: 'Icono' },
  { id: 'gerson-89', name: 'Gerson', rating: 89, club: 'Icon', nation: 'Brasil', position: 'MCD', imageUri: Gerson89, type: 'Icono' },
  { id: 'gattuso-89', name: 'Gattuso', rating: 89, club: 'Icon', nation: 'Italia', position: 'MCD', imageUri: Gattuso89, type: 'Icono' },
  { id: 'davids-88', name: 'Davids', rating: 88, club: 'Icon', nation: 'Países Bajos', position: 'MCD', imageUri: Davids88, type: 'Icono' },
  { id: 'makelele-88', name: 'Makélélé', rating: 88, club: 'Icon', nation: 'Francia', position: 'MCD', imageUri: Makelele88, type: 'Icono' },
  { id: 'essien-88', name: 'Essien', rating: 88, club: 'Icon', nation: 'Ghana', position: 'MCD', imageUri: Essien88, type: 'Icono' },

  // Mediocampistas (MC)
  { id: 'xavi-hernandez-94', name: 'Xavi Hernández', rating: 94, club: 'Icon', nation: 'España', position: 'MC', imageUri: XaviHernandez94, type: 'Icono' },
  { id: 'iniesta-94', name: 'Iniesta', rating: 94, club: 'Icon', nation: 'España', position: 'MC', imageUri: Iniesta94, type: 'Icono' },
  { id: 'gullit-92', name: 'Gullit', rating: 92, club: 'Icon', nation: 'Países Bajos', position: 'MC', imageUri: Gullit92, type: 'Icono' },
  { id: 'kroos-93', name: 'Kroos', rating: 93, club: 'Icon', nation: 'Alemania', position: 'MC', imageUri: Kroos93, type: 'Icono' },
  { id: 'luis-suarez-esp-92', name: 'Luis Suárez (Esp)', rating: 92, club: 'Icon', nation: 'España', position: 'MC', imageUri: LuisSuarezEsp92, type: 'Icono' },
  { id: 'ballack-89', name: 'Ballack', rating: 89, club: 'Icon', nation: 'Alemania', position: 'MC', imageUri: Ballack89, type: 'Icono' },
  { id: 'lampard-89', name: 'Lampard', rating: 89, club: 'Icon', nation: 'Inglaterra', position: 'MC', imageUri: Lampard89, type: 'Icono' },
  { id: 'gerrard-89', name: 'Gerrard', rating: 89, club: 'Icon', nation: 'Inglaterra', position: 'MC', imageUri: Gerrard89, type: 'Icono' },
  { id: 'ancelloti-89', name: 'Ancelotti', rating: 89, club: 'Icon', nation: 'Italia', position: 'MC', imageUri: Ancelotti89, type: 'Icono' },
  { id: 'beckham-89', name: 'Beckham', rating: 89, club: 'Icon', nation: 'Inglaterra', position: 'MC', imageUri: Beckham89, type: 'Icono' },
  { id: 'seedorf-89', name: 'Seedorf', rating: 89, club: 'Icon', nation: 'Países Bajos', position: 'MC', imageUri: Seedorf89, type: 'Icono' },
  { id: 'david-silva-87', name: 'David Silva', rating: 87, club: 'Icon', nation: 'España', position: 'MC', imageUri: DavidSilva87, type: 'Icono' },
  { id: 'schweinsteiger-88', name: 'Schweinsteiger', rating: 88, club: 'Icon', nation: 'Alemania', position: 'MC', imageUri: Schweinsteiger88, type: 'Icono' },
  { id: 'aimar-88', name: 'Aimar', rating: 88, club: 'Icon', nation: 'Argentina', position: 'MC', imageUri: Aimar88, type: 'Icono' },
  { id: 'fabregas-88', name: 'Fàbregas', rating: 88, club: 'Icon', nation: 'España', position: 'MC', imageUri: Fabregas88, type: 'Icono' },
  { id: 'sneijder-88', name: 'Sneijder', rating: 88, club: 'Icon', nation: 'Países Bajos', position: 'MC', imageUri: Sneijder88, type: 'Icono' },
  { id: 'scholes-88', name: 'Scholes', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'MC', imageUri: Scholes88, type: 'Icono' },
  { id: 'veron-88', name: 'Verón', rating: 88, club: 'Icon', nation: 'Argentina', position: 'MC', imageUri: Veron88, type: 'Icono' },

  // Mediocampistas Ofensivos (MCO)
  { id: 'maradona-95', name: 'Maradona', rating: 95, club: 'Icon', nation: 'Argentina', position: 'MCO', imageUri: Maradona95, type: 'Icono' },
  { id: 'pele-95', name: 'Pelé', rating: 95, club: 'Icon', nation: 'Brasil', position: 'MCO', imageUri: Pele95, type: 'Icono' },
  { id: 'cruyff-94', name: 'Cruyff', rating: 94, club: 'Icon', nation: 'Países Bajos', position: 'MCO', imageUri: Cruyff94, type: 'Icono' },
  { id: 'platini-94', name: 'Platini', rating: 94, club: 'Icon', nation: 'Francia', position: 'MCO', imageUri: Platini94, type: 'Icono' },
  { id: 'charlton-91', name: 'Charlton', rating: 91, club: 'Icon', nation: 'Inglaterra', position: 'MCO', imageUri: Charlton91, type: 'Icono' },
  { id: 'zico-91', name: 'Zico', rating: 91, club: 'Icon', nation: 'Brasil', position: 'MCO', imageUri: Zico91, type: 'Icono' },
  { id: 'kaka-91', name: 'Kaká', rating: 91, club: 'Icon', nation: 'Brasil', position: 'MCO', imageUri: Kaka91, type: 'Icono' },
  { id: 'francescoli-90', name: 'Francescoli', rating: 90, club: 'Icon', nation: 'Uruguay', position: 'MCO', imageUri: Francescoli90, type: 'Icono' },
  { id: 'baggio-90', name: 'Baggio', rating: 90, club: 'Icon', nation: 'Italia', position: 'MCO', imageUri: Baggio90, type: 'Icono' },
  { id: 'scarone-90', name: 'Scarone', rating: 90, club: 'Icon', nation: 'Uruguay', position: 'MCO', imageUri: Scarone90, type: 'Icono' },
  { id: 'del-piero-90', name: 'Del Piero', rating: 90, club: 'Icon', nation: 'Italia', position: 'MCO', imageUri: DelPiero90, type: 'Icono' },
  { id: 'riquelme-90', name: 'Riquelme', rating: 90, club: 'Icon', nation: 'Argentina', position: 'MCO', imageUri: Riquelme90, type: 'Icono' },
  { id: 'rivera-90', name: 'Rivera', rating: 90, club: 'Icon', nation: 'Italia', position: 'MCO', imageUri: Rivera90, type: 'Icono' },
  { id: 'ozil-89', name: 'Özil', rating: 89, club: 'Icon', nation: 'Alemania', position: 'MCO', imageUri: Ozil89, type: 'Icono' },
  { id: 'valderrama-89', name: 'Valderrama', rating: 89, club: 'Icon', nation: 'Colombia', position: 'MCO', imageUri: Valderrama89, type: 'Icono' },
  { id: 'sivori-89', name: 'Sívori', rating: 89, club: 'Icon', nation: 'Argentina', position: 'MCO', imageUri: Sivori89, type: 'Icono' },
  { id: 'socrates-89', name: 'Sócrates', rating: 89, club: 'Icon', nation: 'Brasil', position: 'MCO', imageUri: Socrates89, type: 'Icono' },
  { id: 'boniek-88', name: 'Boniek', rating: 88, club: 'Icon', nation: 'Polonia', position: 'MCO', imageUri: Boniek88, type: 'Icono' },
  { id: 'magico-gonzalez-88', name: 'Mágico González', rating: 88, club: 'Icon', nation: 'El Salvador', position: 'MCO', imageUri: MagicoGonzalez88, type: 'Icono' },
  { id: 'laudrup-88', name: 'Laudrup', rating: 88, club: 'Icon', nation: 'Dinamarca', position: 'MCO', imageUri: Laudrup88, type: 'Icono' },
  { id: 'zola-88', name: 'Zola', rating: 88, club: 'Icon', nation: 'Italia', position: 'MCO', imageUri: Zola88, type: 'Icono' },
  { id: 'hagi-88', name: 'Hagi', rating: 88, club: 'Icon', nation: 'Rumania', position: 'MCO', imageUri: Hagi88, type: 'Icono' },
  { id: 'zidane-94', name: 'Zidane', rating: 94, club: 'Icon', nation: 'Francia', position: 'MCO', imageUri: Zidane94, type: 'Icono' },

  // Mediocampistas Izquierdo (MI)
  { id: 'ribery-90', name: 'Ribéry', rating: 90, club: 'Icon', nation: 'Francia', position: 'MI', imageUri: Ribery90, type: 'Icono' },
  { id: 'netzer-90', name: 'Netzer', rating: 90, club: 'Icon', nation: 'Alemania', position: 'MI', imageUri: Netzer90, type: 'Icono' },
  { id: 'giggs-89', name: 'Giggs', rating: 89, club: 'Icon', nation: 'Gales', position: 'MI', imageUri: Giggs89, type: 'Icono' },
  { id: 'effenberg-89', name: 'Effenberg', rating: 89, club: 'Icon', nation: 'Alemania', position: 'MI', imageUri: Effenberg89, type: 'Icono' },
  { id: 'nedved-89', name: 'Nedvěd', rating: 89, club: 'Icon', nation: 'República Checa', position: 'MI', imageUri: Nedved89, type: 'Icono' },
  { id: 'pires-88', name: 'Pirès', rating: 88, club: 'Icon', nation: 'Francia', position: 'MI', imageUri: Pires88, type: 'Icono' },

  // Mediocampistas Derechos (MD)
  { id: 'robben-90', name: 'Robben', rating: 90, club: 'Icon', nation: 'Países Bajos', position: 'MD', imageUri: Robben90, type: 'Icono' },
  { id: 'bergkamp-89', name: 'Bergkamp', rating: 89, club: 'Icon', nation: 'Países Bajos', position: 'MD', imageUri: Bergkamp89, type: 'Icono' },
  { id: 'sastre-89', name: 'Sastre', rating: 89, club: 'Icon', nation: 'Argentina', position: 'MD', imageUri: Sastre89, type: 'Icono' },
  { id: 'souness-89', name: 'Souness', rating: 89, club: 'Icon', nation: 'Escocia', position: 'MD', imageUri: Souness89, type: 'Icono' },
  { id: 'roberto-rivelino-89', name: 'Roberto Rivelino', rating: 89, club: 'Icon', nation: 'Brasil', position: 'MD', imageUri: RobertoRivelino89, type: 'Icono' },
  { id: 'okocha-88', name: 'Okocha', rating: 88, club: 'Icon', nation: 'Nigeria', position: 'MD', imageUri: Okocha88, type: 'Icono' },

  // Extremos Izquierdo (EI)
  { id: 'ronaldinho-93', name: 'Ronaldinho', rating: 93, club: 'Icon', nation: 'Brasil', position: 'EI', imageUri: Ronaldinho93, type: 'Icono' },
  { id: 'thierry-henry-92', name: 'Thierry Henry', rating: 92, club: 'Icon', nation: 'Francia', position: 'EI', imageUri: ThierryHenry92, type: 'Icono' },
  { id: 'rivaldo-90', name: 'Rivaldo', rating: 90, club: 'Icon', nation: 'Brasil', position: 'EI', imageUri: Rivaldo90, type: 'Icono' },
  { id: 'paco-gento-91', name: 'Paco Gento', rating: 91, club: 'Icon', nation: 'España', position: 'EI', imageUri: PacoGento91, type: 'Icono' },
  { id: 'stoichkov-89', name: 'Stoichkov', rating: 89, club: 'Icon', nation: 'Bulgaria', position: 'EI', imageUri: Stoichkov89, type: 'Icono' },
  { id: 'hoeness-88', name: 'Hoeneß', rating: 88, club: 'Icon', nation: 'Alemania', position: 'EI', imageUri: Hoeness88, type: 'Icono' },
  { id: 'barnes-88', name: 'Barnes', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'EI', imageUri: Barnes88, type: 'Icono' },

  // Extremo derecho (ED)
  { id: 'garrincha-92', name: 'Garrincha', rating: 92, club: 'Icon', nation: 'Brasil', position: 'ED', imageUri: Garrincha92, type: 'Icono' },
  { id: 'di-maria-91', name: 'Di María', rating: 91, club: 'Icon', nation: 'Argentina', position: 'ED', imageUri: DiMaria91, type: 'Icono' },
  { id: 'meazza-91', name: 'Meazza', rating: 91, club: 'Icon', nation: 'Italia', position: 'ED', imageUri: Meazza91, type: 'Icono' },
  { id: 'best-90', name: 'Best', rating: 90, club: 'Icon', nation: 'Irlanda del Norte', position: 'ED', imageUri: Best90, type: 'Icono' },
  { id: 'gareth-bale-92', name: 'Gareth Bale', rating: 92, club: 'Icon', nation: 'Gales', position: 'ED', imageUri: GarethBale92, type: 'Icono' },
  { id: 'jairzinho-89', name: 'Jairzinho', rating: 89, club: 'Icon', nation: 'Brasil', position: 'ED', imageUri: Jairzinho89, type: 'Icono' },
  { id: 'luis-figo-89', name: 'Luis Figo', rating: 89, club: 'Icon', nation: 'Portugal', position: 'ED', imageUri: LuisFigo89, type: 'Icono' },
  { id: 'kopa-89', name: 'Kopa', rating: 89, club: 'Icon', nation: 'Francia', position: 'ED', imageUri: Kopa89, type: 'Icono' },

  // Delantero (DEL)
  { id: 'ronaldo-nazario-94', name: 'Ronaldo Nazario', rating: 94, club: 'Icon', nation: 'Brasil', position: 'DEL', imageUri: RonaldoNazario94, type: 'Icono' },
  { id: 'di-stefano-94', name: 'Di Stéfano', rating: 94, club: 'Icon', nation: 'Argentina', position: 'DEL', imageUri: DiStefano94, type: 'Icono' },
  { id: 'van-basten-93', name: 'Van Basten', rating: 93, club: 'Icon', nation: 'Países Bajos', position: 'DEL', imageUri: VanBasten93, type: 'Icono' },
  { id: 'puskas-92', name: 'Puskás', rating: 92, club: 'Icon', nation: 'Hungría', position: 'DEL', imageUri: Puskas92, type: 'Icono' },
  { id: 'eusebio-91', name: 'Eusébio', rating: 91, club: 'Icon', nation: 'Portugal', position: 'DEL', imageUri: Eusebio91, type: 'Icono' },
  { id: 'kempes-91', name: 'Kempes', rating: 91, club: 'Icon', nation: 'Argentina', position: 'DEL', imageUri: Kempes91, type: 'Icono' },
  { id: 'muller-92', name: 'Müller', rating: 92, club: 'Icon', nation: 'Alemania', position: 'DEL', imageUri: Muller92, type: 'Icono' },
  { id: 'ibrahimovic-91', name: 'Ibrahimović', rating: 91, club: 'Icon', nation: 'Suecia', position: 'DEL', imageUri: Ibrahimovic91, type: 'Icono' },
  { id: 'aguero-90', name: 'Agüero', rating: 90, club: 'Icon', nation: 'Argentina', position: 'DEL', imageUri: Aguero90, type: 'Icono' },
  { id: 'denis-law-89', name: 'Denis Law', rating: 89, club: 'Icon', nation: 'Escocia', position: 'DEL', imageUri: DenisLaw89, type: 'Icono' },
  { id: 'batistuta-90', name: 'Batistuta', rating: 90, club: 'Icon', nation: 'Argentina', position: 'DEL', imageUri: Batistuta90, type: 'Icono' },
  { id: 'raul-90', name: 'Raúl', rating: 90, club: 'Icon', nation: 'España', position: 'DEL', imageUri: Raul90, type: 'Icono' },
  { id: 'benzema-90', name: 'Benzema', rating: 90, club: 'Icon', nation: 'Francia', position: 'DEL', imageUri: Benzema90, type: 'Icono' },
  { id: 'etoo-90', name: 'Eto\'o', rating: 90, club: 'Icon', nation: 'Camerún', position: 'DEL', imageUri: Etoo90, type: 'Icono' },
  { id: 'romario-90', name: 'Romário', rating: 90, club: 'Icon', nation: 'Brasil', position: 'DEL', imageUri: Romario90, type: 'Icono' },
  { id: 'dalglish-90', name: 'Dalglish', rating: 90, club: 'Icon', nation: 'Escocia', position: 'DEL', imageUri: Dalglish90, type: 'Icono' },
  { id: 'papin-89', name: 'Papin', rating: 89, club: 'Icon', nation: 'Francia', position: 'DEL', imageUri: Papin89, type: 'Icono' },
  { id: 'voller-88', name: 'Völler', rating: 88, club: 'Icon', nation: 'Alemania', position: 'DEL', imageUri: Voller88, type: 'Icono' },
  { id: 'drogba-90', name: 'Drogba', rating: 90, club: 'Icon', nation: 'Costa de Marfil', position: 'DEL', imageUri: Drogba90, type: 'Icono' },
  { id: 'van-nistelrooy-89', name: 'Van Nistelrooy', rating: 89, club: 'Icon', nation: 'Países Bajos', position: 'DEL', imageUri: VanNistelrooy89, type: 'Icono' },
  { id: 'shevchenko-89', name: 'Shevchenko', rating: 89, club: 'Icon', nation: 'Ucrania', position: 'DEL', imageUri: Shevchenko89, type: 'Icono' },
  { id: 'inzaghi-89', name: 'Inzaghi', rating: 89, club: 'Icon', nation: 'Italia', position: 'DEL', imageUri: Inzaghi89, type: 'Icono' },
  { id: 'weah-89', name: 'Weah', rating: 89, club: 'Icon', nation: 'Liberia', position: 'DEL', imageUri: Weah89, type: 'Icono' },
  { id: 'villa-89', name: 'Villa', rating: 89, club: 'Icon', nation: 'España', position: 'DEL', imageUri: Villa89, type: 'Icono' },
  { id: 'bican-89', name: 'Bican', rating: 89, club: 'Icon', nation: 'Austria', position: 'DEL', imageUri: Bican89, type: 'Icono' },
  { id: 'hugo-sanchez-89', name: 'Hugo Sánchez', rating: 89, club: 'Icon', nation: 'México', position: 'DEL', imageUri: HugoSanchez89, type: 'Icono' },
  { id: 'lineker-89', name: 'Lineker', rating: 89, club: 'Icon', nation: 'Inglaterra', position: 'DEL', imageUri: Lineker89, type: 'Icono' },
  { id: 'cantona-89', name: 'Cantona', rating: 89, club: 'Icon', nation: 'Francia', position: 'DEL', imageUri: Cantona89, type: 'Icono' },
  { id: 'butragueno-88', name: 'Butragueño', rating: 88, club: 'Icon', nation: 'España', position: 'DEL', imageUri: Butragueno88, type: 'Icono' },
  { id: 'milla-88', name: 'Milla', rating: 88, club: 'Icon', nation: 'Camerún', position: 'DEL', imageUri: Milla88, type: 'Icono' },
  { id: 'owen-88', name: 'Owen', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'DEL', imageUri: Owen88, type: 'Icono' },
  { id: 'griezmann-88', name: 'Griezmann', rating: 88, club: 'Icon', nation: 'Francia', position: 'DEL', imageUri: Griezmann88, type: 'Icono' },
  { id: 'shearer-88', name: 'Shearer', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'DEL', imageUri: Shearer88, type: 'Icono' },
  { id: 'klose-88', name: 'Klose', rating: 88, club: 'Icon', nation: 'Alemania', position: 'DEL', imageUri: Klose88, type: 'Icono' },
  { id: 'van-persie-88', name: 'Van Persie', rating: 88, club: 'Icon', nation: 'Países Bajos', position: 'DEL', imageUri: VanPersie88, type: 'Icono' },
  { id: 'rooney-88', name: 'Rooney', rating: 88, club: 'Icon', nation: 'Inglaterra', position: 'DEL', imageUri: Rooney88, type: 'Icono' },
  { id: 'wright-87', name: 'Wright', rating: 87, club: 'Icon', nation: 'Inglaterra', position: 'DEL', imageUri: Wright87, type: 'Icono' },
  { id: 'rush-87', name: 'Rush', rating: 87, club: 'Icon', nation: 'Gales', position: 'DEL', imageUri: Rush87, type: 'Icono' },
  { id: 'kluivert-87', name: 'Kluivert', rating: 87, club: 'Icon', nation: 'Países Bajos', position: 'DEL', imageUri: Kluivert87, type: 'Icono' },
  { id: 'suker-87', name: 'Šuker', rating: 87, club: 'Icon', nation: 'Croacia', position:'DEL', imageUri: Suker87, type: 'Icono' },
  { id: 'fernando-torres-87', name: 'Fernando Torres', rating: 87, club: 'Icon', nation: 'España', position: 'DEL', imageUri: FernandoTorres87, type: 'Icono' },
  { id: 'crespo-88', name: 'Crespo', rating: 88, club: 'Icon', nation: 'Argentina', position: 'DEL', imageUri: Crespo88, type: 'Icono' },
  { id: 'larsson-86', name: 'Larsson', rating: 86, club: 'Icon', nation: 'Suecia', position: 'DEL', imageUri: Larsson86, type: 'Icono' },
  // { id: 'trezeguet-86', name: 'Trezeguet', rating: 86, club: 'Icon', nation: 'Francia', position: 'DEL', imageUri: Trezeguet86, type: 'Icono' },

  // Árbitros (también considerados jugadores con rating 91)
  { id: 'negreira', name: 'Negreira', rating: 91, club: 'Icon', nation: 'España', position: 'MCO', imageUri: 'negreira-91.png', type: 'Icono' },
  { id: 'matheus-lahoz', name: 'Matheus Lahoz', rating: 91, club: 'Icon', nation: 'España', position: 'MCO', imageUri: 'matheus-lahoz-91.png', type: 'Icono' },

  // VOCALOID X FC (códigos)
  { id: 'teto-utau-90', name: 'Teto (Utau)', rating: 90, club: 'Icon', nation: 'Utau', position: 'MI', imageUri: TetoUtau90, type: 'Icono' },
  { id: 'teto-synth-92', name: 'Teto (synth)', rating: 92, club: 'Icon', nation: 'Vocaloid', position: 'MI', imageUri: TetoSynth92, type: 'Icono' },
  { id: 'miku-base-91', name: 'Miku (Base)', rating: 91, club: 'Icon', nation: 'Vocaloid', position: 'MCO', imageUri: MikuBase91, type: 'Icono' },
  { id: 'miku-92', name: 'Miku', rating: 92, club: 'Icon', nation: 'Vocaloid', position: 'MCO', imageUri: Miku92, type: 'Icono' },
  { id: 'neru-92', name: 'Neru', rating: 92, club: 'Icon', nation: 'Vocaloid', position: 'MCO', imageUri: Neru92, type: 'Icono' },
  { id: 'neru-base-90', name: 'Neru Base', rating: 90, club: 'Icon', nation: 'Vocaloid', position: 'MCO', imageUri: NeruBase90, type: 'Icono' },
];


const formacionesData = [
  { id: '4-3-3', nombre: '4-3-3', posiciones: ['GK', 'LI', 'DFC_L', 'DFC_R', 'LD', 'MC_L', 'MC_C', 'MC_R', 'EI', 'DEL_C', 'ED'] },
];

// Define las posiciones base para el campo
const posicionesBaseMapa = {
    GK: { top: '95%', left: '50%', zIndex: 5, size: 50, nombre: 'POR' },
    DFC_L: { top: '75%', left: '20%', zIndex: 4, size: 50, nombre: 'DFC' },
    DFC_R: { top: '75%', left: '80%', zIndex: 4, size: 50, nombre: 'DFC' },
    LI: { top: '60%', left: '10%', zIndex: 3, size: 50, nombre: 'LI' },
    LD: { top: '60%', left: '90%', zIndex: 3, size: 50, nombre: 'LD' },
    MC_L: { top: '45%', left: '20%', zIndex: 3, size: 50, nombre: 'MC' },
    MC_C: { top: '45%', left: '50%', zIndex: 3, size: 50, nombre: 'MC' },
    MC_R: { top: '45%', left: '80%', zIndex: 3, size: 50, nombre: 'MC' },
    EI: { top: '20%', left: '15%', zIndex: 2, size: 50, nombre: 'EI' },
    ED: { top: '20%', left: '85%', zIndex: 2, size: 50, nombre: 'ED' },
    DEL_C: { top: '5%', left: '50%', zIndex: 1, size: 60, nombre: 'DEL' },
};

const FutDraftScreen = ({ navigation }) => {
    const [draftedPlayers, setDraftedPlayers] = useState([]);
    const [remainingPlayers, setRemainingPlayers] = useState([...playersData]); // Usar playersData
    const [isDrafting, setIsDrafting] = useState(false);
    const [currentPick, setCurrentPick] = useState(1);
    const totalPicks = 11;
    const totalSuplentes = 7;
    const totalReservas = 4;
    const [formacionSeleccionada, setFormacionSeleccionada] = useState(null);
    const [formacionActual, setFormacionActual] = useState({});
    const [suplentes, setSuplentes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [opcionesPick, setOpcionesPick] = useState([]);
    const [ratingGeneral, setRatingGeneral] = useState(0);
    const [jugadorSeleccionadoIntercambio, setJugadorSeleccionadoIntercambio] = useState(null);
    const [mensajeErrorIntercambio, setMensajeErrorIntercambio] = useState('');
    const [isBetaModalVisible, setIsBetaModalVisible] = useState(true); // Controla la visibilidad del modal Beta

    const posicionesDisponibles = formacionSeleccionada ? formacionSeleccionada.posiciones.reduce((acc, pos) => ({ ...acc, [pos]: null }), {}) : {};
    const posicionesMapa = Object.keys(posicionesDisponibles).reduce((acc, pos) => ({ ...acc, [pos]: posicionesBaseMapa[pos] }), {});

    // --- Mensaje de funcionalidad Beta para Draft ---
    const DRAFT_BETA_MESSAGE = "¡Bienvenido a la fase Beta del Draft! 🚧 Por ahora, puedes experimentar la emoción de armar tu equipo y ver cómo se ve en el campo. Estamos trabajando para: \n\n✅ Arreglar las imágenes que puedan faltar. \n🤖 Implementar partidos contra bots para probar tu equipo. \n🎁 Añadir emocionantes recompensas al finalizar tu Draft, \n\ntambien debes saber que por alguna razon no se puede salir es todo un lio pero bueno cuando termines esta prueba de draft tenes que salir y volver a entrar \n\n¡Pronto podrás disfrutar del Draft completo! Gracias por tu paciencia.";

    useEffect(() => {
        if (isDrafting && currentPick <= totalPicks + totalSuplentes + totalReservas && opcionesPick.length === 0) {
            setTimeout(() => {
                generarOpcionesPick();
            }, 500);
        } else if (!isDrafting && draftedPlayers.length === totalPicks + totalSuplentes + totalReservas) {
            calcularRatingGeneral();
        } else if (formacionActual && Object.keys(formacionActual).length === totalPicks && suplentes.length + reservas.length === totalSuplentes + totalReservas) {
            calcularRatingGeneral();
        }
    }, [isDrafting, currentPick, opcionesPick, draftedPlayers, formacionActual, suplentes, reservas]);

    const iniciarDraft = () => {
        if (!formacionSeleccionada) {
            alert('Por favor, elige una formación antes de iniciar el draft.');
            return;
        }
        setDraftedPlayers([]);
        setRemainingPlayers([...playersData]); // Reiniciar con playersData
        setIsDrafting(true);
        setCurrentPick(1);
        setFormacionActual({});
        setSuplentes([]);
        setReservas([]);
        setOpcionesPick([]);
        setRatingGeneral(0);
        setJugadorSeleccionadoIntercambio(null);
        setMensajeErrorIntercambio('');
    };


    const generarOpcionesPick = () => {
        if (remainingPlayers.length > 0 && currentPick <= totalPicks + totalSuplentes + totalReservas) {
            let opcionesFiltradas = [...remainingPlayers];
            const posicionObjetivo = formacionSeleccionada?.posiciones[currentPick - 1];

            if (currentPick <= totalPicks && formacionSeleccionada && posicionObjetivo) {
                console.log(`Pick ${currentPick}: Posición objetivo:`, posicionObjetivo);

                opcionesFiltradas = remainingPlayers.filter(jugador => {
                    if (posicionObjetivo === 'GK') {
                        return jugador.position === 'GK';
                    } else if (posicionObjetivo === 'LI') {
                        return jugador.position === 'LI' || jugador.position === 'LD';
                    } else if (posicionObjetivo === 'LD') {
                        return jugador.position === 'LD' || jugador.position === 'LI';
                    } else if (posicionObjetivo.startsWith('DFC')) {
                        return jugador.position.startsWith('DFC') || jugador.position === 'LI' || jugador.position === 'LD' || jugador.position === 'MCD';
                    } else if (posicionObjetivo.startsWith('MC')) {
                        return jugador.position.startsWith('MC') || jugador.position === 'MCO' || jugador.position === 'MI' || jugador.position === 'MD' || jugador.position === 'MCD';
                    } else if (posicionObjetivo === 'MCO_C') {
                        return jugador.position === 'MCO' || jugador.position.startsWith('MC') || jugador.position === 'MCD';
                    } else if (posicionObjetivo === 'EI') {
                        return jugador.position === 'EI' || jugador.position === 'ED' || jugador.position === 'MI';
                    } else if (posicionObjetivo === 'ED') {
                        return jugador.position === 'ED' || jugador.position === 'EI' || jugador.position === 'MD';
                    } else if (posicionObjetivo.startsWith('DEL')) {
                        return jugador.position.startsWith('DEL');
                    }
                    return false;
                });

                console.log(`Pick ${currentPick}: Opciones filtradas para ${posicionObjetivo}:`, opcionesFiltradas.length);

                const numOpciones = Math.min(5, opcionesFiltradas.length);
                const opcionesAleatorias = [];
                const indicesUsados = new Set();

                while (opcionesAleatorias.length < numOpciones && opcionesFiltradas.length > 0) {
                    const randomIndex = Math.floor(Math.random() * opcionesFiltradas.length);
                    const jugadorElegido = opcionesFiltradas[randomIndex];
                    if (!indicesUsados.has(jugadorElegido.id)) {
                        opcionesAleatorias.push(jugadorElegido);
                        indicesUsados.add(jugadorElegido.id);
                    }
                    if (indicesUsados.size === opcionesFiltradas.length) break;
                }
                setOpcionesPick(opcionesAleatorias);

            } else if (currentPick > totalPicks) {
                console.log(`Pick ${currentPick}: Eligiendo suplente/reserva, mostrando opciones sin filtro.`);
                const numOpciones = Math.min(5, remainingPlayers.length);
                const opcionesAleatorias = [];
                const indicesUsados = new Set();
                while (opcionesAleatorias.length < numOpciones && remainingPlayers.length > 0) {
                    const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
                    const jugadorElegido = remainingPlayers[randomIndex];
                    if (!indicesUsados.has(jugadorElegido.id)) {
                        opcionesAleatorias.push(jugadorElegido);
                        indicesUsados.add(jugadorElegido.id);
                    }
                    if (indicesUsados.size === remainingPlayers.length) break;
                }
                setOpcionesPick(opcionesAleatorias);
            }
        } else {
            setIsDrafting(false);
        }
    };

    const elegirJugador = (jugadorElegido) => {
        setOpcionesPick([]);
        if (currentPick <= totalPicks) {
            asignarJugadorAPosicion(jugadorElegido);
        } else if (suplentes.length < totalSuplentes) {
            asignarSuplente(jugadorElegido);
        } else if (reservas.length < totalReservas) {
            asignarReserva(jugadorElegido);
        }
    };

    const asignarJugadorAPosicion = (jugador) => {
        if (formacionSeleccionada && currentPick <= totalPicks) {
            const posicionObjetivo = formacionSeleccionada.posiciones[currentPick - 1];
            if (!formacionActual[posicionObjetivo]) {
                setFormacionActual(prevFormacion => ({ ...prevFormacion, [posicionObjetivo]: jugador }));
                setDraftedPlayers(prevDrafted => [...prevDrafted, jugador]);
                setRemainingPlayers(prevRemaining => prevRemaining.filter(j => j.id !== jugador.id));
                setCurrentPick(prevPick => prevPick + 1);
            }
        }
    };

    const asignarSuplente = (jugador) => {
        if (suplentes.length < totalSuplentes) {
            setSuplentes(prevSuplentes => [...prevSuplentes, jugador]);
            setDraftedPlayers(prevDrafted => [...prevDrafted, jugador]);
            setRemainingPlayers(prevRemaining => prevRemaining.filter(j => j.id !== jugador.id));
            setCurrentPick(prevPick => prevPick + 1);
        }
    };

    const asignarReserva = (jugador) => {
        if (reservas.length < totalReservas) {
            setReservas(prevReservas => [...prevReservas, jugador]);
            setDraftedPlayers(prevDrafted => [...prevDrafted, jugador]);
            setRemainingPlayers(prevRemaining => prevRemaining.filter(j => j.id !== jugador.id));
            setCurrentPick(prevPick => prevPick + 1);
        }
    };

    const obtenerPosicionesCompatibles = (posicionPrincipal) => {
        switch (posicionPrincipal) {
            case 'GK': return ['GK'];
            case 'LI': return ['LI', 'LD', 'DFC_L', 'DFC_R'];
            case 'LD': return ['LD', 'LI', 'DFC_L', 'DFC_R'];
            case 'DFC_L': return ['DFC_L', 'DFC_R', 'LI', 'LD', 'MCD'];
            case 'DFC_R': return ['DFC_R', 'DFC_L', 'LI', 'LD', 'MCD'];
            case 'MCD': return ['MCD', 'MC_L', 'MC_C', 'MC_R', 'DFC_L', 'DFC_R'];
            case 'MC_L': return ['MC_L', 'MC_C', 'MC_R', 'MCO_C', 'MI', 'MCD'];
            case 'MC_C': return ['MC_C', 'MC_L', 'MC_R', 'MCO_C', 'MCD'];
            case 'MC_R': return ['MC_R', 'MC_C', 'MC_L', 'MCO_C', 'MD', 'MCD'];
            case 'EI': return ['EI', 'ED', 'MI'];
            case 'ED': return ['ED', 'EI', 'MD'];
            case 'DEL_C': return ['DEL_C'];
            default: return [posicionPrincipal];
        }
    };

    const iniciarIntercambio = (jugador) => {
        setMensajeErrorIntercambio('');
        if (jugadorSeleccionadoIntercambio && jugadorSeleccionadoIntercambio.ubicacion === 'titular') {
            // Intercambio entre titulares
            if (obtenerPosicionesCompatibles(jugadorSeleccionadoIntercambio.posicionEnFormacion).includes(formacionActual[jugador.posicionEnFormacion]?.position)) {
                const nuevoFormacionActual = { ...formacionActual };
                const jugadorASustituir = nuevoFormacionActual[jugador.posicionEnFormacion];
                nuevoFormacionActual[jugador.posicionEnFormacion] = jugadorSeleccionadoIntercambio.jugador;
                const nuevoFormacionActualConOriginal = { ...nuevoFormacionActual, [jugadorSeleccionadoIntercambio.posicionEnFormacion]: jugadorASustituir };
                setFormacionActual(nuevoFormacionActualConOriginal);
                setJugadorSeleccionadoIntercambio(null);
            } else {
                setMensajeErrorIntercambio('Las posiciones no son compatibles para el intercambio.');
            }
        } else if (jugadorSeleccionadoIntercambio && jugadorSeleccionadoIntercambio.ubicacion === 'banco') {
            // Intercambio de un jugador del banco por un titular
            const posicionTitular = jugador.posicionEnFormacion;
            const jugadorTitular = formacionActual[posicionTitular];
            const jugadorBanco = jugadorSeleccionadoIntercambio.jugador;

            if (obtenerPosicionesCompatibles(posicionTitular).includes(jugadorBanco.position)) {
                const nuevoFormacionActual = { ...formacionActual, [posicionTitular]: jugadorBanco };
                setFormacionActual(nuevoFormacionActual);

                if (jugadorSeleccionadoIntercambio.tipo === 'suplente') {
                    const nuevosSuplentes = suplentes.map(s => (s.id === jugadorBanco.id ? jugadorTitular : s));
                    setSuplentes(nuevosSuplentes);
                } else if (jugadorSeleccionadoIntercambio.tipo === 'reserva') {
                    const nuevasReservas = reservas.map(r => (r.id === jugadorBanco.id ? jugadorTitular : r));
                    setReservas(nuevasReservas);
                }
                setJugadorSeleccionadoIntercambio(null);
            } else {
                setMensajeErrorIntercambio('La posición del jugador del banco no es compatible con la posición del titular.');
            }
        } else {
            setJugadorSeleccionadoIntercambio({ jugador, posicionEnFormacion: jugador.posicionEnFormacion, ubicacion: 'titular' });
        }
    };

    const iniciarIntercambioBanco = (jugador, tipo) => {
        setMensajeErrorIntercambio('');
        if (jugadorSeleccionadoIntercambio && jugadorSeleccionadoIntercambio.ubicacion === 'titular') {
            const posicionTitular = jugadorSeleccionadoIntercambio.posicionEnFormacion;
            const jugadorTitular = formacionActual[posicionTitular];

            if (obtenerPosicionesCompatibles(posicionTitular).includes(jugador.position)) {
                const nuevoFormacionActual = { ...formacionActual, [posicionTitular]: jugador };
                setFormacionActual(nuevoFormacionActual);

                if (tipo === 'suplente') {
                    const nuevosSuplentes = suplentes.map(s => (s.id === jugador.id ? jugadorTitular : s));
                    setSuplentes(nuevosSuplentes);
                } else if (tipo === 'reserva') {
                    const nuevasReservas = reservas.map(r => (r.id === jugador.id ? jugadorTitular : r));
                    setReservas(nuevasReservas);
                }
                setJugadorSeleccionadoIntercambio(null);
            } else {
                setMensajeErrorIntercambio('La posición del jugador del banco no es compatible con la posición del titular.');
            }
        } else {
            setJugadorSeleccionadoIntercambio({ jugador, tipo, ubicacion: 'banco' });
        }
    };

    const renderOpcionPick = ({ item }) => (
        <TouchableOpacity style={styles.opcionCarta} onPress={() => elegirJugador(item)}>
            {/* Usa playerImages[item.imageUri] y un fallback */}
            <Image source={playerImages[item.imageUri] || genericImages.placeholder_player} style={styles.imagenCarta} />
            <Text style={styles.nombreCarta}>{item.name}</Text>
            <Text style={styles.posicionCarta}>{item.position}</Text>
            <Text style={styles.ratingCarta}>{item.rating}</Text>
        </TouchableOpacity>
    );

    const renderPosicionCampo = (posicion) => {
        if (!posicionesMapa[posicion]) return null;
        const jugadorEnPosicion = formacionActual[posicion];
        const style = getPositionStyle(posicion);
        return (
            <TouchableOpacity
                key={posicion}
                style={[style, styles.posicionCampo, jugadorSeleccionadoIntercambio?.ubicacion === 'titular' && jugadorSeleccionadoIntercambio?.posicionEnFormacion === posicion ? styles.seleccionadoParaIntercambio : null]}
                onPress={() => jugadorEnPosicion && Object.keys(formacionActual).length === totalPicks && (suplentes.length + reservas.length === totalSuplentes + totalReservas) ? iniciarIntercambio({ ...jugadorEnPosicion, posicionEnFormacion: posicion }) : null}
            >
                {jugadorEnPosicion && (
                    <View style={styles.jugadorEnCampo}>
                        {/* Usa playerImages[jugadorEnPosicion.imageUri] y un fallback */}
                        <Image source={playerImages[jugadorEnPosicion.imageUri] || genericImages.placeholder_player} style={styles.imagenJugadorCampoGrande} />
                    </View>
                )}
                {!jugadorEnPosicion && formacionSeleccionada?.posiciones?.includes(posicion) && (
                    <Text style={styles.textoPosicion}>{posicionesMapa[posicion]?.nombre}</Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderSuplente = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.cartaSuplente, jugadorSeleccionadoIntercambio?.ubicacion === 'banco' && jugadorSeleccionadoIntercambio?.jugador?.id === item.id ? styles.seleccionadoParaIntercambioBanco : null]}
            onPress={() => Object.keys(formacionActual).length === totalPicks && (suplentes.length + reservas.length === totalSuplentes + totalReservas) ? iniciarIntercambioBanco(item, 'suplente') : null}
        >
            {/* Usa playerImages[item.imageUri] y un fallback */}
            <Image source={playerImages[item.imageUri] || genericImages.placeholder_player} style={styles.imagenSuplente} />
            <Text style={styles.nombreSuplente}>{item.name}</Text>
            <Text style={styles.posicionSuplente}>{item.position}</Text>
            <Text style={styles.ratingSuplente}>{item.rating}</Text>
        </TouchableOpacity>
    );

    const renderReserva = ({ item }) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.cartaReserva, jugadorSeleccionadoIntercambio?.ubicacion === 'banco' && jugadorSeleccionadoIntercambio?.jugador?.id === item.id ? styles.seleccionadoParaIntercambioBanco : null]}
            onPress={() => Object.keys(formacionActual).length === totalPicks && (suplentes.length + reservas.length === totalSuplentes + totalReservas) ? iniciarIntercambioBanco(item, 'reserva') : null}
        >
            {/* Usa playerImages[item.imageUri] y un fallback */}
            <Image source={playerImages[item.imageUri] || genericImages.placeholder_player} style={styles.imagenReserva} />
            <Text style={styles.nombreReserva}>{item.name}</Text>
            <Text style={styles.posicionReserva}>{item.position}</Text>
            <Text style={styles.ratingReserva}>{item.rating}</Text>
        </TouchableOpacity>
    );

    const getPositionStyle = (position) => {
        const baseStyle = {
            position: 'absolute',
            width: posicionesMapa[position]?.size || 40,
            height: posicionesMapa[position]?.size || 40,
            borderRadius: (posicionesMapa[position]?.size || 40) / 2,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        };
        const layoutStyle = {
            top: posicionesMapa[position]?.top || '0%',
            left: posicionesMapa[position]?.left || '0%',
            zIndex: posicionesMapa[position]?.zIndex || 1,
        };
        return [baseStyle, layoutStyle];
    };

    const calcularGRLActual = () => {
        let totalRating = 0;
        let numJugadores = 0;
        for (const posicion in formacionActual) {
            if (formacionActual[posicion]) {
                totalRating += formacionActual[posicion].rating;
                numJugadores++;
            }
        }
        return numJugadores > 0 ? Math.round(totalRating / numJugadores) : 0;
    };

    const calcularRatingGeneral = () => {
        let totalRating = 0;
        let numJugadores = 0;
        for (const posicion in formacionActual) {
            if (formacionActual[posicion]) {
                totalRating += formacionActual[posicion].rating;
                numJugadores++;
            }
        }
        setRatingGeneral(numJugadores > 0 ? Math.round(totalRating / numJugadores) : 0);
    };

    const seleccionarFormacion = (formacion) => {
        setFormacionSeleccionada(formacion);
    };

    const renderFormacionOpcion = ({ item }) => (
        <TouchableOpacity style={styles.formacionOpcion} onPress={() => seleccionarFormacion(item)}>
            <Text style={styles.nombreFormacion}>{item.nombre}</Text>
            <Text style={styles.posicionesFormacion}>{item.posiciones.join('-')}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={require('../assets/football_pitch.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.header}>Draft de Íconos</Text>

                {/* Modal de Mensaje Beta */}
                <Modal
                    visible={isBetaModalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setIsBetaModalVisible(false)}
                >
                    <View style={styles.betaModalContainer}>
                        <View style={styles.betaModalContent}>
                            <Text style={styles.betaModalTitle}>¡Bienvenido al Draft Beta! 🎉</Text>
                            <Text style={styles.betaModalMessage}>{DRAFT_BETA_MESSAGE}</Text>
                            <TouchableOpacity
                                style={styles.betaModalButton}
                                onPress={() => setIsBetaModalVisible(false)}
                            >
                                <Text style={styles.betaModalButtonText}>Entendido</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {!formacionSeleccionada ? (
                    <View style={styles.seleccionFormacionContainer}>
                        <Text style={styles.tituloSeleccionFormacion}>Elige tu formación</Text>
                        <FlatList
                            data={formacionesData}
                            keyExtractor={(item) => item.id}
                            renderItem={renderFormacionOpcion}
                        />
                        <Text style={styles.proximamente}>Próximamente más formaciones</Text>
                    </View>
                ) : !isDrafting ? (
                    <TouchableOpacity style={styles.startButton} onPress={iniciarDraft}>
                        <Text style={styles.startButtonText}>Iniciar Draft</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.draftInfo}>
                        <Text style={styles.draftingText}>Pick: {currentPick} / {totalPicks + totalSuplentes + totalReservas}</Text>
                        {Object.keys(formacionActual).length > 0 && (
                            <Text style={styles.grlEnProgreso}>GRL: {calcularGRLActual()}</Text>
                        )}
                        {opcionesPick.length > 0 && (
                            <FlatList
                                data={opcionesPick}
                                keyExtractor={(item) => item.id}
                                renderItem={renderOpcionPick}
                                horizontal
                                style={styles.listaOpciones}
                            />
                        )}
                        {opcionesPick.length === 0 && currentPick <= totalPicks + totalSuplentes + totalReservas && (
                            <Text style={styles.esperandoPick}>Esperando opciones de pick...</Text>
                        )}
                    </View>
                )}
                {formacionSeleccionada && (
                    <View style={styles.pitchContainer}>
                        {Object.keys(posicionesMapa).map(renderPosicionCampo)}
                    </View>
                )}

                <View style={styles.bancoContainer}>
                    <View style={styles.suplentesContainer}>
                        <Text style={styles.tituloSuplentes}>Suplentes ({suplentes.length} / {totalSuplentes})</Text>
                        <FlatList
                            data={suplentes}
                            keyExtractor={(item) => item.id}
                            renderItem={renderSuplente}
                            horizontal
                        />
                    </View>

                    <View style={styles.reservasContainer}>
                        <Text style={styles.tituloReservas}>Reservas ({reservas.length} / {totalReservas})</Text>
                        <FlatList
                            data={reservas}
                            keyExtractor={(item) => item.id}
                            renderItem={renderReserva}
                            horizontal
                        />
                    </View>
                </View>

                {Object.keys(formacionActual).length === totalPicks && (
                    <View style={styles.finalActions}>
                        <Text style={styles.ratingGeneral}>GRL del Equipo: {ratingGeneral}</Text>
                        {mensajeErrorIntercambio && <Text style={styles.errorIntercambio}>{mensajeErrorIntercambio}</Text>}
                        {jugadorSeleccionadoIntercambio && <Text style={styles.instruccionIntercambio}>Selecciona otro jugador para intercambiar.</Text>}
                    </View>
                )}

                {/* Botón para salir del Draft */}
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => navigation.navigate('MiniGamesScreen')} // Asegúrate de que 'MiniGamesScreen' sea el nombre correcto de tu ruta
                >
                    <Text style={styles.exitButtonText}>Salir del Draft</Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    seleccionFormacionContainer: {
        alignItems: 'center',
    },
    tituloSeleccionFormacion: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    formacionOpcion: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        width: 250,
        alignItems: 'center',
    },
    nombreFormacion: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    posicionesFormacion: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    draftInfo: {
        alignItems: 'center',
        marginBottom: 10,
    },
    draftingText: {
        color: 'yellow',
        fontSize: 18,
        marginBottom: 5,
    },
    esperandoPick: {
        color: 'white',
        fontSize: 16,
        marginTop: 5,
    },
    pitchContainer: {
        width: '90%',
        height: '50%',
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    posicionCampo: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)', // Fondo semitransparente para las posiciones vacías
    },
    textoPosicion: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    opcionCarta: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        width: 100,
    },
    imagenCarta: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 4,
    },
    nombreCarta: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    posicionCarta: {
        fontSize: 12,
        color: 'gray',
    },
    ratingCarta: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
    },
    listaOpciones: {
        marginTop: 10,
    },
    bancoContainer: {
        marginTop: 20,
        width: '95%',
    },
    suplentesContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    tituloSuplentes: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cartaSuplente: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 8,
        padding: 8,
        marginHorizontal: 5,
        alignItems: 'center',
        width: 80,
    },
    imagenSuplente: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 4,
    },
    nombreSuplente: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 3,
        textAlign: 'center',
    },
    posicionSuplente: {
        fontSize: 10,
        color: 'gray',
    },
    ratingSuplente: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
    },
    grlEnProgreso: {
        color: 'lime',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    reservasContainer: {
        alignItems: 'center',
    },
    tituloReservas: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cartaReserva: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 8,
        padding: 8,
        marginHorizontal: 5,
        alignItems: 'center',
        width: 80,
    },
    imagenReserva: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 4,
    },
    nombreReserva: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 3,
        textAlign: 'center',
    },
    posicionReserva: {
        fontSize: 10,
        color: 'gray',
    },
    ratingReserva: {
        fontSize: 14,
        color: 'orange',
        fontWeight: 'bold',
    },
    ratingGeneral: {
        color: 'gold',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    finalActions: {
        alignItems: 'center',
        marginTop: 20,
    },
    proximamente: {
        color: 'white',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    },
    jugadorEnCampo: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    imagenJugadorCampoGrande: { // Nuevo estilo para la imagen del jugador en el campo
        width: '85%', // Ajusta el tamaño según sea necesario
        height: '85%', // Ajusta el tamaño según sea necesario
        resizeMode: 'contain',
        borderRadius: 4,
    },
    seleccionadoParaIntercambio: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    seleccionadoParaIntercambioBanco: {
        borderWidth: 2,
        borderColor: 'blue',
    },
    errorIntercambio: {
        color: 'red',
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    instruccionIntercambio: {
        color: 'lightblue',
        marginTop: 10,
        textAlign: 'center',
    },
    // Estilos para el Modal Beta
    betaModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    betaModalContent: {
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD700', // Dorado para destacar que es beta
    },
    betaModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 15,
        textAlign: 'center',
    },
    betaModalMessage: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    betaModalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    betaModalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Estilos para el botón de salir
    exitButton: {
        backgroundColor: '#dc3545', // Rojo para el botón de salir
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20, // Espacio para separarlo de otros elementos
        alignSelf: 'center',
    },
    exitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default FutDraftScreen;