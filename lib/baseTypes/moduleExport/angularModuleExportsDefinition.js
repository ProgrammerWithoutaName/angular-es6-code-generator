'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const moduleExportImplementationTemplate = require('./moduleExportImplementationTemplate');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');

function buildFile (options) {
    try {
        let fileDefinition = {
            parentModule: `./${filenameFormatter.module(options.parentModule.name)}`,
            moduleCodeName: codeNameBuilder.format(options.parentModule.name),
            fileLocation: options.fileLocation,
            imports: []
        };

        console.log(`components are ${options.components}`);
        options.components.forEach(component => {
            let importItem = {
                name: component.name,
                codeName: codeNameBuilder.format(component.name),
                relativeLocation: getComponentRelativeLocation(options.parentModule.file, component)
            };

            fileDefinition.imports.push(importItem);
        });

        let body = moduleExportImplementationTemplate.format(fileDefinition);

        let filename = filenameFormatter.moduleExport(options.parentModule.name);
        return fs.writeFile(path.join(options.fileLocation, filename), body);
    } catch (error) {
        console.log(error.stack);
    }
}

function getRelativeFolder (from, to) {
    return path.relative(path.dirname(from), path.dirname(to));
}

function getComponentFileName (component) {
    return filenameFormatter[component.type](component.name);
}

function getComponentRelativeLocation (from, component) {
    let relativeFolder = getRelativeFolder(from, component.file);

    let componentFilename = getComponentFileName(component);
    return `./${path.join(relativeFolder, componentFilename).replace(/\\/gi, '/')}`;
}

module.exports = { build: buildFile };