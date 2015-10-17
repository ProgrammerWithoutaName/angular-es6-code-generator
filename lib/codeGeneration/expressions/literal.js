'use strict';
const regexLiteralGenerator = require('.regexLiteralGenerator');

function create(literalDefinition) {
    if(literalDefinition.raw) return literalDefinition.raw;
    if(literalDefinition.value === null) return 'null';
    if(literalDefinition.regex) return renderRegex(literalDefinition.regex);
    if(typeof literalDefinition.value === 'string') return renderString(literalDefinition.value);

    return literalDefinition.value.toString();
}

const quoteRegex = {
    single: value => value.match(/[^\\]?'/gi),
    double: value => value.match(/[^\\]?"/gi)
};

const quoteDetection = {
    single: value => value.match(quoteRegex.single),
    double: value => value.match(quoteRegex.double)
};

const escapeQuotes = {
    single: value => value.replace(quoteRegex.single,"\\'"),
    double: value => value.replace(quoteRegex.double,'\\"')
};

//todo: put in ability to specify preference
function renderString(value) {
    let hasUnescapedSingleQuotes = quoteDetection.single(value);
    let hasUnescapedDoubleQuotes = quoteDetection.double(value);

    if(hasUnescapedSingleQuotes && hasUnescapedDoubleQuotes) {
        return `'${escapeQuotes.single(value)}'`;
    }
    if(hasUnescapedSingleQuotes) {
        return `"${value}"`;
    }
    return `'${value}'`;
}

function renderRegex(regex) {
    return `/${regex.pattern}/${regex.flags}`;
}

module.exports = { create };