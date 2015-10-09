'use strict';
const esprima = require('esprima');

let expressionReflection = { getParsedSyntaxTree, getExpressionValue, getBasicExpressionValues };

function getParsedSyntaxTree(source) {
    let alteredSource = `var inspectedFunction = ${source};`;
    return esprima.parse(alteredSource);
}

function getExpressionValue(source) {
    let syntaxTree = expressionReflection.getParsedSyntaxTree(source);
    return syntaxTree.body[0].declarations[0].init;
}

function getBasicExpressionValues(source) {
    let expression = expressionReflection.getExpressionValue(source);
    return {
        name: expression.id ? expression.id.name : undefined,
        type: expression.type
    };
}

module.exports = expressionReflection;