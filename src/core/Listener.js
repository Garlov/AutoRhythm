import getUUID from 'utils/getUUID';

const Listener = function ListenerFunc(event, fn, once, emitState) {
    const state = {};

    function drop() {
        if (state.dropped) return;
        emitState.off(state);
        state.dropped = true;
    }

    return Object.assign(state, {
        // props
        id: getUUID(),
        dropped: false,
        once,
        event,
        fn: !once ? fn : (evt) => {
            fn(evt);
            state.drop();
        },
        // methods
        drop,
    });
};

export default Listener;
