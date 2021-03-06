'use strict';
const expressionDeclarationModifier = require('../../sourceModifiers/expressionDeclarationModifier');
const stringUtilities = require('../../stringUtilities');

function format (options) {
    return expressionDeclarationModifier.buildExpressionDeclaration({
        alternateName: `build${stringUtilities.capitalizeFirstLetter(options.codeName)}`,
        baseFunction: options.baseFunction
    });
}

module.exports = { format };