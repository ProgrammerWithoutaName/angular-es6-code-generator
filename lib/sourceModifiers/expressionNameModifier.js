'use strict';

const stringUtilities = require('../stringUtilities');
const injectName = require('./expressionNameModifiers/injectName');
const replaceName = require('./expressionNameModifiers/replaceName');
const expressionReflection = require('./expressionReflection');
const expressionTypes = require('./expressionTypes');
const esprima = require('esprima');

const allowedNamedExpressionTypes = new Set([expressionTypes.classType, expressionTypes.functionType]);

let expressionNameModifier = { getName, setName,  makeIntoTypeDefinition };

function getName (source, expressionValue) {
    expressionValue = expressionValue || expressionReflection.getBasicExpressionValues(source);
    return allowedNamedExpressionTypes.has(expressionValue.type) ? expressionValue.name : undefined;
}

function setName(name, source, expressionValue) {
    expressionValue = expressionValue || expressionReflection.getBasicExpressionValues(source);

    if(allowedNamedExpressionTypes.has(expressionValue.type)) {
        let transform = expressionValue.name ? replaceName.transform : injectName.transform;
        return transform(name, source, expressionValue);
    }
    throw 'given expression cannot be named';
}

function makeIntoTypeDefinition(name, expression, expressionValue) {
    let typeSource = expression.toString();
    let newName = stringUtilities.capitalizeFirstLetter(name);
    let source = expressionNameModifier.setName(newName, typeSource, expressionValue);
    return {
        name: newName,
        source
    };
}

module.exports = expressionNameModifier;