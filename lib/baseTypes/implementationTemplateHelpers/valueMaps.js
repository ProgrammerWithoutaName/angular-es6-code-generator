'use strict';
const indent = require('./../../codeStyling/codeStyleContext').getCodeStyleHandlerFor('indent');

const valueTypes = {
    string: 'string',
    number: 'number',
    accessor: 'accessor'
};

const definitionFormats = {
    string: value => `'${value}'`,
    number: value => value.toString(),
    accessor: accessorChain => accessorChain.join('.'),
    objectMap: value => `${value.propertyName}: ${value.value}`,
    indentedCommaSeparated: value => value.objectDefinitions.join(',\n' + indent.create(value.indent))
};

function createObjectMap (options) {
    let objectDefinitions = options.valueDefinitions.map( item => definitionFormats.objectMap({
        propertyName: item.propertyName,
        value: renderValue(item, options.defaultType)
    }));

    return definitionFormats.indentedCommaSeparated({objectDefinitions, indent: options.indent});
}

function createObjectCommaSeparatedList (options) {
    let objectDefinitions = renderValues(options.values, options.defaultType);
    return definitionFormats.indentedCommaSeparated({ objectDefinitions, indent: options.indent});
}

function renderValues (items, defaultType) {
    return items.map(item => renderValue(item, defaultType));
}

function renderValue (item, defaultType) {
    return definitionFormats[item.type || defaultType](item.value);
}

module.exports = {
    createObjectMap,
    createObjectAccessor: definitionFormats.accessor,
    createObjectCommaSeparatedList,
    valueTypes
};
