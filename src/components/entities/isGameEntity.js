import getUUID from 'utils/getUUID';

const isGameEntity = function isGameEntityFunc(state) {
    function printInfo() {
        console.log(`id: %c${state.id}`, 'color: yellow');
    }

    function update() {}

    return {
        // props
        id: getUUID(),
        // methods
        printInfo,
        update,
    };
};

export default isGameEntity;
