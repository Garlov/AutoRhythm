import isGameEntity from 'components/entities/isGameEntity';
import gameConfig from 'configs/gameConfig';
import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';
import hasInput from 'components/hasInput';
import canListen from 'components/canListen';
import eventConfig from 'configs/eventConfig';
import canEmit from 'components/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const LaneReceptor = function LaneReceptorFunc(parent) {
    const state = {};
    let board = parent;
    let index = 0;
    let pushIndicator;
    let color = 0xcccccc;

    function onKeyDown(e) {
        if (!e.repeat && e.keyCode === gameConfig.KEYCODES.Z && index === 0) {
            state.emit(eventConfig.EVENTS.LANE.RECEPTOR_DOWN, { index });
        }
        if (!e.repeat && e.keyCode === gameConfig.KEYCODES.X && index === 1) {
            state.emit(eventConfig.EVENTS.LANE.RECEPTOR_DOWN, { index });
        }
        if (!e.repeat && e.keyCode === gameConfig.KEYCODES.COMMA && index === 2) {
            state.emit(eventConfig.EVENTS.LANE.RECEPTOR_DOWN, { index });
        }
        if (!e.repeat && e.keyCode === gameConfig.KEYCODES.DOT && index === 3) {
            state.emit(eventConfig.EVENTS.LANE.RECEPTOR_DOWN, { index });
        }
    }

    function init() {
        pushIndicator = board.getParentState().add.graphics();

        pushIndicator.clear();
        pushIndicator.lineStyle(2, color, 1);

        const x = state.getX() + board.getX();
        const y = state.getY() + board.getY();
        pushIndicator.strokeRect(x, y, state.getWidth(), state.getHeight());
    }

    function setIndex(i) {
        index = i;
        const x = ((gameConfig.GAME.VIEWWIDTH - board.getX() * 2) / board.getLaneCount()) * index;
        state.listenOn(state.getKeyboard(), eventConfig.EVENTS.KEYBOARD.KEYDOWN, onKeyDown);
        state.setX(x);
        if (pushIndicator) {
            pushIndicator.x = state.getX() + board.getX();
        }
    }

    function setColor(c) {
        color = c;
    }

    function update() {}

    function destroy() {
        if (pushIndicator) {
            pushIndicator.destroy();
            pushIndicator = undefined;
        }

        board = undefined;
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);
    const hasInputState = hasInput(state);
    const canListenState = canListen(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        scene: board.getParentState().scene,
        // methods
        setIndex,
        setColor,
        update,
        init,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSizeState, name: 'hasSize' },
        { state: hasInputState, name: 'hasInput' },
        { state: canListenState, name: 'canListen' },
        { state: canEmitState, name: 'canEmit' },
    ];

    getFunctionUsage(states, 'LaneReceptor');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            localState.update,
            isGameEntityState.update,
        ),
        destroy: pipe(
            canListenState.destroy,
            canEmitState.destroy,
            localState.destroy,
        ),
    });
};

export default LaneReceptor;
