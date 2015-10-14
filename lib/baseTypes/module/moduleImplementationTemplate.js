'use strict';

const formatDependencies = require('../implementationTemplateHelpers/dependencyDeclarations').format;
const formatImportStatements = require('../implementationTemplateHelpers/importStatements').format;
const formantNameMap = require('../implementationTemplateHelpers/nameMapDeclaration').format;
const indent = require('../implementationTemplateHelpers/indent').create;

function formatImplementation(options) {
    return `'use strict';
import angular from 'angular';
${formatImportStatements(options.imports)}

let moduleDefinition = angular.module('${options.moduleName}', [
    ${renderImportDependencyList(options.imports)}
]);

export default {
    name: moduleDefinition.name,
    module: moduleDefinition,
    dependencyKeys: {
        ${ formantNameMap(options.dependencyKeys, 2) }
    },
    imports: {
        ${ renderImportList(options.imports) }
    }
};`;
}

function renderImportDependencyList(imports) {
    let importValues = imports.map(importItem => `${importItem.name}.name`);
    return importValues.join(',\n' + indent(1));
}

function renderImportList(imports) {
    let importValues = imports.map(importItem => `${importItem.name}: ${importItem.name}.exports`);
    return importValues.join(',\n' + indent(2));
}

function getImportAccess(imports, property) {
    return imports.map(importItem => `${importItem.name}.${property}`);
}


module.exports = { format: formatImplementation };