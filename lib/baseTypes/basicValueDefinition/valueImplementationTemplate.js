'use strict';
const jsonFormat = require('json-format');
const indent = require('../implementationTemplateHelpers/indent');
const importStatements = require('../implementationTemplateHelpers/importStatements');

const jsonFormatConfig = {
    type: indent.type,
    size: indent.indentSize
};

function formatImplementation (options) {
    return `'use strict';
import { components } from '${importStatements.formatFileLocation(options.parentModuleRelativeLocation)}'

const componentDefinition = components.${options.codeName};
componentDefinition.type = componentDefinition.componentTypes.${options.type};

componentDefinition.implementation = ${generateValueSource(options.valueDefinition)}
`;
}

function generateValueSource (value) {
    let sourceArray = [];

    sourceArray.push(`${getBasicSource(value)};`);
    if (typeof value === 'object' && !Array.isArray(value)) {
        appendFunctionSource(sourceArray, value);
    }
    return sourceArray.join('\n');
}

function getBasicSource (value) {
    if(typeof value === 'function') {
        return value.toString();
    } else {
        return jsonFormat(value, jsonFormatConfig);
    }
}

function appendFunctionSource (array, objectToParse) {
    let keys = Object.keys(objectToParse);
    keys.forEach(key => {
        if (typeof objectToParse[key] === 'function') {
            array.push(`value.${key} = ${objectToParse[key].toString()};`);
        }
    });
}

module.exports = { format: formatImplementation};