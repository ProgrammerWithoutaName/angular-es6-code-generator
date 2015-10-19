'use strict';

const fs = require('fs-promise');
const path = require('path');
const moduleExportFilenameFormatter = require('../../angularFilenameFormatters').moduleExport;
const moduleExportImplementationTemplate = require('./moduleExportImplementationTemplate');

function buildFile(options) {
    let fileDefinition = {
        parentModule: options.parentModule,
        fileLocation: options.fileLocation,
        exports: options.exports,
        filters: options.filters
    };

    let body = moduleExportImplementationTemplate.format(fileDefinition);
    let filename = moduleExportFilenameFormatter(options.moduleName);
    return fs.writeFile(path.join(options.fileLocation, filename), body);
}

module.exports = { build: buildFile };