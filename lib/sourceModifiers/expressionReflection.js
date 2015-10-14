'use strict';'use strict';

function formatConstantImplementation(options) {
    return `'use strict';

import parentModule from '${options.parentModule}';
let implementationKey = parentModule.dependencyKeys.${options.constantName};
export default { implementation : implementationKey };

let value = ${options.constantValueDefinition};

parentModule.module.constant(implementationKey, value);`;
}


module.exports = { format: formatConstantImplementation};
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