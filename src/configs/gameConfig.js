export default {
    GAME: {
        VIEWHEIGHT: 1080,
        VIEWWIDTH: 1920,
        TITLE: 'Auto Rhythm',
        RNGSEED: 31415926535,
    },
    HEALTH: {
        MAX: 100,
        FAIL_OFF: true, // Set to true to be unable to fail.
        GAIN: 0.8, // Amount of health added when a note is hit succesfully.
        REDUCE: 2.5, // Amount of health that is reduced when a note is missed.
    },
    SCENES: {
        BOOT: 'game_boot',
        LOAD: 'game_load',
        GAME: 'game_game',
        MAIN_MENU: 'game_menu',
        OPTIONS: 'game_options',
        KEY_CONFIG: 'game_key_config',
        UI: 'UI',
        MUSIC_SELECT: 'music_select',
        VISUALIZER: 'visualizer',
        PLAY_FIELD: 'game_play_field',
    },
    /**
     * Hit Thresholds based on Stepmania/Etterna Judge 4.
     * Judge Modifiers inspired by Judge 1-9 + 0/10.
     */
    JUDGE_MODIFIERS: [2.0, 1.5, 1.33, 1.16, 1.0, 0.84, 0.66, 0.5, 0.33, 0.2, 0.1],
    HIT_THRESHOLDS: {
        FLAWLESS: {
            MS: 22.5,
            TEXT: 'Flawless!!',
            COLOR: '#4fc3f7',
        },
        PERFECT: {
            MS: 45,
            TEXT: 'Perfect!',
            COLOR: '#EDA800',
        },
        GREAT: {
            MS: 90,
            TEXT: 'Great!',
            COLOR: '#43a047',
        },
        GOOD: {
            MS: 135,
            TEXT: 'Good!',
            COLOR: '#ffee58',
        },
        BAD: {
            MS: 180,
            TEXT: 'Bad!',
            COLOR: '#673ab7',
        },
        MISS: {
            MS: Infinity,
            TEXT: 'MISS!',
            COLOR: '#d50000',
        },
    },
    KEYS: {
        LEFT_ARROW: {
            CODE: 37,
            KEY: '',
        },
        UP_ARROW: {
            CODE: 38,
            KEY: '',
        },
        RIGHT_ARROW: {
            CODE: 39,
            KEY: '',
        },
        DOWN_ARROW: {
            CODE: 40,
            KEY: '',
        },
        Z: {
            CODE: 90,
            KEY: 'Z',
        },
        X: {
            CODE: 88,
            KEY: 'X',
        },
        COMMA: {
            CODE: 188,
            KEY: ',',
        },
        DOT: {
            CODE: 190,
            KEY: '.',
        },
        A: {
            CODE: 65,
            KEY: 'A',
        },
        S: {
            CODE: 83,
            KEY: 'S',
        },
        K: {
            CODE: 75,
            KEY: 'K',
        },
        L: {
            CODE: 76,
            KEY: 'L',
        },
        ENTER: {
            CODE: 13,
            KEY: '',
        },
        ESCAPE: {
            CODE: 27,
            KEY: '',
        },
    },
    DEFAULT_TEXT_STYLE: {
        font: 'Roboto',
        fontSize: 20,
        fill: '#ffffff',
        smoothed: false,
    },
    UI_DEFAULT: {
        tint: 0xaaaaaa,
    },
    AUDIO: {
        musicKeys: ['bgScore'],
        sfxKeys: ['coinSfx'],
        VOLUME: 30,
    },
};
