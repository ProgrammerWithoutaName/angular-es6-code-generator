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
        let fileDefinition = {
            parentModule: options.parentModule.name,
            fileLocation: options.fileLocation,
            exports: [],
            filters: []
        };

        options.components.forEach(component => {
            let importItem = {
                name: component.name,
                codeName: codeNameBuilder.format(component.name),
                type: component.type
            };

            if (!nonExportComponents.has(importItem.type)) {
                fileDefinition.exports.push(importItem);
            }
            
            if (importItem.type === 'filter') {
                fileDefinition.filters.push(importItem);
            }
        });

        let body = requireFixTemplate.format(fileDefinition);

        let filename = filenameFormatter.moduleExport(options.parentModule.name);
        return fs.writeFile(path.join(options.fileLocation, filename), body);
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { build: buildFile };