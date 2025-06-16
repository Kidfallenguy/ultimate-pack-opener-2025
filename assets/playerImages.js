// /assets/playerImages.js

// Este archivo centraliza las importaciones de imágenes de jugadores locales
// para usarlas dinámicamente en la aplicación.

// --- BANNERS ESPECÍFICOS DE SBCS ---
const REIJNDERS_SBC_BANNER = require('./imagecartas/SBC/reijnders_potm_sbc.png');
const MASTANTUONO_SBC_BANNER = require('./imagecartas/SBC/mastantuono_potm_91.png');
const HARRY_KANE_SBC_BANNER = require('./imagecartas/SBC/harry_kane_potm_92.png');
const DEMBELE_SBC_BANNER = require('./imagecartas/SBC/demebele_potm_91.png');
const ANTONY_SBC_BANNER = require('./imagecartas/SBC/antony_potm_90.png');
const RAPHINHA_SBC_BANNER = require('./imagecartas/SBC/raphinha_potm_92.png');
const SALAH_SBC_BANNER = require('./imagecartas/SBC/salah_potm_92.png');
// ... Asegúrate de añadir una línea 'const NOMBRE = require(...)' para cada banner de SBC que tengas.

// --- IMÁGENES DE JUGADORES (para playerImages) ---
const REIJNDERS_PLAYER_IMAGE = require('./imagecartas/SBC/reijnders_potm_sbc.png');
const MASTANTUONO_PLAYER_IMAGE = require('./imagecartas/SBC/mastantuono_potm_91.png');
const HARRY_KANE_PLAYER_IMAGE = require('./imagecartas/SBC/harry_kane_potm_92.png');
const DEMBELE_PLAYER_IMAGE = require('./imagecartas/SBC/demebele_potm_91.png');
const ANTONY_PLAYER_IMAGE = require('./imagecartas/SBC/antony_potm_90.png');
const RAPHINHA_PLAYER_IMAGE = require('./imagecartas/SBC/raphinha_potm_92.png');
const SALAH_PLAYER_IMAGE = require('./imagecartas/SBC/salah_potm_92.png');
// ... Asegúrate de añadir una línea 'const NOMBRE = require(...)' para cada imagen de jugador que uses.


// En tu archivo /assets/playerImages.js
export const SBC_BANNER_IMAGES_MAP = {
    'reijnders_potm_91_sbc.png': REIJNDERS_SBC_BANNER,
    'mastantuono_potm_91_sbc.png': MASTANTUONO_SBC_BANNER,
    'harry_kane_potm_92_sbc.png': HARRY_KANE_SBC_BANNER,
    'dembele_potm_91_sbc.png': DEMBELE_SBC_BANNER,
    'antony_potm_90_sbc.png': ANTONY_SBC_BANNER,
    'raphinha_potm_92_sbc.png': RAPHINHA_SBC_BANNER,
    'salah_potm_92_sbc.png': SALAH_SBC_BANNER,
    // ... añade más entradas para otros SBCs que tengas
};

export const genericImages = {
    // *** REVISA ESTA LÍNEA CUIDADOSAMENTE ***
    'placeholder_player': require('./placeholder_player.png'), // <-- ¡Revisa lo que hay aquí dentro!
    // ...
};
// ... el resto del archivo ...
export const playerImages = {
  // --- Porteros Icono (basado en la lista proporcionada) ---
  // Usa el ID del jugador (clave) y require() con la ruta relativa a este archivo (valor)
  'neuer-94': require('./imagecartas/ICONS/neuer-94.png'),
  'casillas-93': require('./imagecartas/ICONS/casillas-93.png'),
  'yashin-92': require('./imagecartas/ICONS/yashin-92.png'),
  'buffon-92': require('./imagecartas/ICONS/buffon-92.png'),
  'van-der-sar-90': require('./imagecartas/ICONS/van-der-sar-90.png'),
  'oliver-kahn-90': require('./imagecartas/ICONS/oliver-kahn-90.png'),
  'victor-valdes-89': require('./imagecartas/ICONS/victor-valdes-89.png'),
  'dida-89': require('./imagecartas/ICONS/dida-89.png'),
  'fillol-88': require('./imagecartas/ICONS/fillol-88.png'),
  'schmeichel-88': require('./imagecartas/ICONS/schmeichel-88.png'),
  'bravo-88': require('./imagecartas/ICONS/bravo-88.png'),
  'cech-88': require('./imagecartas/ICONS/cech-88.png'),
  'chilavert-87': require('./imagecartas/ICONS/chilavert-87.png'),
  'banks-87': require('./imagecartas/ICONS/banks-87.png'),
  'dino-zoff-87': require('./imagecartas/ICONS/dino-zoff-87.png'),
  'higuita-87': require('./imagecartas/ICONS/higuita-87.png'),
  'preudhomme-87': require('./imagecartas/ICONS/preud-homme-87.png'),
  'seaman-87': require('./imagecartas/ICONS/seaman-87.png'),
 'maldini-94': require('./imagecartas/ICONS/maldini-94.png'),
  'beckenbauer-94': require('./imagecartas/ICONS/beckenbauer-94.png'),
  'ramos-93': require('./imagecartas/ICONS/ramos-93.png'),
  'pepe-92': require('./imagecartas/ICONS/pepe-92.png'),
  'passarella-92': require('./imagecartas/ICONS/passarella-92.png'),
  'figueroa-92': require('./imagecartas/ICONS/figueroa-92.png'),
  'baresi-91': require('./imagecartas/ICONS/baresi-91.png'),
  'pique-90': require('./imagecartas/ICONS/pique-90.png'),
  'puyol-90': require('./imagecartas/ICONS/puyol-90.png'),
  'blanc-90': require('./imagecartas/ICONS/blanc-90.png'),
  'lucio-90': require('./imagecartas/ICONS/lucio-90.png'),
  'nesta-89': require('./imagecartas/ICONS/nesta-89.png'),
  'varane-89': require('./imagecartas/ICONS/varane-89.png'),
  'cannavaro-89': require('./imagecartas/ICONS/cannavaro-89.png'),
  'cesare-maldini-89': require('./imagecartas/ICONS/cesare-maldini-89.png'),
  'ferdinand-89': require('./imagecartas/ICONS/ferdinand-89.png'),
  'nasazzi-89': require('./imagecartas/ICONS/nasazzi-89.png'),
  'thiago-silva-89': require('./imagecartas/ICONS/thiago-silva-89.png'),
  'sammer-89': require('./imagecartas/ICONS/sammer-89.png'),
  'moore-89': require('./imagecartas/ICONS/moore-89.png'),
  'koeman-88': require('./imagecartas/ICONS/koeman-88.png'),
  'vidic-88': require('./imagecartas/ICONS/vidic-88.png'),
  'costacurta-88': require('./imagecartas/ICONS/costacurta-88.png'),
  'desailly-88': require('./imagecartas/ICONS/desailly-88.png'),
  'fernando-hierro-88': require('./imagecartas/ICONS/fernando-hierro-88.png'),
  'campbell-88': require('./imagecartas/ICONS/campbell-88.png'),
  'roberto-carlos-93': require('./imagecartas/ICONS/roberto-carlos-93.png'),
  'marcelo-92': require('./imagecartas/ICONS/marcelo-92.png'),
  'nilton-santos-91': require('./imagecartas/ICONS/nilton-santos-91.png'),
  'jordi-alba-90': require('./imagecartas/ICONS/jordi-alba-90.png'),
  'brehme-89': require('./imagecartas/ICONS/brehme-89.png'),
  'facchetti-90': require('./imagecartas/ICONS/facchetti-90.png'), // Nota: El GRL en tus datos es 90 aquí, ajustado en require si es necesario.
  'cole-87': require('./imagecartas/ICONS/cole-87.png'),
  'evra-86': require('./imagecartas/ICONS/evra-86.png'),
  'cafu-93': require('./imagecartas/ICONS/cafu-93.png'),
  'dani-alves-92': require('./imagecartas/ICONS/dani-alves-92.png'),
  'zanetti-91': require('./imagecartas/ICONS/zanetti-91.png'),
  'carlos-alberto-91': require('./imagecartas/ICONS/carlos-alberto-91.png'),
  'lahm-90': require('./imagecartas/ICONS/lahm-90.png'),
  'thuram-90': require('./imagecartas/ICONS/thuram-90.png'),
  'djalma-santos-90': require('./imagecartas/ICONS/djalma-santos-90.png'),
  'zambrotta-89': require('./imagecartas/ICONS/zambrotta-89.png'),
  'bergomi-88': require('./imagecartas/ICONS/bergomi-88.png'),
  'gary-neville-88': require('./imagecartas/ICONS/gary-neville-88.png'),
  'busquets-92': require('./imagecartas/ICONS/busquets-92.png'),
  'casemiro-92': require('./imagecartas/ICONS/casemiro-92.png'),
  'vieira-91': require('./imagecartas/ICONS/vieira-91.png'),
  'pirlo-91': require('./imagecartas/ICONS/pirlo-91.png'),
  'rijkaard-90': require('./imagecartas/ICONS/rijkaard-90.png'), // Corregido 'rikjard' a 'rijkaard'
  'toure-90': require('./imagecartas/ICONS/toure-90.png'),
  'vidal-90': require('./imagecartas/ICONS/vidal-90.png'),
  'matthaus-90': require('./imagecartas/ICONS/matthaus-90.png'),
  'xabi-alonso-90': require('./imagecartas/ICONS/xabi-alonso-90.png'),
  'keane-89': require('./imagecartas/ICONS/keane-89.png'),
  'didi-90': require('./imagecartas/ICONS/didi-90.png'),
  'guardiola-90': require('./imagecartas/ICONS/guardiola-90.png'),
  'redondo-89': require('./imagecartas/ICONS/redondo-89.png'),
  'petit-89': require('./imagecartas/ICONS/petit-89.png'),
  'cambiasso-89': require('./imagecartas/ICONS/cambiasso-89.png'),
  'totti-89': require('./imagecartas/ICONS/totti-89.png'),
  'gerson-89': require('./imagecartas/ICONS/gerson-89.png'),
  'gattuso-89': require('./imagecartas/ICONS/gattuso-89.png'),
  'davids-88': require('./imagecartas/ICONS/davids-88.png'),
  'makelele-88': require('./imagecartas/ICONS/makelele-88.png'), // Corregido 'Makelele' a 'makelele' para consistencia de ID
  'essien-88': require('./imagecartas/ICONS/essien-88.png'),
  'xavi-hernandez-94': require('./imagecartas/ICONS/xavi-hernandez-94.png'),
  'iniesta-94': require('./imagecartas/ICONS/iniesta-94.png'),
  'gullit-92': require('./imagecartas/ICONS/gullit-92.png'),
  'kroos-93': require('./imagecartas/ICONS/kroos-93.png'),
  'luis-suarez-esp-92': require('./imagecartas/ICONS/luis-suarez-esp-92.png'),
  'ballack-89': require('./imagecartas/ICONS/ballack-89.png'),
  'lampard-89': require('./imagecartas/ICONS/lampard-89.png'),
  'gerrard-89': require('./imagecartas/ICONS/gerrard-89.png'),
  'ancelloti-89': require('./imagecartas/ICONS/ancelloti-89.png'), // Usando el ID proporcionado
  'beckham-89': require('./imagecartas/ICONS/beckham-89.png'),
  'seedorf-89': require('./imagecartas/ICONS/seedorf-89.png'),
  'david-silva-87': require('./imagecartas/ICONS/david-silva-87.png'),
  'schweinsteiger-88': require('./imagecartas/ICONS/schweinsteiger-88.png'),
  'aimar-88': require('./imagecartas/ICONS/aimar-88.png'),
  'fabregas-88': require('./imagecartas/ICONS/fabregas-88.png'),
  'sneijder-88': require('./imagecartas/ICONS/sneijder-88.png'),
  'scholes-88': require('./imagecartas/ICONS/scholes-88.png'),
  'veron-88': require('./imagecartas/ICONS/veron-88.png'),
  'maradona-95': require('./imagecartas/ICONS/maradona-95.png'),
  'pele-95': require('./imagecartas/ICONS/pele-95.png'),
  'cruyff-94': require('./imagecartas/ICONS/cruyff-94.png'),
  'platini-94': require('./imagecartas/ICONS/platini-94.png'),
  'charlton-91': require('./imagecartas/ICONS/charlton-91.png'),
  'zico-91': require('./imagecartas/ICONS/zico-91.png'),
  'kaka-91': require('./imagecartas/ICONS/kaka-91.png'),
  'francescoli-90': require('./imagecartas/ICONS/francescoli-90.png'),
  'baggio-90': require('./imagecartas/ICONS/baggio-90.png'),
  'scarone-90': require('./imagecartas/ICONS/scarone-90.png'),
  'del-piero-90': require('./imagecartas/ICONS/del-piero-90.png'),
  'riquelme-90': require('./imagecartas/ICONS/riquelme-90.png'),
  'rivera-90': require('./imagecartas/ICONS/rivera-90.png'),
  'ozil-89': require('./imagecartas/ICONS/ozil-89.png'),
  'valderrama-89': require('./imagecartas/ICONS/valderrama-89.png'),
  'sivori-89': require('./imagecartas/ICONS/sivori-89.png'),
  'socrates-89': require('./imagecartas/ICONS/socrates-89.png'),
  'boniek-88': require('./imagecartas/ICONS/boniek-88.png'),
  'magico-gonzalez-88': require('./imagecartas/ICONS/magico-gonzalez-88.png'),
  'zidane-91': require('./imagecartas/ICONS/zidane.png'), // Usa la imageUri proporcionada
  'laudrup-88': require('./imagecartas/ICONS/laudrup-88.png'),
  'zola-88': require('./imagecartas/ICONS/zola-88.png'),
  'hagi-88': require('./imagecartas/ICONS/hagi-88.png'),
  // --- Mediocampistas Izquierdos Icono ---
  'ribery-90': require('./imagecartas/ICONS/ribery-90.png'),
  'netzer-90': require('./imagecartas/ICONS/netzer-90.png'),
  'giggs-89': require('./imagecartas/ICONS/giggs-89.png'),
  'effenberg-89': require('./imagecartas/ICONS/effenberg-89.png'),
  'nedved-89': require('./imagecartas/ICONS/nedved-89.png'),
  'pires-88': require('./imagecartas/ICONS/pires-88.png'),

  // --- Mediocampistas Derechos Icono ---
  'robben-90': require('./imagecartas/ICONS/robben-90.png'),
  'bergkamp-89': require('./imagecartas/ICONS/bergkamp-89.png'),
  'sastre-89': require('./imagecartas/ICONS/sastre-89.png'),
  'souness-89': require('./imagecartas/ICONS/souness-89.png'),
  'roberto-rivelino-89': require('./imagecartas/ICONS/roberto-rivelino-89.png'),
  'okocha-88': require('./imagecartas/ICONS/okocha-88.png'),
  // --- Extremos Izquierdos Icono ---
  'ronaldinho-93': require('./imagecartas/ICONS/ronaldhino-93.png'), 
  'thierry-henry-92': require('./imagecartas/ICONS/thierry-henry-92.png'),
  'rivaldo-90': require('./imagecartas/ICONS/rivaldo-90.png'),
  'paco-gento-91': require('./imagecartas/ICONS/paco-gento-91.png'),
  'stoichkov-89': require('./imagecartas/ICONS/stoichkov-89.png'),
  'hoeness-88': require('./imagecartas/ICONS/hoeness-88.png'),
  'barnes-88': require('./imagecartas/ICONS/barnes-88.png'),

  // --- Extremos Derechos Icono ---
  'garrincha-92': require('./imagecartas/ICONS/garrincha-92.png'),
  'di-maria-91': require('./imagecartas/ICONS/di-maria-91.png'),
  'meazza-91': require('./imagecartas/ICONS/meazza-91.png'),
  'best-90': require('./imagecartas/ICONS/best-90.png'),
  'gareth-bale-92': require('./imagecartas/ICONS/gareth-bale-92.png'),
  'jairzinho-89': require('./imagecartas/ICONS/jairzinho-89.png'),
  'luis-figo-89': require('./imagecartas/ICONS/luis-figo-89.png'),
  'kopa-89': require('./imagecartas/ICONS/kopa-89.png'),
  // ... etc. Asegúrate de usar el ID correcto del jugador como clave
// --- Delanteros Icono ---
  'ronaldo-nazario-94': require('./imagecartas/ICONS/ronaldo-nazario-94.png'),
  'di-stefano-94': require('./imagecartas/ICONS/di-stefano-94.png'),
  'van-basten-93': require('./imagecartas/ICONS/van-basten-93.png'),
  'puskas-92': require('./imagecartas/ICONS/puskas-92.png'),
  'eusebio-91': require('./imagecartas/ICONS/eusebio-91.png'),
  'kempes-91': require('./imagecartas/ICONS/kempes-91.png'),
  'muller-92': require('./imagecartas/ICONS/muller-92.png'),
  'ibrahimovic-91': require('./imagecartas/ICONS/ibrahimovic-91.png'),
  'aguero-90': require('./imagecartas/ICONS/aguero-90.png'),
  'denis-law-89': require('./imagecartas/ICONS/denis-law-89.png'),
  'batistuta-90': require('./imagecartas/ICONS/batistuta-90.png'),
  'raul-90': require('./imagecartas/ICONS/raul-90.png'),
  'benzema-90': require('./imagecartas/ICONS/benzema-90.png'),
  'etoo-90': require('./imagecartas/ICONS/etoo-90.png'),
  'romario-90': require('./imagecartas/ICONS/romario-90.png'),
  'dalglish-90': require('./imagecartas/ICONS/dalglish-90.png'),
  'papin-89': require('./imagecartas/ICONS/papin-89.png'),
  'voller-88': require('./imagecartas/ICONS/voller-88.png'),
  'drogba-90': require('./imagecartas/ICONS/drogba-90.png'),
  'van-nistelrooy-89': require('./imagecartas/ICONS/van-nistelrooy-89.png'),
  'schevchenko-89': require('./imagecartas/ICONS/schevchenko-89.png'), // Corregido 'schevchenko' a 'shevchenko' si el archivo coincide con el nombre del jugador
  'inzaghi-89': require('./imagecartas/ICONS/inzaghi-89.png'),
  'weah-89': require('./imagecartas/ICONS/weah-89.png'),
  'villa-89': require('./imagecartas/ICONS/villa-89.png'),
  'bican-89': require('./imagecartas/ICONS/bican-89.png'),
  'hugo-sanchez-89': require('./imagecartas/ICONS/hugo-sanchez-89.png'),
  'lineker-89': require('./imagecartas/ICONS/lineker-89.png'),
  'cantona-89': require('./imagecartas/ICONS/cantona-89.png'),
  'butragueno-88': require('./imagecartas/ICONS/butragueno-88.png'),
  'milla-88': require('./imagecartas/ICONS/milla-88.png'),
  'owen-88': require('./imagecartas/ICONS/owen-88.png'),
  'griezmann-88': require('./imagecartas/ICONS/griezmann-88.png'),
  'shearer-88': require('./imagecartas/ICONS/shearer-88.png'),
  'klose-88': require('./imagecartas/ICONS/klose-88.png'),
  'van-persie-88': require('./imagecartas/ICONS/van-persie-88.png'),
  'rooney-88': require('./imagecartas/ICONS/rooney-88.png'),
  'wright-87': require('./imagecartas/ICONS/wright-87.png'),
  'rush-87': require('./imagecartas/ICONS/rush-87.png'),
  'kluivert-87': require('./imagecartas/ICONS/kluivert-87.png'),
  'suker-87': require('./imagecartas/ICONS/suker-87.png'),
  'fernando-torres-87': require('./imagecartas/ICONS/fernando-torres-87.png'),
  'crespo-88': require('./imagecartas/ICONS/crespo-88.png'),
  // --- Árbitros ---
  'negreira-91': require('./imagecartas/ICONS/negreira-91.png'), // Usando la imageUri con .png
  'matheus-lahoz-91': require('./imagecartas/ICONS/matheus-lahoz-91.png'), // Usando la imageUri con .png

  // --- VOCALOID X FC ---
  'teto-utau-90': require('./imagecartas/ICONS/teto-utau-90.png'), // Asumiendo .png
  'teto-synth-92': require('./imagecartas/ICONS/teto-synth-92.png'), // Asumiendo .png
  'miku-base-91': require('./imagecartas/ICONS/miku-base-91.png'), // Asumiendo .png
  'miku-92': require('./imagecartas/ICONS/miku-92.png'), // Asumiendo .png
  'neru-92': require('./imagecartas/ICONS/neru-92.png'), // Asumiendo .png
  'neru-base-90': require('./imagecartas/ICONS/neru-base-90.png'), // Asumiendo .png
  'larsson-86': require('./imagecartas/ICONS/larsson-86.png'), // Asumiendo .png
  // La entrada de Trezeguet está comentada en tu lista, no la incluyo aquí.
  'trezeguet-86': require('./imagecartas/ICONS/trezeguet-86.png'), // Asumiendo .png y la ruta de Iconos
  // --- Nuevos Defensas Centrales Héroes ---
  'vincent-kompany-88': require('./imagecartas/HEROES/vincent-kompany-88.png'),
  'ricardo-carvalho-88': require('./imagecartas/HEROES/ricardo-carvalho-88.png'),
  'upson-82': require('./imagecartas/HEROES/upson-82.png'),
  'godin-90': require('./imagecartas/HEROES/godin-90.png'),
  'javier-mascherano-88': require('./imagecartas/HEROES/javier-mascherano-88.png'),
  'rafa-marquez-88': require('./imagecartas/HEROES/rafa-marquez-88.png'),
  'mario-yepes-86': require('./imagecartas/HEROES/mario-yepes-86.png'),
  'ayala-87': require('./imagecartas/HEROES/ayala-87.png'),
  'walter-samuel-87': require('./imagecartas/HEROES/walter-samuel-87.png'),
  'jaap-stam-87': require('./imagecartas/HEROES/jaap-stam-87.png'),
  'david-luiz-87': require('./imagecartas/HEROES/david-luiz-87.png'),
  'ivan-cordoba-87': require('./imagecartas/HEROES/ivan-cordoba-87.png'),
  'demichelis-86': require('./imagecartas/HEROES/demichelis-86.png'),
  'jamie-carragher-86': require('./imagecartas/HEROES/jamie-carragher-86.png'),
  'ledley-king-86': require('./imagecartas/HEROES/ledley-king-86.png'),
  'diego-lugano-86': require('./imagecartas/HEROES/diego-lugano-86.png'),
  'majid-hosseini-83': require('./imagecartas/HEROES/majid-hosseini-83.png'),
  'rafik-halliche-84': require('./imagecartas/HEROES/rafik-halliche-84.png'),
  'popescu-86': require('./imagecartas/HEROES/popescu-86.png'),
  'sami-hyypia-86': require('./imagecartas/HEROES/sami-hyypia-86.png'),
  // --- Nuevos Laterales Héroes (Izquierdo y Derecho) ---
  'john-arne-riise-86': require('./imagecartas/HEROES/john-arne-riise-86.png'),
  'joan-capdevila-86': require('./imagecartas/HEROES/joan-capdevila-86.png'),
  'filipe-luis-86': require('./imagecartas/HEROES/filipe-luis-86.png'),
  'irwin-87': require('./imagecartas/HEROES/irwin-87.png'),
  'junior-diaz-83': require('./imagecartas/HEROES/junior-diaz-83.png'),
  'alan-kennedy-86': require('./imagecartas/HEROES/alan-kennedy-86.png'),
  'manuel-amoros-87': require('./imagecartas/HEROES/manuel-amoros-87.png'),
  'cristian-ansaldi-84': require('./imagecartas/HEROES/cristian-ansaldi-84.png'),
  'maicon-88': require('./imagecartas/HEROES/maicon-88.png'),
  'valencia-88': require('./imagecartas/HEROES/valencia-88.png'),
  'habib-beye-84': require('./imagecartas/HEROES/habib-beye-84.png'),
  'lee-dixon-86': require('./imagecartas/HEROES/lee-dixon-86.png'),
  'zabaleta-86': require('./imagecartas/HEROES/zabaleta-86.png'),
  'pascal-chimbonda-83': require('./imagecartas/HEROES/pascal-chimbonda-83.png'),
  'tsuneyasu-miyamoto-84': require('./imagecartas/HEROES/tsuneyasu-miyamoto-84.png'),
  // --- Nuevos Mediocampistas Defensivos Héroes ---
  'jorge-bermudez-85': require('./imagecartas/HEROES/jorge-bermudez-85.png'),
  'blaise-matuidi-86': require('./imagecartas/HEROES/blaise-matuidi-86.png'),
  'khedira-86': require('./imagecartas/HEROES/khedira-86.png'),
  'hamann-86': require('./imagecartas/HEROES/hamann-86.png'),
  'ramires-86': require('./imagecartas/HEROES/ramires-86.png'),
  'freddy-rincon-85': require('./imagecartas/HEROES/freddy-rincon-85.png'),
  'nainggolan-85': require('./imagecartas/HEROES/nainggolan-85.png'),
  'claudio-reyna-85': require('./imagecartas/HEROES/claudio-reyna-85.png'),
  'massimo-ambrosini-85': require('./imagecartas/HEROES/massimo-ambrosini-85.png'),
  'maximo-bonini-86': require('./imagecartas/HEROES/maximo-bonini-86.png'),
  'de-rossi-88': require('./imagecartas/HEROES/de-rossi-88.png'),
  'hossam-hassan-84': require('./imagecartas/HEROES/hossam-hassan-84.png'),
  // --- Nuevos Mediocampistas Héroes (Central y Ofensivo) ---
  'dario-srna-88': require('./imagecartas/HEROES/dario-srna-88.png'),
  'jorge-burruchaga-88': require('./imagecartas/HEROES/jorge-burruchaga-88.png'),
  'claudio-marchisio-88': require('./imagecartas/HEROES/claudio-marchisio-88.png'),
  'pogba-88': require('./imagecartas/HEROES/pogba-88.png'),
  'enzo-scifo-87': require('./imagecartas/HEROES/enzo-scifo-87.png'),
  'simeone-87': require('./imagecartas/HEROES/simeone-87.png'),
  'steven-davis-86': require('./imagecartas/HEROES/steven-davis-86.png'),
  'fellaini-85': require('./imagecartas/HEROES/fellaini-85.png'),
  'giovanni-van-bronckhorst-86': require('./imagecartas/HEROES/giovanni-van-bronckhorst-86.png'),
  'shunsuke-nakamura-87': require('./imagecartas/HEROES/shunsuke-nakamura-87.png'),

  'deco-88': require('./imagecartas/HEROES/deco-88.png'),
  'andreas-herzog-86': require('./imagecartas/HEROES/andreas-herzog-86.png'),
  'stiliyan-petrov-85': require('./imagecartas/HEROES/stiliyan-petrov-85.png'),
  'kazimierz-deyna-86': require('./imagecartas/HEROES/kazimierz-deyna-86.png'),
  // --- Nuevos Mediocampistas Ofensivos Héroes ---
  'ali-karimi-86': require('./imagecartas/HEROES/ali-karimi-86.png'),
  'le-tissier-87': require('./imagecartas/HEROES/le-tissier-87.png'),
  'valeri-karpin-84': require('./imagecartas/HEROES/valeri-karpin-84.png'),
  'sardar-azmoun-84': require('./imagecartas/HEROES/sardar-azmoun-84.png'),
  'georgi-kinkladze-85': require('./imagecartas/HEROES/georgi-kinkladze-85.png'),
  'francesco-moriero-88': require('./imagecartas/HEROES/francesco-moriero-88.png'),
  'rui-costa-87': require('./imagecartas/HEROES/rui-costa-87.png'),
  'dirk-kuyt-86': require('./imagecartas/HEROES/dirk-kuyt-86.png'),
  'tomas-rosicky-86': require('./imagecartas/HEROES/tomas-rosicky-86.png'),
  'aleksandr-mostovoi-86': require('./imagecartas/HEROES/aleksandr-mostovoi-86.png'),
  'landon-donovan-86': require('./imagecartas/HEROES/landon-donovan-86.png'),
  'abedi-pele-89': require('./imagecartas/HEROES/abedi-pele-89.png'),
  'noor-85': require('./imagecartas/HEROES/noor-85.png'),
  'clint-dempsey-85': require('./imagecartas/HEROES/clint-dempsey-85.png'),
  'jari-litmanen-88': require('./imagecartas/HEROES/jari-litmanen-88.png'),
  'marek-hamsik-87': require('./imagecartas/HEROES/marek-hamsik-87.png'),
  'aimar-88': require('./imagecartas/HEROES/aimar-88.png'), // Asegúrate de que este ID no colisione si ya tenías un Icon Aimar con el mismo ID
  'ariel-ortega-87': require('./imagecartas/HEROES/ariel-ortega-87.png'),
  'hidetoshi-nakata-87': require('./imagecartas/HEROES/hidetoshi-nakata-87.png'),
  // --- Nuevos Extremos Héroes (Derecho e Izquierdo) ---
  'dirk-kuyt-86': require('./imagecartas/HEROES/dirk-kuyt-86.png'),
  'bojan-87': require('./imagecartas/HEROES/bojan-87.png'),
  'ricardo-quaresma-87': require('./imagecartas/HEROES/ricardo-quaresma-87.png'),
  'wallcot-86': require('./imagecartas/HEROES/wallcot-86.png'),
  'joe-cole-87': require('./imagecartas/HEROES/joe-cole-87.png'),
  'saeed-al-owairan-85-ed': require('./imagecartas/HEROES/saeed-al-owairan-85-ed.png'),

  'saeed-al-owairan-85-ed': require('./imagecartas/HEROES/saeed-al-owairan-85-ed.png'),
  'rafael-van-der-vaart-85': require('./imagecartas/HEROES/rafael-van-der-vaart-85.png'),
  'christian-bolanos-85': require('./imagecartas/HEROES/christian-bolanos-85.png'),
  'arshavin-87': require('./imagecartas/HEROES/arshavin-87.png'),
  'serghino-86': require('./imagecartas/HEROES/serghino-86.png'),
  'pato-86': require('./imagecartas/HEROES/pato-86.png'),
  'mark-gonzalez-86': require('./imagecartas/HEROES/mark-gonzalez-86.png'),
  'bryan-ruiz-85': require('./imagecartas/HEROES/bryan-ruiz-85.png'),
  'paulo-futre-88': require('./imagecartas/HEROES/paulo-futre-88.png'),
  'harry-kewell-87': require('./imagecartas/HEROES/harry-kewell-87.png'),
  'steve-heighway-86': require('./imagecartas/HEROES/steve-heighway-86.png'),
  // --- Nuevos Mediocampistas Héroes (Izquierdo y Derecho) ---
  'david-ginola-89': require('./imagecartas/HEROES/david-ginola-89.png'),
  'ze-roberto-87': require('./imagecartas/HEROES/ze-roberto-87.png'),
  'park-ji-sung-86': require('./imagecartas/HEROES/park-ji-sung-86.png'),
  'arda-turan-87': require('./imagecartas/HEROES/arda-turan-87.png'),
  'nani-87': require('./imagecartas/HEROES/nani-87.png'),
  'freddie-ljungberg-86': require('./imagecartas/HEROES/freddie-ljungberg-86.png'),
  'damarcus-beasley-85': require('./imagecartas/HEROES/damarcus-beasley-85.png'),

  'steve-mcmanaman-87': require('./imagecartas/HEROES/steve-mcmanaman-87.png'),
  'ludovic-giuly-86': require('./imagecartas/HEROES/ludovic-giuly-86.png'),
  'maxi-rodriguez-86': require('./imagecartas/HEROES/maxi-rodriguez-86.png'),
  // --- Nuevos Delanteros Héroes ---
  'diego-milito-88': require('./imagecartas/HEROES/diego-milito-88.png'),
  'adriano-89': require('./imagecartas/HEROES/adriano-89.png'),
  'ivan-zamorano-87': require('./imagecartas/HEROES/ivan-zamorano-87.png'),
  'gonzalo-higuain-88': require('./imagecartas/HEROES/gonzalo-higuain-88.png'),
  'sturridge-85': require('./imagecartas/HEROES/sturridge-85.png'),
  'brolin-87': require('./imagecartas/HEROES/brolin-87.png'),
  'ali-daei-89': require('./imagecartas/HEROES/ali-daei-89.png'),
  'peter-crouch-85': require('./imagecartas/HEROES/peter-crouch-85.png'),
  'tim-cahill-85': require('./imagecartas/HEROES/tim-cahill-85.png'),
  'ole-gunnar-solskjaer-86': require('./imagecartas/HEROES/ole-gunnar-solskjaer-86.png'),
  'sidney-govou-86': require('./imagecartas/HEROES/sidney-govou-86.png'),
  'sami-al-jaber-86': require('./imagecartas/HEROES/sami-al-jaber-86.png'),
  // --- Porteros Héroes ---
  'jorge-campos-87': require('./imagecartas/HEROES/jorge-campos-87.png'),
  'jerzy-dudek-86': require('./imagecartas/HEROES/jerzy-dudek-86.png'),
  'sebastiano-rossi-86': require('./imagecartas/HEROES/sebastiano-rossi-86.png'),
  'julio-cesar-88': require('./imagecartas/HEROES/julio-cesar-88.png'),
  'hart-87': require('./imagecartas/HEROES/hart-87.png'),
  'tim-howard-85': require('./imagecartas/HEROES/tim-howard-85.png'),
  'mohammed-al-deayea-87': require('./imagecartas/HEROES/mohammed-al-deayea-87.png'),
  'essam-el-hadary-86': require('./imagecartas/HEROES/essam-el-hadary-86.png'),
  'vincent-enyeama-86': require('./imagecartas/HEROES/vincent-enyeama-86.png'),
  'mark-schwarzer-85': require('./imagecartas/HEROES/mark-schwarzer-85.png'),
  'hugo-gatti-85': require('./imagecartas/HEROES/hugo-gatti-85.png'),
  'jan-tomaszewski-85': require('./imagecartas/HEROES/jan-tomaszewski-85.png'),
  'pat-jennings-88': require('./imagecartas/HEROES/pat-jennings-88.png'),
  // --- Nuevos Delanteros Héroes ---
  'dimitar-berbatov-87': require('./imagecartas/HEROES/dimitar-berbatov-87.png'),
  'antonio-di-natale-88': require('./imagecartas/HEROES/antonio-di-natale-88.png'),
  'diego-forlan-88-del': require('./imagecartas/HEROES/diego-forlan-88-del.png'), // Usando el ID y imageUri proporcionados
  'carlos-tevez-88': require('./imagecartas/HEROES/carlos-tevez-88.png'),
  'fernando-morientes-88': require('./imagecartas/HEROES/fernando-morientes-88.png'),
  'gianluca-vialli-89': require('./imagecartas/HEROES/gianluca-vialli-89.png'),
  'erjon-bogdani-86': require('./imagecartas/HEROES/erjon-bogdani-86.png'),
  'pauleta-88': require('./imagecartas/HEROES/pauleta-88.png'),
  'falcao-88': require('./imagecartas/HEROES/falcao-88.png'),
  'eidur-gudjohnsen-88': require('./imagecartas/HEROES/eidur-gudjohnsen-88.png'),
  // --- Nuevos Jugadores Icono y Héroes ---
  'bochini-90': require('./imagecartas/HEROES/bochini-90.png'), // Icono
  'simonsen-89': require('./imagecartas/HEROES/simonsen-89.png'), // Icono
  'overath-89': require('./imagecartas/HEROES/overath-89.png'), // Icono
  'monti-88': require('./imagecartas/HEROES/monti-88.png'), // Icono
  'zito-87': require('./imagecartas/HEROES/zito-87.png'), // Icono
  'luis-hernandez-86': require('./imagecartas/HEROES/luis-hernandez-86.png'), // Icono

  'huntelaar-86': require('./imagecartas/HEROES/huntelaar-86.png'), // Héroe
  'vardy-87': require('./imagecartas/HEROES/vardy-87.png'), // Héroe (versión 87)

  'donnarumma_95': require('./imagecartas/champions/donnarumma_95.png'),
  'dumfries_93': require('./imagecartas/champions/dumfries_93.png'),
  'bastoni_93': require('./imagecartas/champions/bastoni_93.png'),
  'saliba_95': require('./imagecartas/champions/saliba_95.png'),
  'hakimi_94': require('./imagecartas/champions/hakimi_94.png'),
  'vitinha_94': require('./imagecartas/champions/vitinha_94.png'),
  'rice_95': require('./imagecartas/champions/rice_95.png'),
  'pedri_95': require('./imagecartas/champions/pedri_95.png'),
  'dembele_95': require('./imagecartas/champions/dembele_95.png'),
  'lautaro_95': require('./imagecartas/champions/lautaro_95.png'),
  'yamal_95': require('./imagecartas/champions/yamal_95.png'),
  'szczesny_92': require('./imagecartas/champions/szczesny_92.png'),
  'mendes_93': require('./imagecartas/champions/mendes_93.png'),
  'inigo_martinez_92': require('./imagecartas/champions/inigo_martinez_92.png'),
  'acerbi_90': require('./imagecartas/champions/acerbi_90.png'),
  'skelly_93': require('./imagecartas/champions/skelly_93.png'),
  'joao_neves_94': require('./imagecartas/champions/joao_neves_94.png'),
  'odegard_93': require('./imagecartas/champions/odegard_93.png'),
  'dani_olmo_93': require('./imagecartas/champions/dani_olmo_93.png'),
  'raphinha_94': require('./imagecartas/champions/raphinha_94.png'),
  'kvaratskhelia_94': require('./imagecartas/champions/kvaratskhelia_94.png'),
  'lewandowski_94': require('./imagecartas/champions/lewandowski_94.png'),
  'sommer_93': require('./imagecartas/champions/sommer_93.png'),
  'ferran_torres_92': require('./imagecartas/champions/ferran_torres_92.png'),

    'reijnders_91.png': require('./imagecartas/SBC/reijnders_potm_sbc.png'),
    'mastantuono_91.png': require('./imagecartas/SBC/mastantuono_potm_91.png'),
    'harry_kane_92.png': require('./imagecartas/SBC/harry_kane_potm_92.png'),
    'dembele_91.png': require('./imagecartas/SBC/demebele_potm_91.png'),
    'antony_90.png': require('./imagecartas/SBC/antony_potm_90.png'),
    'raphinha_92.png': require('./imagecartas/SBC/raphinha_potm_92.png'),
    'salah_92.png': require('./imagecartas/SBC/salah_potm_92.png'),
   'pionero_dida_95': require('./imagecartas/pionero/dida_95.png'),
  'pionero_valdes_94': require('./imagecartas/pionero/valdes_94.png'),
  'pionero_campos_93': require('./imagecartas/pionero/campos_93.png'),
  'pionero_bienvenida_courtois_92': require('./imagecartas/pionero/courtois_92.png'),
  'pionero_bienvenida_maignan_91': require('./imagecartas/pionero/maignan_91.png'),
  'pionero_bienvenida_alisson_becker_91': require('./imagecartas/pionero/alisson_becker_91.png'),
  'pionero_bienvenida_neuer_97': require('./imagecartas/pionero/neuer_97.png'),
  'pionero_bienvenida_casillas_97': require('./imagecartas/pionero/casillas_97.png'),
  'pionero_bienvenida_yashin_95': require('./imagecartas/pionero/yashin_95.png'),
  'pionero_bienvenida_buffon_96': require('./imagecartas/pionero/buffon_96.png'),

  // DEFENSAS CENTRALES (CB)
  'pionero_kompany_94': require('./imagecartas/pionero/kompany_94.png'),
  'pionero_stam_95': require('./imagecartas/pionero/stam_95.png'),
  'pionero_pique_95': require('./imagecartas/pionero/pique_95.png'),
  'pionero_beckenbauber_97': require('./imagecartas/pionero/beckenbauber_97.png'),
  'pionero_cannavaro_96': require('./imagecartas/pionero/cannavaro_96.png'),
  'pionero_bienvenida_araujo_91': require('./imagecartas/pionero/araujo_91.png'),
  'pionero_bienvenida_saliba_95': require('./imagecartas/pionero/saliba_95.png'),
  'pionero_bienvenida_rudiger_92': require('./imagecartas/pionero/rudiger_92.png'),
  'pionero_bienvenida_pau_cubarsi_91': require('./imagecartas/pionero/pau_cubarsi_91.png'),
  'pionero_bienvenida_inigo_martinez_92': require('./imagecartas/pionero/inigo_martinez_92.png'),
  'pionero_bienvenida_kim_min_jae_89': require('./imagecartas/pionero/kim_min_jae_89.png'),
  'pionero_bienvenida_sergio_ramos_96': require('./imagecartas/pionero/sergio_ramos_96.png'),
  'pionero_bienvenida_ricardo_carvalho_95': require('./imagecartas/pionero/ricardo_carvalho_95.png'),
  'pionero_bienvenida_paolo_maldini_97': require('./imagecartas/pionero/maldini_97.png'),

  // LATERALES IZQUIERDOS (LB)
  'pionero_marcelo_96': require('./imagecartas/pionero/marcelo_96.png'),
  'pionero_nilsantos_95': require('./imagecartas/pionero/nilsantos_95.png'),
  'pionero_bienvenida_theo_hernandez_94': require('./imagecartas/pionero/theo_hernandez_94.png'),
  'pionero_bienvenida_alphonso_davies_93': require('./imagecartas/pionero/davies_93.png'),
  'pionero_bienvenida_grimaldo_90': require('./imagecartas/pionero/grimaldo_90.png'),
  'pionero_bienvenida_nuno_mendes_90': require('./imagecartas/pionero/nuno_mendes_90.png'),
  'pionero_bienvenida_balde_90': require('./imagecartas/pionero/balde_90.png'),
  'pionero_bienvenida_facchetti_95': require('./imagecartas/pionero/facchetti_95.png'),
  'pionero_bienvenida_riise_94': require('./imagecartas/pionero/riise_94.png'),
  'pionero_bienvenida_roberto_carlos_96': require('./imagecartas/pionero/roberto_carlos_96.png'),

  // LATERALES DERECHOS (RB)
  'pionero_djalma_santos_94': require('./imagecartas/pionero/djalma_santos_94.png'),
  'pionero_zanetti_95': require('./imagecartas/pionero/zanetti_95.png'),
  'pionero_bienvenida_hakimi_91': require('./imagecartas/pionero/hakimi_91.png'),
  'pionero_bienvenida_trent_alexander_arnold_92': require('./imagecartas/pionero/trent_alexander_arnold_92.png'),
  'pionero_bienvenida_kounde_93': require('./imagecartas/pionero/kounde_93.png'),
  'pionero_bienvenida_cafu_96': require('./imagecartas/pionero/cafu_96.png'),
  'pionero_bienvenida_lilian_thuram_95': require('./imagecartas/pionero/thuram_95.png'),
  'pionero_bienvenida_gary_neville_94': require('./imagecartas/pionero/gary_neville_94.png'),

  // MEDIOCENTROS DEFENSIVOS (CDM)
  'pionero_gattuso_94': require('./imagecartas/pionero/gattuso_94.png'),
  'pionero_cambiasso_94': require('./imagecartas/pionero/cambiasso_94.png'),
  'pionero_bienvenida_rodri_93': require('./imagecartas/pionero/rodri_93.png'),
  'pionero_bienvenida_declan_rice_93': require('./imagecartas/pionero/declan_rice_93.png'),

  // MEDIOCENTROS (CM)
  'pionero_iniesta_96': require('./imagecartas/pionero/iniesta_96.png'),
  'pionero_xavi_97': require('./imagecartas/pionero/xavi_97.png'),
  'pionero_marchisio_94': require('./imagecartas/pionero/marchisio_94.png'),
  'pionero_matthaus_95': require('./imagecartas/pionero/matthaus_95.png'),
  'pionero_bienvenida_valverde_92': require('./imagecartas/pionero/valverde_92.png'),
  'pionero_bienvenida_bellingham_93': require('./imagecartas/pionero/bellingham_93.png'),
  'pionero_bienvenida_pedri_93': require('./imagecartas/pionero/pedri_93.png'),
  'pionero_bienvenida_mac_allister_92': require('./imagecartas/pionero/mac_allister_92.png'),
  'pionero_bienvenida_reijnders_91': require('./imagecartas/pionero/reijnders_91.png'),
  'pionero_bienvenida_beckham_94': require('./imagecartas/pionero/beckham_94.png'),

  // MEDIOCENTROS OFENSIVOS (CAM)
  'pionero_maradona_97': require('./imagecartas/pionero/maradona_97.png'),
  'pionero_pele_97': require('./imagecartas/pionero/pele_97.png'),
  'pionero_cruyff_96': require('./imagecartas/pionero/cruyff_96.png'),
  'pionero_kaka_96': require('./imagecartas/pionero/kaka_96.png'),
  'pionero_bienvenida_odegaard_91': require('./imagecartas/pionero/odegaard_91.png'),
  'pionero_bienvenida_florian_wirtz_92': require('./imagecartas/pionero/wirtz_92.png'),
  'pionero_bienvenida_dani_olmo_90': require('./imagecartas/pionero/dani_olmo_90.png'),
  'pionero_bienvenida_gullit_96': require('./imagecartas/pionero/gullit_96.png'),
  'pionero_bienvenida_zico_94': require('./imagecartas/pionero/zico_94.png'),

  // MEDIOCENTROS IZQUIERDOS (LM)
  'pionero_nedved_94': require('./imagecartas/pionero/nedved_94.png'),
  'pionero_giggs_93': require('./imagecartas/pionero/giggs_93.png'),

  // MEDIOCENTROS DERECHOS (RM)
  'pionero_robben_93': require('./imagecartas/pionero/robben_93.png'),

  // EXTREMOS IZQUIERDOS (LW)
  'pionero_ronaldinho_97': require('./imagecartas/pionero/ronaldinho_97.png'),
  'pionero_henry_96': require('./imagecartas/pionero/henry_96.png'),
  'pionero_gento_95': require('./imagecartas/pionero/gento_95.png'),
  'pionero_bienvenida_mbappe_94': require('./imagecartas/pionero/mbappe_94.png'),
  'pionero_bienvenida_vinicius_94': require('./imagecartas/pionero/vinicius_94.png'),
  'pionero_bienvenida_leao_93': require('./imagecartas/pionero/leao_93.png'),
  'pionero_bienvenida_kvaratskhelia_91': require('./imagecartas/pionero/kvaratskhelia_91.png'),
  'pionero_bienvenida_luis_diaz_90': require('./imagecartas/pionero/luis_diaz_90.png'),
  'pionero_bienvenida_son_90': require('./imagecartas/pionero/son_90.png'),

  // EXTREMOS DERECHOS (RW)
  'pionero_best_93': require('./imagecartas/pionero/best_93.png'),
  'pionero_dimaria_94': require('./imagecartas/pionero/dimaria_94.png'),
  'pionero_quaresma_95': require('./imagecartas/pionero/quaresma_95.png'),
  'pionero_bienvenida_raphinha_95': require('./imagecartas/pionero/raphinha_95.png'),
  'pionero_bienvenida_yamal_94': require('./imagecartas/pionero/yamal_94.png'),
  'pionero_bienvenida_salah_94': require('./imagecartas/pionero/salah_94.png'),
  'pionero_bienvenida_saka_91': require('./imagecartas/pionero/saka_91.png'),
  'pionero_bienvenida_messi_93': require('./imagecartas/pionero/messi_93.png'),
  'pionero_bienvenida_rodrygo_91': require('./imagecartas/pionero/rodrygo_91.png'),
   'pionero_bienvenida_weah_95' : require('./imagecartas/pionero/weah_95.png'),
  // DELANTEROS (ST)
  'pionero_batistuta_93': require('./imagecartas/pionero/batistuta_93.png'),
  'pionero_zlatan_94': require('./imagecartas/pionero/zlatan_94.png'),
  'pionero_david_villa_93': require('./imagecartas/pionero/david_villa_93.png'),
  'pionero_forlan_92': require('./imagecartas/pionero/forlan_92.png'),
  'pionero_bienvenida_haaland_94': require('./imagecartas/pionero/haaland_94.png'),
  'pionero_bienvenida_kane_92': require('./imagecartas/pionero/kane_92.png'),
  'pionero_bienvenida_lautaro_martinez_92': require('./imagecartas/pionero/lautaro_martinez_92.png'),
  'pionero_bienvenida_julian_alvarez_92': require('./imagecartas/pionero/julian_alvarez_92.png'),
  'pionero_bienvenida_osimhen_92': require('./imagecartas/pionero/osimhen_92.png'),
  'pionero_bienvenida_alexander_isak_90': require('./imagecartas/pionero/alexander_isak_90.png'),
  'pionero_bienvenida_cristiano_ronaldo_93': require('./imagecartas/pionero/cristiano_ronaldo_93.png'),
  'pionero_bienvenida_van_basten_96': require('./imagecartas/pionero/van_basten_96.png'),
  'pionero_bienvenida_george_weah_95': require('./imagecartas/pionero/weah_95.png'),
  'pionero_bienvenida_eusebio_95': require('./imagecartas/pionero/eusebio_95.png'),
  'pionero_bienvenida_ronaldo_nazario_97': require('./imagecartas/pionero/ronaldo_nazario_97.png'),

  'jason.png': require('./imagecartas/BASE/jason.png'),
  'orellano.png': require('./imagecartas/BASE/orellano.png'),
  'nahuel-barrios.png': require('./imagecartas/BASE/barrios.png'), // Confirmed: player.imageUri is 'nahuel-barrios.png'
  'fragapane.png': require('./imagecartas/BASE/fragapene.png'), // Corrected filename in require() path
  'reggie-cannon.png': require('./imagecartas/BASE/cannon.png'), // Confirmed: player.imageUri is 'reggie-cannon.png'
  'colidio.png': require('./imagecartas/BASE/colidio.png'),
  'weah.png': require('./imagecartas/BASE/weah.png'),
  'giles.png': require('./imagecartas/BASE/giles.png'),
  'tavarez.png': require('./imagecartas/BASE/tavarez.png'),
  'adams.png': require('./imagecartas/BASE/adams.png'),
  'bustos.png': require('./imagecartas/BASE/bustos.png'),
  'hettwer.png': require('./imagecartas/BASE/hettwer.png'),
  'rojas.png': require('./imagecartas/BASE/rojas.png'),
  'zeballos.png': require('./imagecartas/BASE/zeballos.png'),
'silver_player.png': require('./imagecartas/BASE/silver.png'),
};