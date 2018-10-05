import isGameEntity from 'components/entities/isGameEntity';
import pipe from 'utils/pipe';
import canEmit from 'components/canEmit';

const Player = function PlayerFunc() {
    const state = {};

    function printInfo() {
        console.log(`name: %c${state.name}`, 'color: red');
    }

    const isGameEntityState = isGameEntity(state);
    const canEmitState = canEmit(state);

    return Object.assign(state, isGameEntityState, canEmitState, {
        // props
        name: 'my nice player',
        // methods
        printInfo: pipe(
            isGameEntityState.printInfo,
            printInfo,
        ),
    });
};

export default Player;
