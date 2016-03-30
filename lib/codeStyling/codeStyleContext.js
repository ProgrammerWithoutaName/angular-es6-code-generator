'use strict';
require('./styleHandlerRegistry');

const codePreferenceManager = require('./codePreferenceManager');
const codeStyleManager = require('./codeStyleManager');

module.exports = {
    setPreferences: codePreferenceManager.setPreferences,
    getPreferences: codePreferenceManager.getPreferences,
    getCodeStyleHandlerFor: codeStyleManager.getCodeStyleHandlerFor
};