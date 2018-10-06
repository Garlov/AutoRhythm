import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';
import Visualizer from 'scenes/Visualizer';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let currentScene;
    const gameStates = new Map();

    function cameraSetup() {
        // state.cameras.main.startFollow(state.player); // or whatever else.
        state.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.cameras.main.setZoom(0.8);
    }

    function init() {
        // After assets are loaded.
        gameStates.set(gameConfig.SCENES.UI, UI());
        state.scene.add(gameConfig.SCENES.UI, gameStates.get(gameConfig.SCENES.UI), true);

        audioManager = AudioManager()
            .setScene(gameStates.get(gameConfig.SCENES.UI))
            .setPauseOnBlur(true)
            .init();

        gameStates.set(gameConfig.SCENES.VISUALIZER, Visualizer());
        state.scene.add(gameConfig.SCENES.VISUALIZER, gameStates.get(gameConfig.SCENES.VISUALIZER), false);
        currentScene = gameStates.get(gameConfig.SCENES.VISUALIZER);
        currentScene.scene.start();
    }

    function getAudioManager() {
        return audioManager;
    }

    function create() {
        cameraSetup();
        gameStates.get(gameConfig.SCENES.VISUALIZER).visualize();
    }

    function update(time, delta) {}

    function destroy() {
        gameStates.forEach((s) => {
            s.destroy();
        });
    }

    return Object.assign(state, {
        // props
        // methods
        init,
        getAudioManager,
        create,
        update,
        destroy,
    });
};

export default Game;
