'use strict';
const codeStyleHandlers = new Map();

function updateCodeStyleHandlers () {
    for (let codeStyleHandlerDefinition of codeStyleHandlers.values) {
        if (codeStyleHandlerDefinition.onUpdate) { 
            codeStyleHandlerDefinition.onUpdate(); 
        }
    }
}

module.exports = {
    updateCodeStyleHandlers,
    registerCodeStyleHandler: (codeStyleHandlerDefinition) => codeStyleHandlers.set(codeStyleHandlerDefinition.type, codeStyleHandlerDefinition),
    getCodeStyleHandlerFor: (type) => {
        let handlerDefinition = (codeStyleHandlers.get(type) || {});
        return handlerDefinition.codeStyleHandler;
    }
};