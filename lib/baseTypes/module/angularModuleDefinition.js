'use strict';

const fs = require('fs-promise');
const path = require('path');
const moduleFilenameFormatter = require('../../angularFilenameFormatters').module;
const moduleImplementationTemplate = require('./moduleImplementationTemplate');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');

function buildFile (options) {
    try {
        let fileDefinition = {
            fileLocation: options.fileLocation,
            moduleName: options.moduleName,
            moduleCodeName: codeNameBuilder.format(options.moduleName),
            dependencyKeys: options.dependencyKeys.map(name => ({ name, codeName: codeNameBuilder.format(name) })),
            imports: []
        };

        options.imports.forEach(importDefinition => {
            if (fileDefinition.moduleName !== importDefinition.name) {
                fileDefinition.imports.push(importDefinition);
            }
        });

        fileDefinition.imports.forEach(importItem => {
            importItem.codeName = codeNameBuilder.format(importItem.name);
        });

        fileDefinition.dependencyKeys = fileDefinition.dependencyKeys.sort(sortNameList);
        fileDefinition.imports = fileDefinition.imports.sort(sortNameList);

        let body = moduleImplementationTemplate.format(fileDefinition);
        let filename = moduleFilenameFormatter(options.moduleName);
        return fs.writeFile(path.join(options.fileLocation, filename), body);
    } catch (error) {
        console.log(error.stack);
    }
}

function sortNameList (itemA, itemB) {
    if (itemA.name === itemB.name) {
        return 0;
    } else {
        return itemA.name > itemB.name ? 1 : -1;
    }
}

module.exports = { build: buildFile };
