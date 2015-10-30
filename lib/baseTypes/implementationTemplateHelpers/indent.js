'use strict';

const indentTypes = {
    space: ' ',
    tab: '\t'
};

const preferredIndentType = 'space';
const preferredIndentSize = 4;

const indentPreferences = {
    indentSize: preferredIndentSize,
    type: preferredIndentType,
    defaultIndent: indentTypes[preferredIndentType].repeat(preferredIndentSize),
    create: levels => indentPreferences.defaultIndent.repeat(levels || 0)
};

module.exports = indentPreferences;