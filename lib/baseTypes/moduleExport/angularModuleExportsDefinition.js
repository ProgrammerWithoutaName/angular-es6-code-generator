'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const moduleExportImplementationTemplate = require('./moduleExportImplementationTemplate');
const requireFixTemplate = require('./requireFixTemplate');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');

const nonExportComponents = new Set();
nonExportComponents.add('config');
nonExportComponents.add('run');
nonExportComponents.add('route');

function buildFile(options) {
    let fileDefinition = {
        parentModule: `./${filenameFormatter.module(options.parentModule.name)}`,
        fileLocation: options.fileLocation,
        imports: [],
        exports: [],
        filters: []
    };

    options.components.forEach(component => {
        let importItem = {
            name: component.name,
            codeName: codeNameBuilder.format(component.name),
            relativeLocation: getComponentRelativeLocation(options.parentModule.file, component)
        };

        fileDefinition.imports.push(importItem);

        if(!nonExportComponents.has(component.type)) {
            fileDefinition.exports.push(importItem);
            if(component.type === 'filter') {
                fileDefinition.filters.push(importItem);
            }
        }
    });

    let body;
    if(options.requireFix) {
        body = requireFixTemplate.format(fileDefinition);
    } else {
        body = moduleExportImplementationTemplate.format(fileDefinition);
    }

    let filename = filenameFormatter.moduleExport(options.parentModule.name);
    return fs.writeFile(path.join(options.fileLocation, filename), body);
}

function getRelativeFolder(from, to) {
    return path.relative(path.dirname(from), path.dirname(to));
}

function getComponentFileName(component) {
    return filenameFormatter[component.type](component.name);
}

function getComponentRelativeLocation(from, component) {
    let relativeFolder = getRelativeFolder(from, component.file);

    let componentFilename = getComponentFileName(component);
    return `./${path.join(relativeFolder, componentFilename).replace(/\\/gi,'/')}`;
}

module.exports = { build: buildFile };