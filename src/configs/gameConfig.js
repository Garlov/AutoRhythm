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
        UI: 'UI',
        MUSIC_SELECT: 'music_select',
        VISUALIZER: 'visualizer',
        PLAY_FIELD: 'game_play_field',
    },
    HIT_THRESHOLDS: {
        FLAWLESS: {
            MS: 15,
            TEXT: 'Flawless!!',
            COLOR: '#4fc3f7',
        },
        GREAT: {
            MS: 30,
            TEXT: 'Great!',
            COLOR: '#43a047',
        },
        GOOD: {
            MS: 45,
            TEXT: 'Good!',
            COLOR: '#ffee58',
        },
        BAD: {
            MS: 60,
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
    },
};
