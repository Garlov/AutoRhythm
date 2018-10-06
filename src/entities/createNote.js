import isGameEntity from 'components/entities/isGameEntity';

const createNote = function createNoteFunc() {
    const state = {};
    const isGameEntityState = isGameEntity();

    function update() {}

    return Object.assign(state, isGameEntityState, {
        // props
        // methods
        update,
    });
};

export default createNote;
