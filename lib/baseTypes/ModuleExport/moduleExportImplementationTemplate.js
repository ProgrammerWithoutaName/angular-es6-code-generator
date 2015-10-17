'use strict';

const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;
const formatImportStatements = require('../implementationTemplateHelpers/importStatements').format;
const formantNameMap = require('../implementationTemplateHelpers/nameMapDeclaration').format;
const
const indent = require('../implementationTemplateHelpers/indent').create;

function formatImplementation(options) {
    return `'use strict';
import parentModule from '${options.parentModule}';
${formatImportStatements(options.exports)}

export default {
    name: moduleDefinition.name,
    module: moduleDefinition,
    exports: {
        ${ renderExportList(options.exports) }
    }
};`;
}

function renderExportList(exports) {
    let exportValues = exports.map(item => `${item.name}: ${item.name}.implementation`);
    return exportValues.join(',\n' + indent(2));
}

module.exports = { format: formatImplementation };