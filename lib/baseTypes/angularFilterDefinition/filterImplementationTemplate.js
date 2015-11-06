'use strict';
const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;
const importStatements = require('../implementationTemplateHelpers/importStatements');

function format(options) {
    console.log('creating filter ' + options.functionName);
    let dependenciesFormatOptions = {
        parentModuleName: options.parentModuleName,
        dependencies: options.dependencies,
        accessName: 'parentModule',
        indent: 1
    };

    return `'use strict';
${importStatements.formatParentModuleImportStatement(options.parentModuleRelativeLocation)}
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