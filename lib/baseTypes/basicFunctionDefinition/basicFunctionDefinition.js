'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const expressionNameModifier = require('../../sourceModifiers/expressionNameModifier');
const functionImplementationTemplate = require('./functionImplementationTemplate');
const functionDeclarationTemplate = require('./functionDeclarationTemplate');

const needsTypeDefinition = new Set(['controller', 'service', 'provider']);

function buildFile(options) {
    let fileDefinition = {
        parentModule: options.parentModuleRelativeLocation,
        parentModuleName: options.parentModuleName,
        name: options.name,
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
    return functionImplementationTemplate.format({
        parentModule: options.parentModule,
        parentModuleName: options.parentModuleName,
        name: options.name,
        source: source.source,
        functionName: source.name,
        dependencies: options.dependencies,
        type: options.type
    });
}

function buildSource(options) {
    if(needsTypeDefinition.has(options.type)) {
        return expressionNameModifier.makeIntoTypeDefinition(options.name, options.functionImplementation);
    } else {
        return functionDeclarationTemplate.format({
            name: options.name,
            baseFunction: options.functionImplementation
        });
    }
}

module.exports = { build: buildFile };