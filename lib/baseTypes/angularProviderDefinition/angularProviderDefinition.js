'use strict';

const fs = require('fs-promise');
const path = require('path');
const providerFilenameFormatter = require('../../angularFilenameFormatters').provider;
const expressionNameModifier = require('../../sourceModifiers/expressionNameModifier');
const providerImplementationTemplate = require('./providerImplementationTemplate');
const filenameFormatter = require('../../angularFilenameFormatters');

function buildFile(options) {
    let fileDefinition = {
        parentModuleRelativeLocation: path.join(options.parentModuleRelativeLocation, filenameFormatter.module(options.parentModuleName)),
        parentModuleName: options.parentModuleName,
        name: options.name,
        functionImplementation: options.functionImplementation || function () { }
    };

    let body = buildBody(fileDefinition);
    let filename = providerFilenameFormatter(options.name);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

function buildBody(options) {
    let source = expressionNameModifier.makeIntoTypeDefinition(options.name, options.functionImplementation);
    return providerImplementationTemplate.format({
        parentModule: options.parentModule,
        parentModuleName: options.parentModuleName,
        name: options.name,
        source: source.source,
        functionName: source.name
    });
}

module.exports = { build: buildFile };