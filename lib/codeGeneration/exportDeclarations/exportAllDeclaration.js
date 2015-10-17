'use strict';
const buildLiteral = require('../literalGenerators/literalGenerator').create;
/*
 input: export * from 'there'
 {
     "type": "ExportAllDeclaration",
     "source": {
         "type": "Literal",
         "value": "there",
         "raw": "'there'"
     }
 }
 */

function create(exportAllDeclarationDefinition) {
    let source = buildLiteral(exportAllDeclarationDefinition.source);
    return `export * from ${source}`;
}

module.exports = { create };