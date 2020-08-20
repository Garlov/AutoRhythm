import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';
import MusicSelect from 'scenes/MusicSelect';
import PlayField from 'scenes/PlayField';
import createKeyboard from 'core/Keyboard';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/canListen';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import noteConfig from 'configs/noteConfig';
import store from '../store';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    const gui = UI();
    store.ui = gui;
    store.game = state;
    const keyboard = createKeyboard();

    function cameraSetup() {
        // state.cameras.main.startFollow(state.player); // or whatever else.
        state.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.cameras.main.setZoom(0.8);
    }

    function _onSongSelected(e) {
        audioManager.stopMusic();
        state.scene.manager.getScene(gameConfig.SCENES.MUSIC_SELECT).destroy();
        state.scene.remove(gameConfig.SCENES.MUSIC_SELECT);
        state.scene.add(gameConfig.SCENES.PLAY_FIELD, PlayField(e), true);
    }

    function _onSongEnded(e) {
        state.scene.manager.getScene(gameConfig.SCENES.PLAY_FIELD).destroy();
        state.scene.remove(gameConfig.SCENES.PLAY_FIELD);
        state.scene.add(gameConfig.SCENES.MUSIC_SELECT, MusicSelect(), true);
    }

    function setupListeners() {
        state.listenGlobal(eventConfig.EVENTS.GAME.PLAY_ENDED, _onSongEnded);
        state.listenGlobal(eventConfig.EVENTS.GAME.SONG_SELECTED, _onSongSelected);
    }

    function init() {
        // After assets are loaded.
        state.scene.add(gameConfig.SCENES.UI, gui, true);

        audioManager = AudioManager()
            .setScene(gui)
            .setPauseOnBlur(false)
            .init();

        setupListeners();
        keyboard.enable();
        state.scene.add(gameConfig.SCENES.MUSIC_SELECT, MusicSelect(), true);
    }

    function getKeyboard() {
        return keyboard;
    }

    function getAudioManager() {
        return audioManager;
    }

    function createArrowTexture(fillColor, strokeWidth, strokeColor, key, scale = 0.6) {
        if (store.game.textures.exists(key)) {
            store.game.textures.remove(key);
        }

        const width = 165 * scale;
        const height = 160 * scale;
        const d = new Phaser.GameObjects.Graphics(state);

        d.beginPath();
        d.fillStyle(fillColor);
        d.lineStyle(strokeWidth, strokeColor);
        d.moveTo(60 * scale, 0); // top left
        d.lineTo(90 * scale, 0); // top right
        d.lineTo(90 * scale, 100 * scale); // middle-bottom-right
        d.lineTo(130 * scale, 65 * scale); // top-middle-right
        d.lineTo(150 * scale, 85 * scale); // top-middle-down-right
        d.lineTo(75 * scale, 155 * scale); // bottom
        d.lineTo(0, 85 * scale); // top-middle-down-left
        d.lineTo(20 * scale, 65 * scale); // top-middle-left
        d.lineTo(60 * scale, 100 * scale); // middle-bottom-left
        d.closePath();
        d.fillPath();
        d.strokePath();
        d.generateTexture(key, width, height);
        d.destroy();
    }

    function createCircleTexture(strokeWidth, color, key) {
        if (store.game.textures.exists(key)) {
            store.game.textures.remove(key);
        }

        const d = new Phaser.GameObjects.Graphics(state);
        d.fillStyle(color, 1);
        d.fillCircle(noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS - strokeWidth);
        d.lineStyle(strokeWidth, 0x000000, 1);
        d.strokeCircle(noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS);
        d.generateTexture(key, 2 * (noteConfig.NOTE_RADIUS + strokeWidth), 2 * (noteConfig.NOTE_RADIUS + strokeWidth));
        d.destroy();
    }

    function createTextures() {
        if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.CIRCLE || noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.GRADIENT) {
            createCircleTexture(2, noteConfig.EDGE_COLOR, 'edgeNote');
            createCircleTexture(2, noteConfig.MIDDLE_COLOR, 'middleNote');
        } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.ARROWS) {
            createArrowTexture(noteConfig.EDGE_COLOR, 3, 0xCCCCCC, 'edgeNote');
            createArrowTexture(noteConfig.MIDDLE_COLOR, 3, 0xCCCCCC, 'middleNote');
            createArrowTexture(0x444444, 3, 0xCCCCCC, 'receptor', 0.63);
        }
    }

    function create() {
        createTextures();
        cameraSetup();
    }

    function update(time, delta) { }

    function destroy() { }

    const canListenState = canListen(state);

    const localState = {
        // props
        // methods
        init,
        getAudioManager,
        createTextures,
        getKeyboard,
        create,
        update,
        destroy,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }, { state: canListenState, name: 'canListen' }];

    getFunctionUsage(states, 'Game');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update,
            localState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canListenState.destroy,
        ),
    });
};

export default Game;
