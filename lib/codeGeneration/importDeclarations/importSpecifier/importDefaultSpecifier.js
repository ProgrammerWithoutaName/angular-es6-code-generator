'use strict';
const buildIdentifier = require('../../identifierGenerator').create;

'use strict';
const identifier = require('../../identifier');
const comments = require('../../comments');

function buildRender(specifierDefinition) {
    let renderDefinition = {
        defineRender: renderContext => {
            let renderIdentifier = identifier.buildRender(specifierDefinition.local);
            renderIdentifier.defineRender(renderContext);
        }
    };

    comments.buildRender(specifierDefinition, renderDefinition);
}

module.exports = { buildRender };