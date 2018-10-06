import canEmit from 'components/canEmit';

const messageBus = function messageBusFunc() {
    const state = {};
    const canEmitState = canEmit(state);
    return Object.assign(state, canEmitState);
};
const messageBusObj = messageBus();
export default messageBusObj;
