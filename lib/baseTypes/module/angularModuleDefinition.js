'use strict';

const fs = require('fs-promise');
const path = require('path');
const moduleFilenameFormatter = require('../../angularFilenameFormatters').module;
const moduleImplementationTemplate = require('./moduleImplementationTemplate');

function buildFile(options) {
    let fileDefinition = {
        fileLocation: options.fileLocation,
        moduleName: options.moduleName,
        dependencyKeys: options.dependencyKeys,
        imports: options.imports
    };

    let body = moduleImplementationTemplate.format(fileDefinition);
    let filename = moduleFilenameFormatter(options.moduleName);
    return fs.writeFile(path.join(options.fileLocation, filename), body);
}

module.exports = { build: buildFile };