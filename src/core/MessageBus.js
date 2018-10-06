import canEmit from 'components/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';

const messageBus = function messageBusFunc() {
    const state = {};
    const canEmitState = canEmit(state);

    const states = [{ state, name: 'state' }, { state: canEmitState, name: 'canEmit' }];
    getFunctionUsage(states, 'MessageBus');
    return Object.assign(...states.map(s => s.state), {});
};
const messageBusObj = messageBus();
export default messageBusObj;
