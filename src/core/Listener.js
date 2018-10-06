import getUUID from 'utils/getUUID';
import getFunctionUsage from 'utils/getFunctionUsage';

const Listener = function ListenerFunc(event, fn, once, emitState) {
    const state = {};

    function drop() {
        if (state.dropped) return;
        emitState.off(state);
        state.dropped = true;
    }

    const states = [{ state, name: 'state' }];
    getFunctionUsage(states, 'Listener');
    return Object.assign(...states.map(s => s.state), {
        // props
        id: getUUID(),
        dropped: false,
        once,
        event,
        fn: !once
            ? fn
            : (evt) => {
                fn(evt);
                state.drop();
            },
        // methods
        drop,
    });
};

export default Listener;
