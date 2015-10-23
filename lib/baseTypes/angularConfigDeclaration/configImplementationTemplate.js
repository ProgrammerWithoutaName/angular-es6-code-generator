'use strict';

const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;

function format(options) {
    let dependenciesFormatOptions = {
        parentModuleName: options.parentModuleName,
        dependencies: options.dependencies,
        accessName: 'parentModule',
        indent: 1
    };

    return `'use strict';
import parentModule from '${options.parentModule}';

${options.source}
${options.functionName}.$inject = [
    ${formatDependencies(dependenciesFormatOptions)}
];

parentModule.module.${options.type}(${options.functionName});`;
}

module.exports = { format };