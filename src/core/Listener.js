import getUUID from 'utils/getUUID';
import getFunctionUsage from 'utils/getFunctionUsage';

const Listener = function ListenerFunc(event, fn, once, emitState) {
    const state = {};

    function drop() {
        if (state.dropped) return;
        emitState.off(state);
        state.dropped = true;
    }

    const localState = {
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
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }];

    getFunctionUsage(states, 'Listener');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};

export default Listener;
