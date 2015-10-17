'use strict';
const importSpecifierTypes = require('../importTypes').importSpecifiers;

function buildSpecifierGroupModel() {
    const specifierGroups = new Map();
    specifierGroups.set(importSpecifierTypes.importDefaultSpecifier, []);
    specifierGroups.set(importSpecifierTypes.importSpecifier, []);
    specifierGroups.set(importSpecifierTypes.importNamespaceSpecifier, []);
    return specifierGroups;
}

function groupSpecifiers(specifierDefinitions) {
    let specifierGroups = buildSpecifierGroupModel();

    specifierDefinitions.forEach(specifier => {
        specifierGroups.get(specifier.type).push(specifier);
    });

    return {
        defaultSpecifier: specifierGroups.get(importSpecifierTypes.importDefaultSpecifier)[0],
        specifiers: specifierGroups.get(importSpecifierTypes.importSpecifier),
        namespaceSpecifier: specifierGroups.get(importSpecifierTypes.importNamespaceSpecifier)[0]
    };
}

module.exports = { buildSpecifierGroupModel, groupSpecifiers };