'use strict';
const codePreferenceManager = require('./codePreferenceManager');
const codeStyleManager = require('./codeStyleManager');

const indentTypes = {
    space: ' ',
    tab: '\t'
};

const indentPreferences = {
    get indentSize () { return codePreferenceManager.getPreferences().indent.size;},
    get type () { return codePreferenceManager.getPreferences().indent.type; },
    defaultIndent: '  ',
    create: levels => indentPreferences.defaultIndent.repeat(levels || 0)
};

function updateDefaultIndent () {
    indentPreferences.defaultIndent = indentTypes[indentPreferences.type].repeat(indentPreferences.indentSize);
}

updateDefaultIndent();
codeStyleManager.registerCodeStyleHandler({
    type: 'indent',
    onUpdate: updateDefaultIndent(),
    codeStyleHandler: indentPreferences
});
