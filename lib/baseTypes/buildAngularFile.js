'use strict';

const basicFunctionDefinition = require('./basicFunctionDefinition/basicFunctionDefinition');
const basicValueDefinition = require('./basicValueDefinition/basicValueDefinition');
const angularProviderDefinition = require('./angularProviderDefinition/angularProviderDefinition');

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
    buildProviderFile: angularProviderDefinition.build
};