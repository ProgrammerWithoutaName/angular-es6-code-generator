'use strict';

const basicFunctionDefinition = require('./basicFunctionDefinition/basicFunctionDefinition');
const basicValueDefinition = require('./basicValueDefinition/basicValueDefinition');
const angularProviderDefinition = require('./angularProviderDefinition/angularProviderDefinition');
const angularModuleDefinition = require('./module/angularModuleDefinition');
const angularModuleExportDefinition = require('./moduleExport/angularModuleExportsDefinition');
const angularFilterDefinition = require('./angularFilterDefinition/angularFilterDefinition');
const angularConfigDefinition = require('./angularConfigDeclaration/angularConfigDefinition');

function buildFunctionFile(options, type) {
    return basicFunctionDefinition.build({
        parentModuleRelativeLocation: options.parentModuleRelativeLocation,
        parentModuleName: options.parentModuleName,
        name: options.name,
        dependencies: options.dependencies,
        functionImplementation: options.functionImplementation,
        filePath: options.filePath,
        type
    });
}

function buildValueFile(options, type) {
    return basicValueDefinition.build({
        parentModuleRelativeLocation: options.parentModuleRelativeLocation,
        parentModuleName: options.parentModuleName,
        name: options.name,
        valueDefinition: options.valueImplementation,
        filePath: options.filePath,
        type
    });
}

module.exports = {
    buildFunctionFile,
    buildValueFile,
    buildProviderFile: angularProviderDefinition.build,
    buildModuleFile: angularModuleDefinition.build,
    buildModuleExportFile: angularModuleExportDefinition.build,
    buildFilterFile: angularFilterDefinition.build,
    buildConfigFile: angularConfigDefinition.build
};