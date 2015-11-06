'use strict';
const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;

function format (options) {
    console.log('creating filter ' + options.functionName);
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
componentDefinition.type = componentDefinition.componentTypes.filter;
componentDefinition.implementation = ${options.functionName};
componentDefinition.dependencies = [
    ${formatDependencies(dependenciesFormatOptions)}
];

${options.source}
`;
}

module.exports = { format };