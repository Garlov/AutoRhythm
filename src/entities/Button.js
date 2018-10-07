import getFunctionUsage from 'utils/getFunctionUsage';
import canEmit from 'components/canEmit';
import hasSize from 'components/hasSize';
import hasPosition from 'components/hasPosition';
import pipe from 'utils/pipe';
import eventConfig from 'configs/eventConfig';

const Button = function ButtonFunc(parent) {
    const state = {};
    const parentState = parent;

    let background;
    let zone;
    let text = 'My Button';
    let textElem;

    function init() {
        state.refresh();
    }

    function setText(val) {
        text = val;
        state.refresh();
    }

    function onClick(e) {
        state.emit(eventConfig.EVENTS.BUTTON.CLICK, e);
    }

    function refresh() {
        if (!background) {
            background = parentState.add.graphics();
            zone = parentState.add.zone(0, 0, 10, 10);
            zone.setInteractive();
            zone.on('pointerup', onClick, state);
        }
        background.clear();
        background.lineStyle(3, 0xcccccc, 1);
        background.fillStyle(0x333333, 1);
        background.strokeRect(state.getX(), state.getY(), state.getWidth(), state.getHeight());
        background.fillRect(state.getX(), state.getY(), state.getWidth(), state.getHeight());

        zone.input.hitArea.setTo(state.getX(), state.getY(), state.getWidth(), state.getHeight());
        zone.setInteractive();

        if (!textElem) {
            textElem = parent.add.text(0, 0, '', {
                font: '64px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
        }

        textElem.text = `${text}`;
        textElem.x = state.getX() + state.getWidth() / 2 - textElem.width / 2;
        textElem.y = state.getY() - (textElem.height / 2) + state.getHeight() / 2;
    }

    function destroy() {
        if (background) {
            background.destroy();
            background = undefined;
        }

        if (zone) {
            zone.destroy();
            zone = undefined;
        }

        if (textElem) {
            textElem.destroy();
            textElem = undefined;
        }
    }

    const canEmitState = canEmit(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);

    const localState = {
        // props
        // methods
        init,
        setText,
        refresh,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: canEmitState, name: 'canEmit' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSizeState, name: 'hasSize' },
    ];

    getFunctionUsage(states, 'Button');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        destroy: pipe(
            localState.destroy,
            canEmitState.destroy,
        ),
        setPosition: pipe(
            hasPositionState.setPosition,
            localState.refresh,
        ),
        setSize: pipe(
            hasSizeState.setSize,
            localState.refresh,
        ),
    });
};

export default Button;
