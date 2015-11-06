'use strict';
const importStatements = require('../implementationTemplateHelpers/importStatements');

function formatImplementation (options) {
    return `'use strict';
import moduleDefinition from '${importStatements.formatFileLocation(options.parentModule)}';
import moduleBuilder from 'angular-module-builder';
${importStatements.formatBasicImportStatement(options.imports)}

let ${options.moduleCodeName} = new moduleBuilder.ModuleBuilder(moduleDefinition);

export default ${options.moduleCodeName};
`;
}

module.exports = { format: formatImplementation };
