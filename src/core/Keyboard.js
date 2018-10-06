import canEmit from 'components/canEmit';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';

const createKeyboardInput = function createKeyboardInputFunc() {
    const state = {};

    function keyDownFn(e) {
        state.emit(eventConfig.EVENTS.KEYBOARD.KEYDOWN, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function keyUpFn(e) {
        state.emit(eventConfig.EVENTS.KEYBOARD.KEYUP, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function enable() {
        document.addEventListener('keydown', keyDownFn);
        document.addEventListener('keyup', keyUpFn);
    }

    function disable() {
        document.removeEventListener('keydown', keyDownFn);
        document.removeEventListener('keyup', keyUpFn);
    }

    const localState = {
        // props
        // methods
        disable,
        enable,
    };

    const canEmitState = canEmit(state);
    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }, { state: canEmitState, name: 'canEmit' }];
    getFunctionUsage(states, 'Keyboard');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};

export default createKeyboardInput;
