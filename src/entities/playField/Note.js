import isGameEntity from 'components/entities/isGameEntity';
import hasPosition from 'components/hasPosition';

const Note = function NoteFunc(parent) {
    const state = {};
    let rect;
    const board = parent;
    let index = 0;

    function init(i, x) {
        state.setX(x);
        index = i;
    }

    function update(currentIndex, stepsPerSec, stepSize, max) {
        const distance = (index - currentIndex) * stepSize;
        state.setY(board.getY() - distance);
        if (index < 323) {
            // console.log(max, stepsPerSec, stepSize);
            // console.log(state.getY());
        }
        if (!rect && state.getY() > 0 && state.getY() < board.getY() + 400) {
            rect = board.getParentState().add.graphics();
            rect.lineStyle(2, 0xff0000, 1);
            rect.strokeRect(0, 0, 50, 50);
        }
        if (rect && state.getY() > board.getY() + 400) {
            rect.destroy();
            rect = undefined;
        }
        if (rect) {
            rect.x = state.getX();
            rect.y = state.getY();
        }
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    return Object.assign(state, isGameEntityState, hasPositionState, {
        // props
        // methods
        init,
        update,
    });
};

export default Note;
