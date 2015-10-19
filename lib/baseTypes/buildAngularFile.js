'use strict';

const basicFunctionDefinition = require('./angularFilterDefinition/basicFunctionDefinition');
const basicValueDefinition = require('./basicValueDefinition/basicValueDefinition');
const angularProviderDefinition = require('./angularProviderDefinition/angularProviderDefinition');
const angularModuleDefinition = require('./module/angularModuleDefinition');
const angularModuleExportDefinition = require('./moduleExport/angularModuleExportsDefinition');
const angularFilterDefinition = require('./angularFilterDefinition/angularFilterDefinition');

function buildFunctionFile(options, type) {
    return basicFunctionDefinition.build({
        parentModuleRelativeLocation: options.parentModuleRelativeLocation,
        name: options.name,
        dependencies: options.dependencies,
        functionImplementation: options.functionImplementation,
        filePath: options.filePath,
        type
    });
}

function buildValueFile(options, type) {
    return basicValueDefinition.build({
        parentModule: options.parentModule,
        name: options.name,
        valueDefinition: options.valueDefinition,
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
    buildFilterFile: angularFilterDefinition.build
};