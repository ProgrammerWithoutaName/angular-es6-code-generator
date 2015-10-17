'use strict';

// we don't care about rules here, just where we are relative to the previous statement.
function setRelativeInformationInChild(options) {

    // parentNode, childNode, defaultDifference (line, space, indent) note: indent is always set, but only used when on different line
    options.childNode.relLoc = getValues(options);
}

function getValues(options) {
    let relativePositionValues = {
        line: 0,
        column: 0,
        indent: 0 // todo: figure out how to figure this out in code.
    };
    relativePositionValues.line = getLineValue(options);

    if (relativePositionValues.line === 0) {
        relativePositionValues.column = getColumnValue(options);
    }

    return relativePositionValues;
}


function getLineValue(options) {
    let line = determineLocRelativeValue(options.childNode.loc, options.parentNode.loc, 'line');

    if (options.overrides) {
        line = options.overrides.line;
    }

    if(options.defaults && line === undefined) {
        line = options.defaults.line;
    }
    return line;
}

function getColumnValue(options) {
    let column = determineLocRelativeValue(options.childNode.loc, options.parentNode.loc, 'column');

    if(options.overrides) {
        column = options.overrides.column;
    }

    if(options.defaults && column === undefined) {
        column = options.defaults.column;
    }


    return column;
}

function determineLocRelativeValue(childLoc, parentLoc, type) {
    if(!parentLoc) { return undefined; }
    if(!childLoc) { return 0; }

    if(parentLoc.end[type] <= childLoc.start[type]) {
        return childLoc.start[type] - parentLoc.end[type];
    }

    return Math.min(parentLoc.start[type] - childLoc.end[type], -1);
}

module.exports = { setRelativeInformationInChild };