'use strict';
const path = require('path');
const importStatements = require('../implementationTemplateHelpers/importStatements');
const filenameFormatter = require('../../angularFilenameFormatters');
const valueMaps = require('../implementationTemplateHelpers/valueMaps');
const indent = require('../implementationTemplateHelpers/indent').create;

function formatImplementation(options) {
    return `'use strict';
import angular from 'angular';
${renderImportStatements(options.imports)}

let moduleDefinition = angular.module('${options.moduleName}', [
    ${renderImportDependencyList(options.imports)}
]);

export default {
    name: moduleDefinition.name,
    module: moduleDefinition,
    dependencyKeys: {
        ${ createDependencyDeclaration(options.dependencyKeys, 2) }
    },
    imports: {
        ${ renderImportList(options.imports) }
    }
};`;
}

function renderImportStatements(imports) {
    let importStatementDefinitions = imports.map(importDefinition => ({
        codeName: importDefinition.codeName,
        relativeLocation: path.join(importDefinition.relativeLocation, filenameFormatter.moduleExport(importDefinition.codeName))
    }));
    return importStatements.format(importStatementDefinitions);
}

function renderImportDependencyList(imports) {
    /*
    if imports is [{name: 'fooModule'}, {name: 'thingModule'}, {name: 'otherModule'}] this will output
    --------------------------------
    fooModule.name,
        thingModule.name,
        otherModule.name
    ---------------------------------
        tab left out intentionally, this will not indent the first item.
     */
    let accessorDefinitions = imports.map(importItem => ({ name: importItem.codeName, value: [importItem.codeName, 'name']}));
    return valueMaps.createObjectCommaSeparatedList({
        values: accessorDefinitions,
        indent: 1,
        defaultType: valueMaps.valueTypes.accessor
    });
}

function renderImportList(imports) {
    /*
        given [{name: 'fooModule'}, {name: 'thingModule'}, {name: 'otherModule'}]
        Output should be
    ------------------
    fooModule: fooModule.exports,
            thingModule: thingModule.exports,
            otherModule: otherModule.exports
    ------------------
     */
    let definitions = imports.map(item => ({
        propertyName: item.codeName,
        value: [item.codeName, 'exports']
    }));
    let importList = '';
    if(definitions.length > 0) {
        importList = valueMaps.createObjectMap({valueDefinitions: definitions, indent: 2, defaultType: valueMaps.valueTypes.accessor});
    }
    return importList;
}

function createDependencyDeclaration(dependencyKeys, indent) {
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