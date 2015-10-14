'use strict';
const indent = require('./indent');

function createNewLine(indentLevels) {
    return '\n' + indent.create(indentLevels);
}

function format (names, indentLevels) {
    let nameDefinitions = names.map(name => `${name}: '${name}'`);

    if(nameDefinitions.any()) {
        return `${nameDefinitions.join(',' + createNewLine(indentLevels))}`;
    }

    return '';
}

module.exports = { format };