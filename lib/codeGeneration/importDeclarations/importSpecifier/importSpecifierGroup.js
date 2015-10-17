'use strict';
const importSpecifier = require('./importSpecifier');
const sequence = require('../../sequence');
const eslintReader = require('../../eslintReader');

const objectCurlySpacing = eslintReader['object-curly-spacing'] || [2, 'always'];
const curlySpacingRule = objectCurlySpacing[1];

const declarationTemplate = {
    always: context => `{ ${context.importSpecifiers} }`,
    never: context => `{${context.importSpecifiers}}`
};

function buildRender(importSpecifierDefinitions) {
    let importSpecifierRenderDefinitions = importSpecifierDefinitions.map(importSpecifier.buildRender);

    return {
        defineRender: renderContext => {
            let renderTemplate = renderContext.addRenderTemplate({
                template: declarationTemplate[curlySpacingRule],
                newLine: false
            });

            renderTemplate.define({
                name: 'importSpecifiers',
                renderDefinition: sequence.buildRender(importSpecifierRenderDefinitions, false)
            });
        }
    };
}

module.exports = { buildRender };