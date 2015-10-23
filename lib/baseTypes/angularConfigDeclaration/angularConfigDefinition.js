'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const configImplementationTemplate = require('./configImplementationTemplate');
const functionDeclarationTemplate = require('../basicFunctionDefinition/functionDeclarationTemplate');
const changeIndent = require('../implementationTemplateHelpers/changeIndent');
const stringUtilities = require('../../stringUtilities');

function buildFile(options) {
    let fileDefinition = {
        parentModule: options.parentModuleRelativeLocation,
        name: options.name,
        parentModuleName: options.parentModuleName,
        dependencies: options.dependencies,
        functionImplementation: options.functionImplementation || function () { },
        type: options.type
    };

    let body = buildBody(fileDefinition);
    let filename = filenameFormatter[options.type](options.name);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

function buildBody(options) {
    // I need to : get the name, parentModule name, parentModule location, fileLocation, and function
    let source = buildSource(options);
    let formattedSource = changeIndent.deindentSource(source.source);
    return configImplementationTemplate.format({
        parentModule: options.parentModule,
        parentModuleName: options.parentModuleName,
        source: formattedSource.join('\n'),
        functionName: source.name,
        dependencies: options.dependencies,
        type: options.type
    });
}

function buildSource(options) {
    return functionDeclarationTemplate.format({
        name: options.name + stringUtilities.capitalizeFirstLetter(options.type),
        baseFunction: options.functionImplementation
    });
}

module.exports = { build: buildFile };