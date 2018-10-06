import isGameEntity from 'components/entities/isGameEntity';

const Board = function BoardFunc(parent) {
    const state = {};
    const parentState = parent;

    const isGameEntityState = isGameEntity(state);

    return Object.assign(state, isGameEntityState, {
        // props
        // methods
    });
};

export default Board;
