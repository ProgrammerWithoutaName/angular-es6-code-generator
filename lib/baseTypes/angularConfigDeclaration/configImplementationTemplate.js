'use strict';
const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;
const indent = require('../../codeStyling/codeStyleContext').getCodeStyleHandlerFor('indent').create;

function format (options) {
    let dependenciesFormatOptions = {
        parentModuleName: options.parentModuleName,
        dependencies: options.dependencies,
        accessName: 'parentModule',
        indent: 1
    };

    return `'use strict';
import { imports, components } from '${options.parentModuleRelativeLocation}'

let componentDefinition;
componentDefinition = components.${options.codeName};
componentDefinition.type = componentDefinition.componentTypes.${options.type};
componentDefinition.implementation = ${options.functionName};
componentDefinition.dependencies = [
${indent(1)}${formatDependencies(dependenciesFormatOptions)}
];

${options.source}
`;
}

module.exports = { format };