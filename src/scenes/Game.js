import Phaser from 'phaser';
import { List } from 'immutable';
import gameConfig from 'configs/gameConfig';
import spriteConfig from 'configs/spriteConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let UIScene;
    let background;

    function cameraSetup() {
        // state.cameras.main.startFollow(state.player); // or whatever else.
        state.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.cameras.main.setZoom(0.8);
    }

    function init() {
        // After assets are loaded.
        UIScene = UI();
        state.scene.add(gameConfig.SCENES.UI, UIScene, true);
        audioManager = AudioManager()
            .setScene(UIScene)
            .setPauseOnBlur(true)
            .init();
    }

    function create() {
        background = state.add.image(0, 0, spriteConfig.BACKGROUND.KEY);
        background.setOrigin(0, 0);
        audioManager.playBgMusic();
        cameraSetup();
    }

    function update(time, delta) {}

    function destroy() {
        if (background) state.background.destroy();
        if (UI) UI.destroy();
    }

    return Object.assign(state, {
        // props
        // methods
        init,
        create,
        update,
        destroy,
    });
};

export default Game;
