'use strict';

const fs = require('fs-promise');
const path = require('path');
const filenameFormatter = require('../angularFilenameFormatters');
const valueImplementationTemplate = require('./implementationTemplates/valueImplementationTemplate');

function buildFile(options) {
    let fileDefinition = {
        parentModule: options.parentModuleRelativeLocation,
        name: options.name,
        valueDefinition: options.valueDefinition || '{}',
        type: options.type
    };

    let body = valueImplementationTemplate.format(fileDefinition);
    let filename= filenameFormatter[options.type](options.valueName);
    return fs.writeFile(path.join(options.filePath, filename), body);
}

module.exports = { build: buildFile };

