'use strict';

const defaultIndent = '    ';

module.exports = {
    defaultIndent,
    create: levels => defaultIndent.repeat(levels || 0)
};