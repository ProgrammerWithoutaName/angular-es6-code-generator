'use strict';
const expressionTypes = require('../expressionTypes');
const expressionReflection = require('../expressionReflection');

const injectionNameVariations = {
    [expressionTypes.classType] : (oldName, newName, source) => {
        let replaceRegex = new RegExp(`^class( +)${oldName}`, 'g');
        return source.replace(replaceRegex, `class ${newName}`);
    },
    [expressionTypes.functionType]: (oldName, newName, source) => {
        let replaceRegex = new RegExp(`^function( +)${oldName}`, 'g');
        return source.replace(replaceRegex, `function ${newName}`);
    }
};

function replaceName (name, source, expressionValue) {
    expressionValue = expressionValue || expressionReflection.getBasicExpressionValues(source);
    let transform = injectionNameVariations[expressionValue.type];

    if (transform === undefined) {
        throw `given expression is a ${expressionValue.type} and cannot be named.`;
    } else if (!expressionValue.name) {
        throw `no name to replace in given expression ${expressionValue.type}`;
    }

    return transform(expressionValue.name, name, source);
}

module.exports = { transform: replaceName };