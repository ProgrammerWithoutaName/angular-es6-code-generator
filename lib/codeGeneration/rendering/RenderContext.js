'use strict';
const relativeSpacing = require('./relativeSpacing');
const RenderTemplate = require('./RenderTemplate');
const emptyString = () => '';
//Indents matter here
//space rules matter here
//

class RenderContext {
    constructor(parentContext, renderDefinition) {
        this.parentContext = parentContext || { indent: 0 };
        this.relativeLocation = { line: 0, column: 0, indent: 0};
        this.renderTemplates = [];
        renderDefinition.defineRender(this);
    }

    get indent() { return this.parentContext.indent + 1; }

    createChild(renderDefinition) { return new RenderContext(this, renderDefinition) }

    addRenderTemplate(templateDefinition) {
        let renderTemplate = new RenderTemplate(this, templateDefinition);
        this.renderTemplates.push(renderTemplate);
        return renderTemplate;
    }

    render() {
        // render should return a string. Template handles indentation and spacing.
        let rendered =  '';
        this.renderTemplates.forEach(renderTemplate => {
            if(renderTemplate.newLine) {
                let lineCount = renderTemplate.relativeLocation.line;
                rendered += relativeSpacing.getNewLines(lineCount);
            } else {
                let spaceCount = renderTemplate.relativeLocation.column;
                rendered += relativeSpacing.getSpaces(spaceCount);
            }
            rendered += renderTemplate.render();
        });

        return rendered;
    }
}


/*
 How I want it to work:

 example: import statements:

 // should be expression by expression with intent.
 // we intend to render this template on a new line.
 importStatement = {
 defineRender: renderContext => {
 renderTemplate = renderContext.addRenderTemplate({ template: (context) => `import ${context.importSpecifier} from ${context.source}`, newLine: true});
 renderTemplate.define( { name: 'importSpecifier', renderDefinition: importSpecifier } );
 renderTemplate.define( { name: 'source', renderDefinition: sourceExpression });
 renderTemplate.setRelativeLocation(importDeclaration.relLoc); // can also custom define it, but this will set the relative location
 };
 };

 example: sequence

 let expressions = [...]
 let newlinePrependTemplate = context => `${prependComma}${context.expression}`;
 let newlineAppendTemplate = context => `${context.expression}${appendComma}`;
 let renderNewlineSequence = renderContext => {
 expressions.forEach(expression => {
 renderTemplate = renderContext.addRenderTemplate({ template: context => context.expression });
 renderTemplate.define({ name: 'expression', renderer: expression, append: getAppendComma });
 });
 };

 sequenceStatement = {
 renderContext => {
 renderNewlineSequence(renderContext);
 }
 };


 renderTemplate wont render until later.

 */