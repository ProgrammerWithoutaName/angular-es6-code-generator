'use strict';
const path = require('path');
const importStatements = require('../implementationTemplateHelpers/importStatements');
const filenameFormatter = require('../../angularFilenameFormatters');
const valueMaps = require('../implementationTemplateHelpers/valueMaps');
const indent = require('../../codeStyling/codeStyleContext').getCodeStyleHandlerFor('indent').create;

function formatImplementation (options) {
    return `'use strict';
import moduleBuilder from 'angular-module-builder';
${renderImportStatements(options.imports)}

const moduleDefinition = new moduleBuilder.ModuleDefinition('${options.moduleName}');
moduleDefinition.setDependencies({
${indent(1)}${ options.imports.map(importDefinition => importDefinition.codeName).join(`,\n${indent(1)}`)}
});

moduleDefinition.setComponents({
${indent(1)}${ createDependencyDeclaration(options.dependencyKeys, 1) }
});

export default moduleDefinition;
export const components = moduleDefinition.components;
export const imports = moduleDefinition.imports;
`;
}

function renderImportStatements (imports) {

    let importModules = importStatements.getImportModules(imports);
    let importStatementDefinitions = importModules.map(importDefinition => ({
        codeName: importDefinition.codeName,
        relativeLocation: path.join(importDefinition.relativeLocation, filenameFormatter.moduleExport(importDefinition.name))
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