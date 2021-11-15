import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';
import MusicSelect from 'scenes/MusicSelect';
import PlayField from 'scenes/PlayField';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/canListen';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import store from '../store';
import createTextures from 'utils/textureGenerator';
import MainMenuScene from './MainMenu';
import KeyConfigScene from './KeyConfig';
import OptionsScene from './Options';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    const gui = UI();
    store.ui = gui;
    store.game = state;

    function cameraSetup() {
        state.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.cameras.main.setZoom(0.8);
    }

    function _openMainMenu() {
        state.scene.add(gameConfig.SCENES.MAIN_MENU, MainMenuScene(), true);
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

    function _onMainMenuEntered(e) {
        state.scene.manager.getScene(e.sourceScene).destroy();
        state.scene.remove(e.sourceScene);
        _openMainMenu();
    }

    function _onMainMenuItemSelected(e) {
        state.scene.manager.getScene(gameConfig.SCENES.MAIN_MENU).destroy();
        state.scene.remove(gameConfig.SCENES.MAIN_MENU);

        switch (e.scene) {
            case gameConfig.SCENES.MUSIC_SELECT:
                state.scene.add(gameConfig.SCENES.OPTIONS, MusicSelect(), true);
                break;

            case gameConfig.SCENES.KEY_CONFIG:
                state.scene.add(gameConfig.SCENES.OPTIONS, KeyConfigScene(), true);
                break;

            case gameConfig.SCENES.OPTIONS:
                state.scene.add(gameConfig.SCENES.OPTIONS, OptionsScene(), true);
                break;

            default:
                console.error('Uh oh');
                break;
        }
    }


    function setupListeners() {
        state.listenGlobal(eventConfig.EVENTS.GAME.PLAY_ENDED, _onSongEnded);
        state.listenGlobal(eventConfig.EVENTS.GAME.SONG_SELECTED, _onSongSelected);

        state.listenGlobal(eventConfig.EVENTS.MENU.SELECTED_ITEM, _onMainMenuItemSelected);
        state.listenGlobal(eventConfig.EVENTS.MENU.ENTERED, _onMainMenuEntered);
    }

    function init() {
        // After assets are loaded.
        state.scene.add(gameConfig.SCENES.UI, gui, true);

        audioManager = AudioManager()
            .setScene(gui)
            .setPauseOnBlur(false)
            .init();

        setupListeners();
        _openMainMenu();
    }

    function getAudioManager() {
        return audioManager;
    }

    function create() {
        createTextures(state);
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
