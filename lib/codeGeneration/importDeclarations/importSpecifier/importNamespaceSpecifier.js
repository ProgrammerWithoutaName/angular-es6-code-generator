'use strict';
const identifier = require('../../identifier');

function buildRender(specifierDefinition) {
    let renderDefinition = {
        defineRender: renderContext => {
            let renderTemplate = renderContext.addRenderTemplate({
                template: context => `*as ${context.localId}`,
                newLine: specifierDefinition.relLoc.line > 0
            });

            renderTemplate.define({
                name: 'localId',
                renderDefinition: identifier.buildRender(specifierDefinition.local)
            });

            renderTemplate.setRelativeLocation(specifierDefinition.relLoc);
        }
    };

    comments.buildRender(specifierDefinition, renderDefinition);
}

module.exports = { buildRender };