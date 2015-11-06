'use strict';

const basicFunctionDefinition = require('./basicFunctionDefinition/basicFunctionDefinition');
const basicValueDefinition = require('./basicValueDefinition/basicValueDefinition');
const angularModuleDefinition = require('./module/angularModuleDefinition');
const angularModuleExportDefinition = require('./moduleExport/angularModuleExportsDefinition');
const angularExternalModuleExportDefinition = require('./externalModuleExport/angularExternalModuleExportsDefinition');

function buildFunctionFile (options, type) {
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

function buildValueFile (options, type) {
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
    buildModuleFile: angularModuleDefinition.build,
    buildModuleExportFile: angularModuleExportDefinition.build,
    buildExternalModuleExportFile: angularExternalModuleExportDefinition.build
};