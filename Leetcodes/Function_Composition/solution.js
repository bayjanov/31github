var compose = function (functions) {
    functions = functions.reverse();

    const functionComposition = ((elem) => {
        if (functions.length === 0) {
            return elem;
        }
        
        for (let i = 0; i < functions.length; i++) {
            elem = functions[i](elem);
        }
        return elem
    });

    return functionComposition;
};
