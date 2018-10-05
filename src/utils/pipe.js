const pipe = function pipeFunc(...fns) {
    const emptyFunc = v => v;
    return initialVal => fns.reduce((val, fn) => (fn ? fn(val) : emptyFunc(val)), initialVal);
};

export default pipe;
