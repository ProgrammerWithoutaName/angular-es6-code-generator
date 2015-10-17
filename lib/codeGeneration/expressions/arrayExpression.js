'use strict';
const expressionGenerator = require('./expressionGenerator');
const expressionTypes = require('./expressionTypes');
const sequence = require('../sequence');
const eslintReader = require('../eslintReader');
const comments = require('../comments');

const arrayBracketSpacing = eslintReader['array-bracket-spacing'] || [2, 'always'];
const arrayBracketRule = arrayBracketSpacing[1];

const arrayBracketSingleLineTemplates = {
    always: context => `[ ${context.elements} ]`,
    never: context => `[${context.elements}]`
};

const arrayBracketMultiLineTemplate = context => `[
${context.elements}
${context.newLineIndent}]`;

const generatorRequireExclusionMap = new Map();
generatorRequireExclusionMap.set(expressionTypes.arrayExpression, buildRender);

const generator = expressionGenerator.build(generatorRequireExclusionMap);

/*
array expression:
[0,1,2]
or with the spread operator.
So, it accepts Literals, nothing, or Expressions (including patterns. I should make that..)
 */

function buildRender(arrayExpressionDefinition) {
    let arrayRenderer = {
        defineRender: renderContext => {
            let multiline = arrayIsMuliline(arrayExpressionDefinition);
            let templateRender = renderContext.addRenderTemplate({
                template: getRenderTemplate (multiline),
                newLine: multiline
            });

            templateRender.define({
                name: 'elements',
                renderDefinition: sequence.buildRender(arrayExpressionDefinition.elements, multiline)
            });

            templateRender.setRelativeLocation(arrayExpressionDefinition.relLoc);
        }
    };
    return comments.buildRender(arrayExpressionDefinition, arrayRenderer)
}

function arrayIsMuliline(arrayExpressionDefinition) {
    return arrayExpressionDefinition.loc.start.line !== arrayExpressionDefinition.loc.end.line;
}

function getRenderTemplate(multiline) {
    let template;

    if(multiline) {
        template = arrayBracketMultiLineTemplate;
    } else {
        template = arrayBracketSingleLineTemplates[arrayBracketRule];
    }

    return template;
}

module.exports = { buildRender };