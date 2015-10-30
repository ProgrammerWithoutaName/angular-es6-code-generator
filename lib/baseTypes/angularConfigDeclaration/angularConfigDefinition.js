'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const configImplementationTemplate = require('./configImplementationTemplate');
const functionDeclarationTemplate = require('../basicFunctionDefinition/functionDeclarationTemplate');
const changeIndent = require('../implementationTemplateHelpers/changeIndent');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');
const stringUtilities = require('../../stringUtilities');
const dependencyFactory = require('../../dependencyFactory');

function buildFile(options) {
    let fileDefinition = {
        parentModuleRelativeLocation: path.join(options.parentModuleRelativeLocation, filenameFormatter.module(options.parentModuleName)),
        name: options.name,
        parentModuleName: options.parentModuleName,
        dependencies: options.dependencies.map(dependencyFactory.build),
        functionImplementation: options.functionImplementation || function () { },
        type: options.type
    };

    let body = buildBody(fileDefinition);
    let filename = filenameFormatter[options.type](options.name);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

function buildBody(options) {
    // I need to : get the name, parentModule name, parentModule location, fileLocation, and function
    try {
        let source = buildSource(options);
        let formattedSource = changeIndent.deindentSource(source.source);
        return configImplementationTemplate.format({
            parentModuleRelativeLocation: options.parentModuleRelativeLocation,
            parentModuleName: options.parentModuleName,
            source: formattedSource.join('\n'),
            functionName: source.name,
            dependencies: options.dependencies,
            type: options.type
        });
    } catch (error) {
        console.log(`error building component ${options.name}`);
        console.log(`dependencies are: `);
        console.log(JSON.stringify(options.dependencies));
        console.log(error.stack);
    }

}

function buildSource(options) {
    return functionDeclarationTemplate.format({
        name: codeNameBuilder.format(options.name + stringUtilities.capitalizeFirstLetter(options.type)),
        baseFunction: options.functionImplementation
    });
}

module.exports = { build: buildFile };