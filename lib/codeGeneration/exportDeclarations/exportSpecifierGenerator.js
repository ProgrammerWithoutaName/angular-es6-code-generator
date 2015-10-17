'use strict';
const buildIdentifier = require('../../indentifierGenerator').create;
/*
 input: export { thing };
 {
     "type": "ExportNamedDeclaration",
     "declaration": null,
     "specifiers": [
         {
             "type": "ExportSpecifier",
             "exported": {
                 "type": "Identifier",
                 "name": "thing"
             },
             "local": {
                 "type": "Identifier",
                 "name": "thing"
             }
         }
     ],
     "source": null
 }
 */

function createWithAs(specifierDefinition) {
    let localId = buildIdentifier(specifierDefinition.local);
    let exportedId = buildIdentifier(specifierDefinition.exported);
    return `${localId} as ${exportedId}`;
}

function createWithoutAs(specifierDefinition) {
    return buildIdentifier(specifierDefinition.local);
}

function create(specifierDefinition) {
    if(specifierDefinition.local.name === specifierDefinition.exported.name) {
        return createWithoutAs(specifierDefinition);
    }
    return createWithAs(specifierDefinition);
}

module.exports = { create };