'use strict';
const syntax = require('esprima').Syntax;

const importSpecifiers = {
    importSpecifier: syntax.importSpecifier,
    importDefaultSpecifier: syntax.importDefaultSpecifier,
    importNamespaceSpecifier: syntax.importNamespaceSpecifier
};



module.exports = {
    importDeclaration: syntax.importDeclaration,
    importSpecifiers
};