'use strict';

const fs = require('fs-promise');
const path = require('path');
const moduleExportFilenameFormatter = require('../../angularFilenameFormatters').moduleExport;
const moduleExportImplementationTemplate = require('./moduleExportImplementationTemplate');

const nonExportComponents = new Set();
nonExportComponents.add('config');
nonExportComponents.add('run');
nonExportComponents.add('route');

function buildFile(options) {
    let fileDefinition = {
        parentModule: options.parentModule,
        fileLocation: options.fileLocation,
        components: options.components,
        exports: [],
        filters: []
    };

    options.components.forEach(component => {
        if(!nonExportComponents.has(component.type)) {
            fileDefinition.exports.push(component);
            if(component.type === 'filter') {
                fileDefinition.filters.push(component);
            }
        }
    });
    let body = moduleExportImplementationTemplate.format(fileDefinition);
    let filename = moduleExportFilenameFormatter(options.moduleName);
    return fs.writeFile(path.join(options.fileLocation, filename), body);
}

module.exports = { build: buildFile };