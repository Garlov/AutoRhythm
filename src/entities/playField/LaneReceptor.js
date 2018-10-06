import isGameEntity from 'components/entities/isGameEntity';
import gameConfig from 'configs/gameConfig';
import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';

const LaneReceptor = function LaneReceptorFunc(parent) {
    const state = {};
    const board = parent;
    let index = 0;
    let rect;
    let color = 0xcccccc;

    function init() {
        rect = board.getParentState().add.graphics();
    }

    function setIndex(i) {
        index = i;
        const x = ((gameConfig.GAME.VIEWWIDTH - board.getPadding() * 2) / board.getLaneCount()) * index;
        state.setX(x);
    }

    function setColor(c) {
        color = c;
    }

    function update() {
        if (rect) {
            rect.clear();
            rect.lineStyle(2, color, 1);

            const x = state.getX() + board.getX();
            const y = state.getY() + board.getY();
            rect.strokeRect(x, y, state.getWidth(), state.getHeight());
        }
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);
    return Object.assign(state, isGameEntityState, hasPositionState, hasSizeState, {
        // props
        // methods
        setIndex,
        setColor,
        update,
        init,
    });
};

export default LaneReceptor;
