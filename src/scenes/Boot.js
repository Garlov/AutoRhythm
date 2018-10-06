import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import resizeCanvas from 'utils/resizeCanvas';
import getFunctionUsage from 'utils/getFunctionUsage';

const BootScene = function BootSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.BOOT);
    /**
     * Preload loading bar and needed fonts etc.
     */
    function preload() {}

    function create() {
        resizeCanvas();
        state.cameras.main.setSize(gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.scene.start(gameConfig.SCENES.LOAD);
    }
    const localState = {
        // props
        // methods
        preload,
        create,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }];

    getFunctionUsage(states, 'Boot');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};

export default BootScene;
