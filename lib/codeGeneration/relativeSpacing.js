'use strict';
const eslintReader = require('./eslintReader');

const indentRule = eslintReader.indent || [];
const multiSpaceRule = eslintReader['no-multi-spaces'];
const noMultipleEmptyLinesRule = eslintReader['no-multiple-empty-lines'];

const indentTypeIsTab = indentRule[1] === 'tab';
const indentCharacter = indentTypeIsTab ? '\t': ' ';
// todo: This would be an excellent place to put in lint changes while upgrading the codebase... Might be able to pull from eslint.
// todo: support more then basic indent, look up indent in eslint rules, can define specific indents for things like declarations and such.
const indentCount = indentTypeIsTab ? 1 : indentRule[1];
const indent = indentCharacter.repeat(indentCount);

const allowMultipleSpaces = !!multiSpaceRule;
const allowMultipleEmptyLines = !(noMultipleEmptyLinesRule && noMultipleEmptyLinesRule[0] === 2);
const maxLines = disallowMultipleEmptyLines ? noMultipleEmptyLinesRule[1].max || 1 : -1;

//todo: allow for config to define these
module.exports = {
    indent,
    getIndent: (levels) => indent.repeat(levels || 0),
    getSpaces: (spaces) => ' '.repeat( allowMultipleSpaces ? spaces : Math.min(spaces, 1, 0)),
    getNewLines: (newLineCount) => '\n'.repeat( allowMultipleEmptyLines ? newLineCount : Math.min(newLineCount, maxLines, 0) )
};