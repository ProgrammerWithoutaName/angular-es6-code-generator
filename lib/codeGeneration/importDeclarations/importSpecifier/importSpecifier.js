'use strict';
const identifier = require('../../identifier');
const comments = require('../../comments');

function buildWithAsRenderTemplate(renderContext, specifierDefinition) {
    let renderTemplate = renderContext.addRenderTemplate({
        template: context => `${context.localId} as ${context.importedId}`,
        newLine: specifierDefinition.relLoc.line > 0
    });

    renderTemplate.define({
        name: 'localId',
        renderDefinition: identifier.buildRender(specifierDefinition.local)
    });

    renderTemplate.define({
        name: 'importedId',
        renderDefinition: identifier.buildRender(specifierDefinition.imported)
    });

    renderTemplate.setRelativeLocation(specifierDefinition.relLoc);
}

function buildWithoutAsRenderTemplate(renderContext, specifierDefinition) {
    let renderIdentifier = identifier.buildRender(specifierDefinition.local);
    renderIdentifier.defineRender(renderContext);
}

function buildRender(specifierDefinition) {
    let renderDefinition = {
        defineRender: renderContext => {
            if(specifierDefinition.local.name === specifierDefinition.imported.name) {
                buildWithoutAsRenderTemplate(renderContext, specifierDefinition);
            } else {
                buildWithAsRenderTemplate(renderContext, specifierDefinition)
            }
        }
    };

    comments.buildRender(specifierDefinition, renderDefinition);
}

module.exports = { buildRender };