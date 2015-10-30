'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const filterImplementationTemplate = require('./filterImplementationTemplate');
const functionDeclarationTemplate = require('../basicFunctionDefinition/functionDeclarationTemplate');
const changeIndent = require('../implementationTemplateHelpers/changeIndent');
const dependencyFactory = require('../../dependencyFactory');

function buildFile(options) {
    console.log('filter ' + options.name);
    let fileDefinition = {
        parentModuleRelativeLocation: path.join(options.parentModuleRelativeLocation, filenameFormatter.module(options.parentModuleName)),
        parentModuleName: options.parentModuleName,
        name: options.name,
        dependencies: options.dependencies.map(dependencyFactory.build),
        functionImplementation: options.functionImplementation || function () { },
        type: 'filter'
    };

    try {
        let body = buildBody(fileDefinition);
        let filename = filenameFormatter.filter(options.name);

        console.log('writing filter ' + options.name);
        return fs.writeFile(path.join(options.filePath, filename), body);
    }
    catch(error) {
        console.log(options.parentModuleName);
        console.log(error.stack);
    }

}

function buildBody(options) {
    // I need to : get the name, parentModule name, parentModule location, fileLocation, and function
    let sourceValues = functionDeclarationTemplate.format({
        name: options.name,
        baseFunction: options.functionImplementation
    });

    let formattedSource = changeIndent.deindentSource(sourceValues.source);

    return filterImplementationTemplate.format({
        parentModuleRelativeLocation: options.parentModuleRelativeLocation,
        parentModuleName: options.parentModuleName,
        name: options.name,
        source: formattedSource.join('\n'),
        functionName: sourceValues.name,
        dependencies: options.dependencies
    });
}

module.exports = { build: buildFile };