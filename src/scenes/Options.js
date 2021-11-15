import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import hasInput from 'components/hasInput';
import canListen from 'components/canListen';
import canEmit from 'components/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import eventConfig from 'configs/eventConfig';

const OptionsScene = function OptionsSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.OPTIONS);
    let titleText;

    // TODO - _writeOptions/RenderSongs/etc. and general menu traversal shit should probably be unified into isMenu or something.
    // so we don't have to re-do the logic for each.
    function _writeOptions() {
    }

    // TODO Key Config...
    function _onKeyDown(e) {
        if (e.keyCode === gameConfig.KEYS.ESCAPE.CODE) {
            const data = {
                sourceScene: gameConfig.SCENES.OPTIONS,
            };
            state.emitGlobal(eventConfig.EVENTS.MENU.ENTERED, data);
        }
    }

    function create() {
        if (!titleText) {
            titleText = state.add.text(gameConfig.GAME.VIEWWIDTH / 2, 20, 'Options - TODO', {
                font: '72px Arial',
                fill: '#eeeeee',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
            });
            titleText.x -= titleText.width / 2;
        }

        state.listenOn(state.getKeyboard(), 'keydown', _onKeyDown);
    }

    function update(time, delta) { }

    function destroy() {

    }

    const hasInputState = hasInput(state);
    const canListenState = canListen(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        // methods
        create,
        update,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: hasInputState, name: 'hasInput' },
        { state: canListenState, name: 'canListen' },
        { state: canEmitState, name: 'canEmit' },
    ];

    getFunctionUsage(states, 'KeyConfig');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update,
            localState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canListenState.destroy,
            canEmitState.destroy,
        ),
    });
};

export default OptionsScene;
