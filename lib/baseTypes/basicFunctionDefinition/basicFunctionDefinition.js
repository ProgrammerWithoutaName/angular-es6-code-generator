'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const expressionNameModifier = require('../../sourceModifiers/expressionNameModifier');
const functionImplementationTemplate = require('./functionImplementationTemplate');
const functionDeclarationTemplate = require('./functionDeclarationTemplate');
const changeIndent = require('../implementationTemplateHelpers/changeIndent');
const dependencyFactory = require('../../dependencyFactory');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');

const needsTypeDefinition = new Set(['controller', 'service', 'provider']);

function buildFile (options) {
    let fileDefinition = {
        parentModuleRelativeLocation: path.join(options.parentModuleRelativeLocation, filenameFormatter.module(options.parentModuleName)),
        parentModuleName: options.parentModuleName,
        name: options.name,
        codeName: codeNameBuilder.format(options.name),
        dependencies: options.dependencies.map(dependencyFactory.build),
        functionImplementation: options.functionImplementation || function () { },
        type: options.type
    };

    let body = buildBody(fileDefinition);
    let filename = filenameFormatter[options.type](options.name);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

function buildBody (options) {
    // I need to : get the name, parentModule name, parentModule location, fileLocation, and function
    let source = buildSource(options);
    let formattedSource = changeIndent.deindentSource(source.source);

    return functionImplementationTemplate.format({
        parentModuleName: options.parentModuleName,
        parentModuleRelativeLocation: options.parentModuleRelativeLocation,
        name: options.name,
        codeName: options.codeName,
        source: formattedSource.join('\n'),
        functionName: source.name,
        dependencies: options.dependencies,
        type: options.type
    });
}

function buildSource (options) {
    if (needsTypeDefinition.has(options.type)) {
        return expressionNameModifier.makeIntoTypeDefinition(options.name, options.functionImplementation);
    } else {
        return functionDeclarationTemplate.format({
            name: options.name,
            baseFunction: options.functionImplementation
        });
    }
}

module.exports = { build: buildFile };