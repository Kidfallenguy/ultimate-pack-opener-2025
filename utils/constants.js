
export const STORAGE_KEYS = {
    GAME_STATE: 'gameState',
    SBC_LIST: 'sbcList',
    CHAMPIONS_TOKENS: 'championsTokens',
    CLAIMED_EVENT_PLAYERS: 'claimedEventPlayers',
    LEGEND_TASKS_PROGRESS: 'legendTasksProgress',
    // Add any other AsyncStorage keys you use here
    SBC_DATA_SPECIFIC: 'sbcDataSpecific', // Example if sbcLogic saves its own data
};

export const BETA_MINIGAMES = {
    GAME1: 'beta_pases',
    GAME2: 'beta_regate',
    GAME3: 'beta_tiros',
    GAME4: 'beta_defensa',
    GAME6: 'beta_portero',
    GAME5: 'beta_libre',
};

export const LEGEND_TASKS = [
    { id: 'complete_portero_14', description: 'Completa el Desafío Portero 14 veces' },
    { id: 'open_any_packs_10', description: 'Abre 10 Sobres (cualquiera)' },
    { id: 'score_30_goals_minijuegos', description: 'Anota 30 goles en minijuegos' },
    { id: 'complete_sbc_3', description: 'Completa 3 Desafíos SBC' },
];


export const LEGEND_TASK_REQUIREMENTS = {
    'complete_portero_14': 14, // Requiere 14 completaciones del desafío portero
    'open_any_packs_10': 10, // Requisito actualizado: Abrir 10 sobres (cualquiera)
    'score_30_goals_minijuegos': 30, // Requiere anotar 30 goles
    // Eliminado: 'win_5_matches_vsa': 5,
    'complete_sbc_3': 3, // Requiere completar 3 SBCs
};

