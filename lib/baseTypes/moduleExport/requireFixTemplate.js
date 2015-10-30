'use strict';
const indent = require('../implementationTemplateHelpers/indent').create;

function formatImplementation(options) {
    return `'use strict';
import parentModule from '${options.parentModule}';

export default {
    name: parentModule.name,
    module: parentModule,
    exports: {
        ${ renderExportList(options.exports) }
    },
    filters: {
        ${ renderFilterList(options.filters) }
    }
};`;
}

function renderExportList(exports) {
    let exportValues = exports.map(item => `${item.codeName}: '${item.name}${item.type === 'filter' ? 'Filter' : ''}'`);
    return exportValues.join(',\n' + indent(2));
}

function renderFilterList(filters) {
    let filterValues = filters.map(item => `${item.codeName}: ${item.codeName}.filter`);
    return filterValues.join(',\n' + indent(2));
}

module.exports = { format: formatImplementation };