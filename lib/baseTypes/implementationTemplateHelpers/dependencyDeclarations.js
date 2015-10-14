'use strict';
const indent = require('./indent');

module.exports = {
    format: (options) => options.dependencies.map(dependency => dependency.render(options.parentModuleName, options.accessName))
        .join(',\n' + indent.create(options.indent))
};