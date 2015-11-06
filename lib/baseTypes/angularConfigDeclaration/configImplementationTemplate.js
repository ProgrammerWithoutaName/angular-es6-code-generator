'use strict';

const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;
const importStatements = require('../implementationTemplateHelpers/importStatements');

function format(options) {
    let dependenciesFormatOptions = {
        parentModuleName: options.parentModuleName,
        dependencies: options.dependencies,
        accessName: 'parentModule',
        indent: 1
    };

    return `'use strict';
${importStatements.formatParentModuleImportStatement(options.parentModuleRelativeLocation)}

${options.source}

${options.functionName}.$inject = [
    ${formatDependencies(dependenciesFormatOptions)}
];

parentModule.module.${options.type}(${options.functionName});`;
}

module.exports = { format };