'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const requireFixTemplate = require('./requireFixTemplate');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');

const nonExportComponents = new Set();
nonExportComponents.add('config');
nonExportComponents.add('run');
nonExportComponents.add('route');

function buildFile (options) {
    try {
        if (options.parentModule.tags.collapseDependencyKey) {
            return buildCollapsedExportFile(options);
        } else {
            return buildBasicExportFile(options);
        }

    } catch (error) {
        console.log(error.stack);
    }
}

function buildCollapsedExportFile (options) {
    if (options.parentModule.tags.collapseDependencyKey !== options.parentModule.name) {
        console.log(`skipping writing collapse module ${options.parentModule.name}, components will be in ${options.parentModule.tags.collapseDependencyKey}`);
        return Promise.resolve(true);
    }

    options.components = options.dependencyTree.collapsedModules.get(options.parentModule.name).components;
    return buildBasicExportFile(options);
}

function buildBasicExportFile (options) {
    let fileDefinition = buildFileDefinition(options);

    let fileDefinitionExports = buildFileDefinitionExports(options.components);

    fileDefinition.exports = fileDefinitionExports.exports;
    fileDefinition.filters = fileDefinitionExports.filters;

    let body = requireFixTemplate.format(fileDefinition);

    let filename = filenameFormatter.moduleExport(options.parentModule.name);
    return fs.writeFile(path.join(options.fileLocation, filename), body);
}

function buildFileDefinition (options) {
    return {
        parentModule: options.parentModule.name,
        fileLocation: options.fileLocation,
        exports: [],
        filters: []
    };
}

function buildFileDefinitionExports (components) {
    let fileDefinitionExports = { exports: [], filters: []};
    components.forEach(component => {
        let importItem = {
            name: component.name,
            codeName: codeNameBuilder.format(component.name),
            type: component.type
        };

        if (!nonExportComponents.has(importItem.type)) {
            fileDefinitionExports.exports.push(importItem);
        }

        if (importItem.type === 'filter') {
            fileDefinitionExports.filters.push(importItem);
        }
    });
    return fileDefinitionExports;
}

module.exports = { build: buildFile };