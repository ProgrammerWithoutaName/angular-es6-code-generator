'use strict';
const importStatements = require('../implementationTemplateHelpers/importStatements');

function formatImplementation (options) {
    return `'use strict';
${importStatements.formatParentModuleImportStatement(options.parentModuleRelativeLocation)}
let implementationKey = parentModule.dependencyKeys.${options.name};
export default { implementation : implementationKey };

${options.source}

parentModule.module.provider(implementationKey, ${options.functionName});`;
}

module.exports = { format: formatImplementation };