import isGameEntity from 'components/entities/isGameEntity';
import LaneReceptor from 'entities/playField/LaneReceptor';
import hasPosition from 'components/hasPosition';
import gameConfig from 'configs/gameConfig';

const Board = function BoardFunc(parent) {
    const state = {};
    const parentState = parent;
    const laneReceptors = [];
    const laneCount = 4;
    const padding = 100;

    function init() {
        const x = padding;
        const y = gameConfig.GAME.VIEWHEIGHT - padding - 50;
        const laneSize = (gameConfig.GAME.VIEWWIDTH - padding * 2) / laneCount;
        state.setPosition({ x, y });
        for (let i = 0; i < laneCount; i += 1) {
            const laneReceptor = LaneReceptor(state);
            laneReceptor.init();
            laneReceptor.setIndex(i);
            laneReceptor.setSize({ width: laneSize, height: 100 });
            laneReceptors.push(laneReceptor);
        }
    }

    function update() {
        laneReceptors.forEach((laneReceptor) => {
            laneReceptor.update();
        });
    }

    function getParentState() {
        return parentState;
    }

    function getLaneCount() {
        return laneCount;
    }

    function getPadding() {
        return padding;
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    return Object.assign(state, isGameEntityState, hasPositionState, {
        // props
        // methods
        init,
        update,
        getParentState,
        getLaneCount,
        getPadding,
    });
};

export default Board;
