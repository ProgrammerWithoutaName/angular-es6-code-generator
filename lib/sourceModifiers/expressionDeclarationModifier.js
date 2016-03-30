'use strict';
const expressionNameModifier = require('./expressionNameModifier');

function buildExpressionDeclaration (options) {
    let source = options.baseFunction.toString();
    let name = expressionNameModifier.getName(source);
    let declaration = options.assignTo || `let ${name}`;
    if(!name) {
        name = options.alternateName;
        source = `${declaration} = ${source};`;
    }
    return { name, source };
}

module.exports = { buildExpressionDeclaration };