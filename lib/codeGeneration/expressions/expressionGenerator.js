'use strict';
const expressionTypes = require('./expressionTypes');
let baseMap;

//expects map
function build(exclusions) {
    const expressionGenerator = buildExpressionGeneratorMap(exclusions);
    baseMap.forEach(expressionType => expressionGenerator.add(expressionType.name, expressionType.fileLocation));
    return expressionGenerator;
}

function buildExpressionGeneratorMap(exclusions) {
    const expressionGenerator = new Map();
    return {
        expressionGenerator,
        add: (key, value) => {
            if(exclusions.has(key)) {
                expressionGenerator.add(key, exclusions.get(key));
            } else {
                expressionGenerator.add(key, require(value).create);
            }
        }
    };
}

baseMap = [
    { name: expressionTypes.arrayExpression, fileLocation: './arrayExpression.js' },
    { name: expressionTypes.arrowFunctionExpression, fileLocation: './arrowFunctionExpression.js' },
    { name: expressionTypes.assignmentExpression, fileLocation: './assignmentExpression.js' },
    { name: expressionTypes.binaryExpression, fileLocation: './binaryExpression.js' },
    { name: expressionTypes.callExpression, fileLocation: './callExpression.js' },
    { name: expressionTypes.classExpression, fileLocation: './classExpression.js' },
    { name: expressionTypes.conditionalExpression, fileLocation: './conditionalExpression.js' },
    { name: expressionTypes.functionExpression, fileLocation: './functionExpression.js' },
    { name: expressionTypes.literal, fileLocation: './literal.js' },
    { name: expressionTypes.logicalExpression, fileLocation: './logicalExpression.js' },
    { name: expressionTypes.memberExpression, fileLocation: './memberExpression.js' },
    { name: expressionTypes.newExpression, fileLocation: './newExpression.js' },
    { name: expressionTypes.objectExpression, fileLocation: './objectExpression.js' },
    { name: expressionTypes.property, fileLocation: './property.js' },
    { name: expressionTypes.sequenceExpression, fileLocation: './sequenceExpression.js' },
    { name: expressionTypes.taggedTemplateExpression, fileLocation: './taggedTemplateExpression.js' },
    { name: expressionTypes.thisExpression, fileLocation: './thisExpression.js' },
    { name: expressionTypes.unaryExpression, fileLocation: './unaryExpression.js' },
    { name: expressionTypes.updateExpression, fileLocation: './updateExpression.js' },
    { name: expressionTypes.spreadElement, fileLocation: './spreadElement.js' },
    { name: expressionTypes.yieldExpression, fileLocation: './yieldExpression.js' },
    { name: expressionTypes.identifier, fileLocation: '../identifierGenerator.js' },
    { name: expressionTypes.objectPattern, fileLocation: '../patterns/objectPattern.js' },
    { name: expressionTypes.assignmentPattern, fileLocation: '../patterns/assignmentPattern.js' },
    { name: expressionTypes.arrayPattern, fileLocation: '../patterns/arrayPattern.js' },
    { name: expressionTypes.restElement, fileLocation: '../patterns/restElement.js' }
];

module.exports = { build };
