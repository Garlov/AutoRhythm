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
    let topGradient;
    let bottomGradient;
    let keyText;
    let color = 0xcccccc;
    const pushIndicatorPadding = 1;

    const keyConfig = [gameConfig.KEYS.Z, gameConfig.KEYS.X, gameConfig.KEYS.COMMA, gameConfig.KEYS.DOT];

    function onKeyDown(e) {
        if (!e.repeat && e.keyCode === keyConfig[index].CODE) {
            state.emit(eventConfig.EVENTS.LANE.RECEPTOR_DOWN, { index });
        }
    }

    function init() {
        pushIndicator = board.getParentState().add.graphics();

        const x = state.getX() + board.getX();
        const y = state.getY() + board.getY();

        const elemWidth = state.getWidth() - pushIndicatorPadding * 2;
        pushIndicator.lineStyle(5, color, 1);
        pushIndicator.beginPath();
        pushIndicator.moveTo(0, 0);
        pushIndicator.lineTo(elemWidth, 0);
        pushIndicator.strokePath();
        pushIndicator.x = x;
        pushIndicator.y = y;

        topGradient = board.getParentState().add.graphics();
        topGradient.fillGradientStyle(0x000000, 0x000000, color, color, 0.4);
        topGradient.fillRect(0, -state.getHeight() / 2, elemWidth, state.getHeight() / 2);
        topGradient.x = x;
        topGradient.y = y;

        bottomGradient = board.getParentState().add.graphics();
        bottomGradient.fillGradientStyle(color, color, 0x000000, 0x000000, 0.4);
        bottomGradient.fillRect(0, 0, elemWidth, state.getHeight() / 2);
        bottomGradient.x = x;
        bottomGradient.y = y;
    }

    function setIndex(i) {
        index = i;
        const x = ((gameConfig.GAME.VIEWWIDTH - board.getX() * 2) / board.getLaneCount()) * index;
        state.listenOn(state.getKeyboard(), eventConfig.EVENTS.KEYBOARD.KEYDOWN, onKeyDown);
        state.setX(x);
        if (pushIndicator) {
            const totX = state.getX() + board.getX();
            pushIndicator.x = totX + pushIndicatorPadding;
            topGradient.x = totX + pushIndicatorPadding;
            bottomGradient.x = totX + pushIndicatorPadding;
        }

        keyText = board.getParentState().add.text(state.getX() + board.getX(), state.getY() + board.getY(), `${keyConfig[index].KEY}`, {
            font: '32px Arial',
            fill: '#eeeeee',
            align: 'center',
        });
        keyText.y += state.getHeight() / 2 + keyText.height / 3;
        keyText.x += state.getWidth() / 2 - keyText.width / 2;
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

        if (topGradient) {
            topGradient.destroy();
            topGradient = undefined;
        }

        if (keyText) {
            keyText.destroy();
            keyText = undefined;
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
