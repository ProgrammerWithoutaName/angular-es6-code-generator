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
let implementationKey = parentModule.dependencyKeys.${options.name};
export default {
    implementation : implementationKey + 'Filter',
    filterName: implementationKey
};

${options.source}
${options.functionName}.$inject = [
    ${formatDependencies(dependenciesFormatOptions)}
];

parentModule.module.filter(implementationKey, ${options.functionName});`;
}

module.exports = { format };