'use strict';
const indent = require('../../codeStyling/codeStyleContext').getCodeStyleHandlerFor('indent');

function deindentFunction(func) {
    let source = func.toString();
    let deindentedSource = setSourceIndent(source);
    return deindentedSource.join('\n');
}

function setFunctionBaseIndent(func, indentLevel) {
    let source = func.toString();
    let sourceArray = setSourceIndent(source, indentLevel);
    return sourceArray.join('\n');
}

function setSourceIndent(source, indentLevel) {
    // remove the first indent.
    let sourceArray = source.split('\n');
    let baseIndent = indent.create(indentLevel);
    return sourceArray.map(line => `${baseIndent}${line}`);
}

function deindentSource(source) {
    let sourceArray = source.split('\n');
    let leadingWhitespaceLength = getLeadingWhitespaceLength(sourceArray);
    return sourceArray.map(line => deindentLine(line, leadingWhitespaceLength));
}

function getLeadingWhitespaceLength(sourceArray) {
    let lastLine = sourceArray[sourceArray.length-1];
    let lastLineMatch = lastLine.match(/^\s*/gi);
    if(lastLineMatch !== null && lastLineMatch !== undefined) {
        return lastLineMatch[0].length;
    }
    return 0;
}

function deindentLine(sourceLine, leadingWhitespaceLength) {
    const leadingWhitespace = new RegExp(`^[\\s\\uFEFF\\xA0]{0,${leadingWhitespaceLength}}`, 'g');
    return sourceLine.replace(leadingWhitespace, '');
}

module.exports = {
    deindentFunction,
    setFunctionBaseIndent,
    setSourceIndent,
    deindentSource,
    deindentLine,
    getLeadingWhitespaceLength
};