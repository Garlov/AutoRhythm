import canEmit from 'components/canListen';

const messageBus = function messageBusFunc() {
    const state = {};
    const canEmitState = canEmit();
    return Object.assign(state, canEmitState);
};
const messageBusObj = messageBus();
export default messageBusObj;
