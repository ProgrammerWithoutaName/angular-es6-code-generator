'use strict';
const importDefaultSpecifier = require('./importDefaultSpecifier');
const importNamespaceSpecifier = require('./importNamespaceSpecifier');
const importSpecifierGroup = require('./importSpecifierGroup');
const importSpecifierDeclarationModel = require('./importSpecifierDeclarationModel');
const sequence = require('../../sequence');

function buildRender(specifierDefinitions) {
    let specifierDeclarationModel = importSpecifierDeclarationModel.groupSpecifiers(specifierDefinitions);
    if(specifierDeclarationModel.namespaceSpecifier) {
        return importNamespaceSpecifier.buildRender(specifierDeclarationModel.namespaceSpecifier);
    }

    return buildNonNamespaceSpecifierRender(specifierDeclarationModel) ;
}

function buildNonNamespaceSpecifierRender(specifierDeclarationModel) {
    let renderDefinitions = [];
    if(specifierDeclarationModel.defaultSpecifier) {
        renderDefinitions.push(importDefaultSpecifier.buildRender(specifierDeclarationModel.defaultSpecifier));
    }
    if(specifierDeclarationModel.specifiers.any()) {
        renderDefinitions.push(importSpecifierGroup.buildRender(specifierDeclarationModel.specifiers));
    }

    return sequence.buildRender(renderDefinitions, false);
}

module.exports = { buildRender };