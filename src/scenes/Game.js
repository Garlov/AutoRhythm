import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';
import MusicSelect from 'scenes/MusicSelect';
import PlayField from 'scenes/PlayField';
import createKeyboard from 'core/Keyboard';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let currentScene;
    const keyboard = createKeyboard();
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

        gameStates.set(gameConfig.SCENES.PLAY_FIELD, PlayField());
        state.scene.add(gameConfig.SCENES.PLAY_FIELD, gameStates.get(gameConfig.SCENES.PLAY_FIELD), true);

        audioManager = AudioManager()
            .setScene(gameStates.get(gameConfig.SCENES.UI))
            .setPauseOnBlur(true)
            .init();

        gameStates.set(gameConfig.SCENES.MUSIC_SELECT, MusicSelect());
        state.scene.add(gameConfig.SCENES.MUSIC_SELECT, gameStates.get(gameConfig.SCENES.MUSIC_SELECT), true);

        currentScene = gameStates.get(gameConfig.SCENES.MUSIC_SELECT);

        keyboard.enable();
    }

    function getKeyboard() {
        return keyboard;
    }

    function getAudioManager() {
        return audioManager;
    }

    function create() {
        cameraSetup();
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
        getKeyboard,
        create,
        update,
        destroy,
    });
};

export default Game;
