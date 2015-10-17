'use strict';
const syntax = require('esprima').Syntax;

module.exports = {
    arrayExpression: syntax.ArrayExpression,
    arrowFunctionExpression: syntax.ArrowFunctionExpression,
    assignmentExpression: syntax.AssignmentExpression,
    binaryExpression: syntax.BinaryExpression,
    callExpression: syntax.CallExpression,
    classExpression: syntax.ClassExpression,
    conditionalExpression: syntax.ConditionalExpression,
    functionExpression: syntax.FunctionExpression,
    literal: syntax.Literal,
    logicalExpression: syntax.LogicalExpression,
    memberExpression: syntax.MemberExpression,
    newExpression: syntax.NewExpression,
    objectExpression: syntax.ObjectExpression,
    property: syntax.Property, // the sort of property made with Object.defineProperty()
    sequenceExpression: syntax.SequenceExpression,
    taggedTemplateExpression: syntax.TaggedTemplateExpression,
    templateLiteral: syntax.TemplateLiteral,
    thisExpression: syntax.ThisExpression,
    unaryExpression: syntax.UnaryExpression,
    updateExpression: syntax.UpdateExpression, // ++/-- are the update expressions
    spreadElement: syntax.SpreadElement,
    yieldExpression: syntax.YieldExpression,
    // patterns:
    identifier: syntax.identifier,
    objectPattern: syntax.objectPattern,
    assignmentPattern: syntax.AssignmentPattern,
    arrayPattern: syntax.arrayPattern,
    restElement: syntax.RestElement

};