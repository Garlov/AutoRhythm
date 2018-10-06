import canEmit from 'components/canEmit';
import eventConfig from 'configs/eventConfig';

const createKeyboardInput = function createKeyboardInputFunc() {
    const state = {};
    const canEmitState = canEmit(state);

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

    return Object.assign(state, canEmitState, {
        // props
        // methods
        disable,
        enable,
    });
};

export default createKeyboardInput;
