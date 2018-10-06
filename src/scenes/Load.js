import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import LoadingBar from 'core/LoadingBar';
import spriteConfig from 'configs/spriteConfig';
import audioConfig from 'configs/audioConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const LoadScene = function LoadSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.LOAD);
    let loadingBar;

    function loadAudio() {
        Object.keys(audioConfig.MUSIC).forEach((objKey) => {
            const AUDIO = audioConfig.MUSIC[objKey];
            state.load.audio(AUDIO.KEY, AUDIO.PATH);
        });
    }

    function loadSpritesheets() {}

    function loadMaps() {}

    function loadImages() {
        Object.keys(spriteConfig).forEach((objKey) => {
            const SPRITE = spriteConfig[objKey];
            state.load.image(SPRITE.KEY, SPRITE.PATH);
        });
    }

    function loadAssets() {
        loadAudio();
        loadImages();
        loadSpritesheets();
        loadMaps();
    }

    function preload() {
        loadingBar = LoadingBar();
        loadingBar.init(state, gameConfig.GAME.VIEWWIDTH / 2, gameConfig.GAME.VIEWHEIGHT / 2);
        state.load.on('complete', () => {
            state.scene.start(gameConfig.SCENES.GAME);
            state.destroy();
        });

        loadAssets();
    }

    function destroy() {
        if (loadingBar) loadingBar.destroy();
    }

    const localState = {
        // props
        // methods
        preload,
        destroy,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }];

    getFunctionUsage(states, 'LoadState');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};

export default LoadScene;
