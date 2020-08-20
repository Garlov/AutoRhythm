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
import noteConfig from 'configs/noteConfig';
import Phaser from 'phaser';

const LaneReceptor = function LaneReceptorFunc(parent) {
    const state = {};
    let board = parent;
    let index = 0;
    let pushIndicator;
    let topGradient;
    let bottomGradient;
    let keyText;
    let color = 0xcccccc;
    let sprite;
    const pushIndicatorPadding = 1;
    const pushIndicationTime = 100;
    let pushIndicationTimeLeft = pushIndicationTime;
    let pushIndication = false;

    const keyConfig = [gameConfig.KEYS.Z, gameConfig.KEYS.X, gameConfig.KEYS.COMMA, gameConfig.KEYS.DOT,
        gameConfig.KEYS.LEFT_ARROW, gameConfig.KEYS.DOWN_ARROW, gameConfig.KEYS.UP_ARROW, gameConfig.KEYS.RIGHT_ARROW];

    function onKeyDown(e) {
        if (!e.repeat && e.keyCode === keyConfig[index].CODE || e.keyCode === keyConfig[index + 4].CODE) {
            state.emit(eventConfig.EVENTS.LANE.RECEPTOR_DOWN, { index });
            onPushIndication();
        }
    }

    // TODO spriteify?
    function createGradiantReceptor(x, y) {
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

    // TODO spriteify?
    function createCircleReceptor(x, y) {
        const lineWidth = 6;
        pushIndicator.lineStyle(lineWidth, color);
        pushIndicator.strokeCircle(0, 0, noteConfig.NOTE_RADIUS);
        pushIndicator.x = x;
        pushIndicator.y = y;
    }

    function createArrowReceptor(x, y) {
        sprite = new Phaser.GameObjects.Sprite(board.getParentState(), x, y, 'receptor');
        sprite.setOrigin(0.5);
        sprite.x = x;
        sprite.y = y;
        board.getParentState().add.existing(sprite);
    }

    function init() {
        pushIndicator = board.getParentState().add.graphics();
        const x = state.getX() + board.getX();
        const y = state.getY() + board.getY();
        if (sprite) sprite.destroy();

        if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.CIRCLE) {
            createCircleReceptor(x, y);
        } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.GRADIENT) {
            createGradiantReceptor(x, y);
        } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.ARROWS) {
            createArrowReceptor(x, y);
        }
    }

    function setIndex(i) {
        index = i;
        const x = ((gameConfig.GAME.VIEWWIDTH - board.getX() * 2) / board.getLaneCount()) * index;
        state.listenOn(state.getKeyboard(), eventConfig.EVENTS.KEYBOARD.KEYDOWN, onKeyDown);
        state.setX(x);
        const totX = state.getX() + board.getX();
        if (pushIndicator) {
            if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.CIRCLE) {
                pushIndicator.x = totX + state.getWidth() / 2;
            } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.GRADIENT) {
                pushIndicator.x = totX + pushIndicatorPadding;
                if (topGradient && bottomGradient) {
                    topGradient.x = totX + pushIndicatorPadding;
                    bottomGradient.x = totX + pushIndicatorPadding;
                }
            }
        }

        if (sprite) {
            sprite.x = totX + state.getWidth() / 2;
            if (i === 0) sprite.rotation = Math.PI / 2;
            if (i === 2) sprite.rotation = Math.PI;
            if (i === 3) sprite.rotation = -Math.PI / 2;
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

    function onPushIndication() {
        pushIndication = true;
        sprite.alpha = 0.5;
    }

    function onPushIndicationOver() {
        pushIndication = false;
        pushIndicationTimeLeft = pushIndicationTime;
        sprite.alpha = 1.0;

        // // TODO spriteify?
        // if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.CIRCLE) {
        //     pushIndicator.setAlpha(0.7);
        // } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.GRADIENT) {
        //     pushIndicator.setAlpha(0.7);
        // } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.ARROWS) {
        //     sprite.setAlpha(0.7);
        // }
    }

    function update(delta) {
        if (pushIndication) {
            pushIndicationTimeLeft -= delta;
            if (pushIndicationTimeLeft < 0) {
                onPushIndicationOver();
            }
        }
    }

    function destroy() {
        if (pushIndicator) {
            pushIndicator.destroy();
            pushIndicator = undefined;
        }

        if (topGradient) {
            topGradient.destroy();
            topGradient = undefined;
        }

        if (bottomGradient) {
            bottomGradient.destroy();
            bottomGradient = undefined;
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
