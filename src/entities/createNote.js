import isGameEntity from 'components/entities/isGameEntity';
import hasPosition from 'components/hasPosition';

const createNote = function createNoteFunc() {
    const state = {};
    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);

    function update() {}

    return Object.assign(state, isGameEntityState, hasPositionState, {
        // props
        // methods
        update,
    });
};

export default createNote;
