import getUUID from 'utils/getUUID';

const isGameEntity = function isGameEntityFunc(state) {
    function printInfo() {
        console.log(`id: %c${state.id}`, 'color: yellow');
    }

    return {
        // props
        id: getUUID(),
        // methods
        printInfo,
    };
};

export default isGameEntity;
