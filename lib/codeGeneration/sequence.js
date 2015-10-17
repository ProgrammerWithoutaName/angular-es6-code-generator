'use strict';
const eslintReader = require('./eslintReader');
const relativeSpacing = require('./relativeSpacing');

// Code should never handle it's own indentation rendering, but instead should only ever handle rendering it's children indents.
// Code should also never handle rendering it's own spaces..

// matters for new lines.
const commaStyleRule = eslintReader['comma-style'] || [2, 'last'];
// matters for same line
const commaSpacingRule = eslintReader['comma-spacing'] || [2, {before: false, after: true}];
const appendComma = commaStyleRule === 'last';

const commaSpaceFormat = {
    before: commaSpacingRule.before ? ' ' : '',
    after: commaSpacingRule.before ? ' ' : ''
};

const newlineComma = commaStyleRule === 'last' ? `${commaSpaceFormat.after},\n` : `\n,${commaSpaceFormat.before}`;

const spaceExists = {
    atStartOf: code => code[0].search(/^\s/gi) >= 0,
    atEndOf: code => !!code[code.length-1] && code[code.length-1].search(/\s$/gi) >= 0
};

function buildRender(expressionRenderDefinitions, useNewLines) {
    let prependCallback = useNewLines && !appendComma ? renderNewLineComma : undefined;
    let appendCallback = !useNewLines ? renderComma : appendComma && renderNewLineComma;
    return {
        defineRender: renderContext => {
            expressionRenderDefinitions.forEach(expression => {
                let renderTemplate = renderContext.addRenderTemplate({ template: context => context.expression });
                renderTemplate.define({
                    name: 'expression',
                    renderDefinition: expression,
                    prependCallback,
                    appendCallback
                });
            });
        }
    };
}

function renderComma(expression) {
    let before = spaceExists.atStartOf(expression.code) ? 0 : commaSpaceFormat.before;
    let after = spaceExists.atEndOf(expression.code) ? 0 : commaSpaceFormat.after;
    let comma = `${before},${after}`;
}

function renderNewLineComma(rawCode) {
    let before = spaceExists.atStartOf(rawCode) ? 0 : commaSpaceFormat.before;
    let after = spaceExists.atEndOf(rawCode) ? 0 : commaSpaceFormat.after;
    return appendComma ? `${before},` : `,${after}`
}

module.exports = { buildRender };

//curly
//dot-location
//eol-last
//array-bracket-spacing
//block-spacing
//brace-style
//indent
//lines-around-comments
//no-scaped-function
//quotePreference
//semi-spacing


// comma-spacing
// comma-style
// comma-dangle
/*
 space-after-keywords
 space-before-blocks
 space-before-function-paren
 space-before-keywords
 space-in-parens
 space-infix-ops
 space-return-throw-case
 space-unary-ops
 spaced-comment
 wrap-regex
 arrow-parens ( requires parens in arrow calls );
 arrow-spacing
 generator-star-spacing

 */

// get comma rules here:
