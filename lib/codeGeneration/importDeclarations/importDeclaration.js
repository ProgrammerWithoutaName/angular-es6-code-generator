'use strict';
const comments = require('../comments');
const importSpecifierDeclaration = require('./importSpecifier/importSpecifierDeclaration');
const literalGenerator = require('../expressions/literal');

function buildRender(importDeclarationDefinition) {
    let expressionRender = {
        defineRender: renderContext => {
            //Note: something else needs to set the relative positions. this would be a leaf node, effectively.
            let templateRender = renderContext.addRenderTemplate({
                template: context => `import ${context.importSpecifier} from ${context.source}`,
                newLine: true
            });

            templateRender.define({
                name: 'importSpecifier',
                renderDefinition: importSpecifierDeclaration.buildRender(importDeclarationDefinition)
            });

            templateRender.define({
                name: 'source',
                renderDefinition: literalGenerator.buildRender(importDeclarationDefinition.source)
            });
            templateRender.setRelativeLocation(importDeclarationDefinition.relLoc);
        }
    };

    return comments.buildRender(importDeclarationDefinition, expressionRender);
}

module.exports = { buildRender };