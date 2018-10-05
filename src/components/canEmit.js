import messageBus from 'core/MessageBus';
import Phaser from 'phaser';
import Listener from 'core/Listener';

const canEmit = function canEmitFunc(state) {
    let localEmitter;
    const listeners = [];

    function emitGlobal(event, data) {
        messageBus.emit(event, data);
    }

    function emit(event, data) {
        if (!localEmitter) {
            localEmitter = new Phaser.Events.EventEmitter();
        }
        localEmitter.emit(event, data);
    }

    function on(event, fn, context) {
        if (!localEmitter) {
            localEmitter = new Phaser.Events.EventEmitter();
        }
        localEmitter.on(event, fn, context);
        const listener = Listener(event, fn, false, state);
        listeners.push(listener);
        return listener;
    }

    function once(event, fn, context) {
        if (!localEmitter) {
            localEmitter = new Phaser.Events.EventEmitter();
        }
        localEmitter.once(event, fn, context);
        const listener = Listener(event, fn, true, state);
        listeners.push(listener);
        return listener;
    }

    function off(listener) {
        if (listeners.indexOf(listener) >= 0) {
            localEmitter.off(listener.event, listener.fn, listener.once);
            listeners.splice(listeners.indexOf(listener), 1);
        }
    }

    function removeAllListeners() {
        if (localEmitter) {
            listeners.forEach((l) => {
                l.drop();
            });
        }
    }

    function destroy() {
        if (localEmitter) {
            state.removeAllListeners();
            localEmitter.destroy();
        }
    }

    return {
        // props
        // methods
        emitGlobal,
        emit,
        on,
        once,
        off,
        removeAllListeners,
        destroy,
    };
};

export default canEmit;
