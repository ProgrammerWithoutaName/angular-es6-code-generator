'use strict';
const jsonFormat = require('json-format');
const codeStyleContext = require('../../codeStyling/codeStyleContext');
const importStatements = require('../implementationTemplateHelpers/importStatements');
const jsStringEscape = require('js-string-escape');
const expressionDeclarationModifier = require('../../sourceModifiers/expressionDeclarationModifier');
const changeIndent = require('../implementationTemplateHelpers/changeIndent');

const indent = codeStyleContext.getCodeStyleHandlerFor('indent');


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
    switch(typeof value) {
    case 'object': return jsonFormat(value, jsonFormatConfig);
    case 'string': return `'${jsStringEscape(value)}'`;
    case 'undefined': return 'undefined';
    default:
        return value === null ? 'null' : value.toString();
    }
}

function appendFunctionSource (array, objectToParse) {
    let keys = Object.keys(objectToParse);
    keys.forEach(key => {
        if (typeof objectToParse[key] === 'function') {
            let expressionDeclaration = expressionDeclarationModifier.buildExpressionDeclaration({
                name: key,
                baseFunction: objectToParse[key],
                assignTo: `componentDefinition.implementation.${key}`
            });

            let formattedSource = changeIndent.deindentSource(expressionDeclaration.source).join('\n');
            array.push(formattedSource);
        }
    });
}

module.exports = { format: formatImplementation};