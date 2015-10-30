'use strict';
const importStatements = require('../implementationTemplateHelpers/importStatements');
const jsonFormat = require('json-format');
const indent = require('../implementationTemplateHelpers/indent');

const jsonFormatConfig = {
    type: indent.type,
    size: indent.indentSize
};

function formatImplementation(options) {
    return `'use strict';

${importStatements.formatParentModuleImportStatement(options.parentModuleRelativeLocation)}
let implementationKey = parentModule.dependencyKeys.${options.name};
export default { implementation : implementationKey };

${generateValueSource(options.valueDefinition)}

parentModule.${options.type}(implementationKey, value);`;
}

function generateParentImportStatement (relativeLocation) {
    let parentModuleImport = {
        codeName: 'parentModule',
        relativeLocation
    };
    return importStatements.format([parentModuleImport]);
}

function generateValueSource(value) {
    let sourceArray = [];

    sourceArray.push(`let value = ${getBasicSource(value)};`);
    if (typeof value === 'object' && !Array.isArray(value)) {
        appendFunctionSource(sourceArray, value);
    }
    return sourceArray.join('\n');
}

function getBasicSource(value) {
    if(typeof value === 'function') {
        return value.toString();
    } else {
        return jsonFormat(value, jsonFormatConfig);
    }
}

function appendFunctionSource(array, objectToParse) {
    let keys = Object.keys(objectToParse);
    keys.forEach(key => {
        if (typeof objectToParse[key] === 'function') {
           array.push(`value.${key} = ${objectToParse[key].toString()};`);
        }
    });
}


module.exports = { format: formatImplementation};