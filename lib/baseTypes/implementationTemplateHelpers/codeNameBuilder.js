'use strict';
const stringUtil = require('../../stringUtilities');

function formatCodeString(name) {
    let codeNameArray = name.split(/[\.`~!@#%^&\*\-\+]/gi);
    codeNameArray = codeNameArray.map( (section, index) => {
        if(index > 0) {
            section = stringUtil.capitalizeFirstLetter(section);
        }
        return section;
    });
    return codeNameArray.join('');
}

module.exports = { format: formatCodeString };