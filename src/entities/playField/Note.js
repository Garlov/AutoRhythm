import isGameEntity from 'components/entities/isGameEntity';
import hasPosition from 'components/hasPosition';
import canEmit from 'components/canEmit';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const Note = function NoteFunc(parent) {
    const state = {};
    let noteBg;
    let board = parent;
    let index = 0;
    const noteSize = 25;

    function init(i, x) {
        state.setX(x);
        index = i;
    }

    function update({ currentIndex, stepSize }) {
        const distance = (index - currentIndex) * stepSize;
        state.setY(board.getY() - distance);
        if (!noteBg && state.getY() > 0 && state.getY() < board.getY() + 400) {
            noteBg = board.getParentState().add.graphics();
            noteBg.lineStyle(2, 0xff0000, 1);
            noteBg.fillCircle(0, 0, noteSize);
        }
        if (noteBg && state.getY() > board.getY() + 400) {
            noteBg.destroy();
            noteBg = undefined;
            if (!state.hit) {
                state.hit = true;
                state.emit(eventConfig.EVENTS.TONE.LEFT_LANE_NO_HIT, state);
            }
            state.emit(eventConfig.EVENTS.TONE.LEFT_LANE, state);
        }
        if (noteBg) {
            noteBg.x = state.getX();
            noteBg.y = state.getY();
        }
    }

    function onHit() {
        state.hit = true;
    }

    function destroy() {
        if (noteBg) {
            noteBg.destroy();
            noteBg = undefined;
        }

        board = undefined;
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        hit: false,
        // methods
        init,
        update,
        onHit,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: canEmitState, name: 'canEmit' },
    ];
    getFunctionUsage(states, 'Note');

    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            localState.update,
            isGameEntityState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canEmitState.destroy,
        ),
    });
};

export default Note;
