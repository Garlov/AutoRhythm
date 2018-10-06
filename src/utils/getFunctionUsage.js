import devConfig from 'configs/devConfig';

const alreadyLogged = [];

/* eslint-disable */
const updateFunctionUsage = function updateFunctionUsageFunc(name, state, functionMap) {
    for (const fun in state) {
        if (functionMap.has(fun)) {
            functionMap.get(fun).push({ name });
        } else {
            functionMap.set(fun, [{ name }]);
        }
    }
};

const isInFilter = function isInFilterFunc(COMPOSITION_INFO, val, source) {
    let isInFilter = true;
    if (COMPOSITION_INFO.ENABLE_FILTER) {
        isInFilter = false;
        if (COMPOSITION_INFO.FILTER) {
            COMPOSITION_INFO.FILTER.every(f => {
                if (val.find(s => s.name === f)) {
                    isInFilter = true;
                    return false;
                }
                return true;
            });
        }
    }
    let inFactoryFilter = true;
    if (COMPOSITION_INFO.ENABLE_FACTORY_FILTER) {
        inFactoryFilter = false;
        if (COMPOSITION_INFO.FACTORY_FILTER) {
            inFactoryFilter = COMPOSITION_INFO.FACTORY_FILTER.some(ff => ff === source);
        }
    }
    return isInFilter && inFactoryFilter;
};

const getFunctionUsage = function getFunctionUsageFunc(states, source) {
    if (alreadyLogged.find(l => l === source)) {
        return;
    }
    alreadyLogged.push(source);
    if (devConfig && devConfig.COMPOSITION_INFO && devConfig.COMPOSITION_INFO.ENABLE) {
        const { COMPOSITION_INFO } = devConfig;
        // map all states
        const functionMap = new Map();
        states.forEach(s => {
            updateFunctionUsage(s.name, s.state, functionMap);
        });

        // print info
        functionMap.forEach((val, key, map) => {
            let inFilter = isInFilter(COMPOSITION_INFO, val, source);
            if (inFilter && val.length > 1) {
                console.log(
                    `%c${source} %cneeds to pipe %c${key} %c=>${val.reduce((acc, curr) => `${acc} ${curr.name},`, '')}`,
                    'color: yellow',
                    'color: inherits',
                    'color: yellow',
                    'color: inherits'
                );
            }
        });
    }
};

export default getFunctionUsage;
