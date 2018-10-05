import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import resizeCanvas from 'utils/resizeCanvas';

const BootScene = function BootSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.BOOT);
    /**
     * Preload loading bar and needed fonts etc.
     */
    function preload() {
    }

    function create() {
        resizeCanvas();
        state.cameras.main.setSize(gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.scene.start(gameConfig.SCENES.LOAD);
    }

    return Object.assign(state, {
        // props
        // methods
        preload,
        create,
    });
};

export default BootScene;
