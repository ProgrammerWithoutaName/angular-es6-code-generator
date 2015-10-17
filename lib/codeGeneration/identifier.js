'use strict';
const comments = require('./comments');

// technically, this is a Pattern?? but, also part of expressions
function buildRender(identifierDefinition) {
    let expressionRender = {
        defineRender: renderContext => {
            //Note: something else needs to set the relative positions. this would be a leaf node, effectively.
            let templateRender = renderContext.addRenderTemplate({
                template: context => identifierDefinition.name,
                newLine: identifierDefinition.relLoc.line > 0
            });
            templateRender.setRelativeLocation(identifierDefinition.relLoc);
        }
    };

    return comments.buildRender(identifierDefinition, expressionRender);
}

exports.module = { buildRender };