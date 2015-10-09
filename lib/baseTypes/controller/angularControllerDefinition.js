'use strict';

const fs = require('fs-promise');
const path = require('path');
const controllerFilenameFormatter = require('../../angularFilenameFormatters').controller;
const expressionNameModifier = require('../../sourceModifiers/expressionNameModifier');

function buildControllerFile(options) {
    let fileDefinition = {
        parentModule: options.parentModuleRelativeLocation,
        controllerName: options.controllerName,
        controllerDependencies: options.controllerDependencies,
        constantValueDefinition: options.controllerFunction || function () { }
    };

    let controllerBody = buildControllerBody(fileDefinition);
    let controllerFileName = controllerFilenameFormatter(options.controllerName);
    return fs.writeFile(path.join(options.controllerFilePath, controllerFileName), controllerBody);
}


function buildControllerBody(options) {
    // I need to : get the name, parentModule name, parentModule location, fileLocation, and function
    let controllerFunctionSource = expressionNameModifier.makeIntoTypeDefinition(options.controllerName, options.controllerFunction);
    return createControllerFunction({
        parentModule: options.parentModule,
        controllerName: options.controllerName,
        controllerSource: controllerFunctionSource.source,
        controllerFunctionName: controllerFunctionSource.name,
        controllerDependencies: options.controllerDependencies
    });
}

function createControllerFunction(options) {
    return `'use strict;
import parentModule from '${options.parentModule}';
let implementationKey = parentModule.dependencyKeys.${options.controllerName};
export default { implementation : implementationKey };

${options.controllerSource}
${options.controllerFunctionName}.$inject = [${buildControllerDependencyString(options.controllerDependencies)}];
parentModule.module.constant(implementationKey, value);`;
}

function buildControllerDependencyString(controllerDependencies) {
    return controllerDependencies.map(dependency => `'${dependency}'`).join(', ');
}

module.exports = { build: buildControllerFile };

