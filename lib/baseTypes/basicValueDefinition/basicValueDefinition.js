'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../../angularFilenameFormatters');
const valueImplementationTemplate = require('./valueImplementationTemplate');

function buildFile(options) {
    let fileDefinition = {
        parentModuleRelativeLocation: path.join(options.parentModuleRelativeLocation, filenameFormatter.module(options.parentModuleName)),
        name: options.name,
        valueDefinition: options.valueDefinition || '{}',
        type: options.type
    };

    let body = valueImplementationTemplate.format(fileDefinition);
    let filename= filenameFormatter[options.type](options.name);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

module.exports = { build: buildFile };

