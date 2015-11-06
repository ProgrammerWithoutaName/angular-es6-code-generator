'use strict';
const indent = require('../implementationTemplateHelpers/indent').create;

function formatImplementation (options) {
    return `'use strict';
import * as angular from 'angular';
import '${options.parentModule}';
const name = '${options.parentModule}';
export default {
    name: name,
    module: angular.module(name),
    exports: {
        ${ renderExportList(options.exports) }
    },
    filters: {
        ${ renderFilterList(options.filters) }
    }
};`;
}

function renderExportList (exports) {
    let exportValues = exports.map(item => `${item.codeName}: '${getDependencyKey(item)}'`);
    return exportValues.join(',\n' + indent(2));
}

function getDependencyKey (item) {
    let key = item.name;
    if (item.type === 'filter') {
        key += 'Filter';
    }
    if (item.type === 'provider') {
        key += 'Provider';
    }
    return key;
}

function renderFilterList (filters) {
    let filterValues = filters.map(item => `${item.codeName}: ${item.codeName}.filter`);
    return filterValues.join(',\n' + indent(2));
}

module.exports = { format: formatImplementation };