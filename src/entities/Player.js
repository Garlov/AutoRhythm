import isGameEntity from 'components/entities/isGameEntity';
import pipe from 'utils/pipe';
import canEmit from 'components/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';

const Player = function PlayerFunc() {
    const state = {};

    function printInfo() {
        console.log(`name: %c${state.name}`, 'color: red');
    }

    const isGameEntityState = isGameEntity(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        name: 'my nice player',
        // methods
        printInfo,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: canEmitState, name: 'canEmit' },
    ];

    getFunctionUsage(states, 'Player');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        printInfo: pipe(
            isGameEntityState.printInfo,
            localState.printInfo,
        ),
    });
};

export default Player;
