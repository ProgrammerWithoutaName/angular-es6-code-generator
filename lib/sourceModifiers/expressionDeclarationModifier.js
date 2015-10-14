'use strict';
const expressionNameModifier = require('./expressionNameModifier');

function buildExpressionDeclaration(options) {
    let source = options.baseFunction.toString();
    let name = expressionNameModifier.getName(source);
    if(!name) {
        name = options.alternateName;
        source = `let ${name} = ${source};`;
    }
    return { name, source };
}

module.exports = { buildExpressionDeclaration };