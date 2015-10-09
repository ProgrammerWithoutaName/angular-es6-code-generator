'use strict';
const expressionTypes = require('../expressionTypes');
const expressionReflection = require('../expressionReflection');

const injectionNameVariations = {
    [expressionTypes.classType] : (name, source) => source.replace(/^class /g, `class ${name}`),
    [expressionTypes.functionType]: (name, source) => source.replace(/^function /g, `function ${name}`)
};

function injectName (name, source, expressionValue) {
    expressionValue = expressionValue || expressionReflection.getBasicExpressionValues(source);
    let transform = injectionNameVariations[expressionValue.type];

    if (transform === undefined) {
       throw `given expression is a ${expressionValue.type} and cannot be named.`;
    } else if (expressionValue.name) {
        throw `given expression ${expressionValue.type} already has a name of ${expressionValue.name}`
    }

    return transform(name, source);
}

module.exports = { transform: injectName };