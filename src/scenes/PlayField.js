import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import Board from 'entities/playField/Board';
import createFrequencyMap from 'utils/createFrequencyMap';
import canEmit from 'components/canEmit';
import hasInput from 'components/hasInput';
import canListen from 'components/canListen';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const PlayField = function PlayFieldFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.PLAY_FIELD);
    let board;

    function init() {}

    function _onKeyDown(e) {
        if (state.sys.isActive()) {
            if (e.keyCode === gameConfig.KEYCODES.ESCAPE) {
                state.emitGlobal(eventConfig.EVENTS.GAME.SONG_ENDED, { escape: true });
            }
        }
    }

    function setupListeners() {
        state.listenOn(state.getKeyboard(), eventConfig.EVENTS.KEYBOARD.KEYDOWN, _onKeyDown);
    }

    function create() {
        const currentSong = state.scene.manager
            .getScene(gameConfig.SCENES.GAME)
            .getAudioManager()
            .getCurrentSong();
        const freqMap = createFrequencyMap(currentSong.audioBuffer);

        board = Board(state);
        board.setFrequencyMap(currentSong, freqMap);
        board.init();

        setupListeners();
    }

    function update(time, delta) {
        board.update();
    }

    function destroy() {}

    const canEmitState = canEmit(state);
    const hasInputState = hasInput(state);
    const canListenState = canListen(state);

    const localState = {
        // props
        // methods
        init,
        create,
        update,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: canEmitState, name: 'canEmit' },
        { state: hasInputState, name: 'hasInput' },
        { state: canListenState, name: 'canListen' },
    ];

    getFunctionUsage(states, 'PlayField');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update,
            localState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canEmit.destroy,
            canListen.destroy,
        ),
    });
};

export default PlayField;
