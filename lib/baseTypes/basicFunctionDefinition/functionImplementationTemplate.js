'use strict';

const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;
const importStatements = require('../implementationTemplateHelpers/importStatements');

function format(options) {
    let dependenciesFormatOptions = {
        parentModuleName: options.parentModuleName,
        name: options.name,
        dependencies: options.dependencies,
        accessName: 'parentModule',
        indent: 1
    };

    return `'use strict';
${importStatements.formatParentModuleImportStatement(options.parentModuleRelativeLocation)}
let implementationKey = parentModule.dependencyKeys.${options.name};
export default { implementation : implementationKey };

${options.source}

${options.functionName}.$inject = [
    ${formatDependencies(dependenciesFormatOptions)}
];

parentModule.${options.type}(implementationKey, ${options.functionName});`;
}

module.exports = { format };