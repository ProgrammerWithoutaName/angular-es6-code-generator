'use strict';

// defaults. This will get expanded, goal is to use a .eslintrc ultimately
let codePreferences = {
    indent: { type: 'space', size: 2 }
};

let preferenceManager = {
    onUpdate: () => {},
    getPreferences: () => codePreferences,
    setPreferences: preferences => {
        codePreferences = preferences || codePreferences;
        preferenceManager.onUpdate();
    }  
};

module.exports = preferenceManager;