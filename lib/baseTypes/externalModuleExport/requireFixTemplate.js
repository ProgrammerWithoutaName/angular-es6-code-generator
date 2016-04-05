'use strict';
const indent = require('../../codeStyling/codeStyleContext').getCodeStyleHandlerFor('indent').create;

function formatImplementation (options) {
    let baseIndent = indent(1);
    return `'use strict';
import * as angular from 'angular';
import '${options.parentModule}';
const name = '${options.parentModule}';
export default {
${baseIndent}name: name,
${baseIndent}module: angular.module(name),
${baseIndent}exports: {
${indent(2)}${ renderExportList(options.exports) }
${baseIndent}},
${baseIndent}filters: {
${indent(2)}${ renderFilterList(options.filters) }
${baseIndent}}
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
    let filterValues = filters.map(item => `${item.codeName}: '${item.name}'`);
    return filterValues.join(',\n' + indent(2));
}

module.exports = { format: formatImplementation };