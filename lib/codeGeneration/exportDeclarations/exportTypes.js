'use strict';
const syntax = require('esprima').Syntax;

const exportDeclarations = {
    exportAllDeclaration: syntax.exportAllDeclaration,
    exportDefaultDeclaration: syntax.exportDefaultDeclaration,
    exportNamedDeclaration: syntax.exportNamedDeclaration
};

module.exports = {
    exportDeclarations,
    exportSpecifier: syntax.exportSpecifier
};