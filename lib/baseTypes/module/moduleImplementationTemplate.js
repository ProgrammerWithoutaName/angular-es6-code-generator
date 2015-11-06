'use strict';
const path = require('path');
const importStatements = require('../implementationTemplateHelpers/importStatements');
const filenameFormatter = require('../../angularFilenameFormatters');
const valueMaps = require('../implementationTemplateHelpers/valueMaps');
const indent = require('../implementationTemplateHelpers/indent').create;

function formatImplementation (options) {
    return `'use strict';
import moduleBuilder from 'angular-module-builder';
${renderImportStatements(options.imports)}

const moduleDefinition = new moduleBuilder.ModuleDefinition('${options.moduleName}');
moduleDefinition.setDependencies({
    ${ options.imports.map(importDefinition => importDefinition.codeName).join(`,\n${indent(2)}`)}
});

moduleDefinition.setComponents({
    ${ createDependencyDeclaration(options.dependencyKeys, 2) }
});

export default moduleDefinition;
export const components = moduleDefinition.components;
export const imports = moduleDefinition.imports;
`;
}

function renderImportStatements (imports) {
    let importStatementDefinitions = imports.map(importDefinition => ({
        codeName: importDefinition.codeName,
        relativeLocation: path.join(importDefinition.relativeLocation, filenameFormatter.moduleExport(importDefinition.codeName))
    }));
    return importStatements.format(importStatementDefinitions);
}

function createDependencyDeclaration (dependencyKeys, indent) {
    /*
     given ['fooFactory', 'barController', 'otherService']
     Output should be
     ------------------
     fooFactory: 'fooFactory',
        barController: 'barController',
        otherService: 'otherService'
     ------------------
     */
    let valueDefinitions = dependencyKeys.map(item => ({ propertyName: item.codeName, value: item.name}));
    return valueMaps.createObjectMap({
        valueDefinitions,
        indent: indent,
        defaultType: valueMaps.valueTypes.string
    });
}

module.exports = { format: formatImplementation };