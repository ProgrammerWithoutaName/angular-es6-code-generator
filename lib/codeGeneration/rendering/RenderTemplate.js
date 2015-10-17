'use strict';
const getEmptyString = () => '';

class RenderTemplate {
    constructor(parentContext, templateDefinition ) {
        this.parentContext = parentContext;
        this.nodeDefinitions = [];
        this.template = templateDefinition.template;
        this.newLine = templateDefinition.newLine;
    }

    setRelativeLocation(relLoc) {
        this.relativeLocation.line = relLoc.line || 0;
        this.relativeLocation.column = relLoc.column || 0;
        this.relativeLocation.indent = relLoc.indent || 0;
    }

    define(templateValue) {
        let nodeDefinition = {
            name: templateValue.name,
            renderContext: this.parentContext.createChild(templateValue.renderDefinition),
            appendCallback: templateValue.appendCallback || getEmptyString,
            prependCallback: templateValue.prependCallback || getEmptyString()
        };

        this.nodeDefinitions.push(nodeDefinition);
    }

    renderNodes() {
        let templateContext = {
            newLineIndent: relativeSpacing.getIndent(this.parentContext.indent + this.relativeLocation.indent)
        };
        this.nodeDefinitions.forEach(node => {
            let renderedDefinition = node.renderContext.render();
            renderedDefinition = `${node.prependCallback(renderedDefinition)}${renderedDefinition}${node.appendCallback(renderedDefinition)}`;
            templateContext[node.name] = renderedDefinition;
        });
        return templateContext;
    }

    render() {
        let templateContext = this.renderNodes();
        let renderedTemplate = this.template(templateContext);

        if(!this.newLine) { return renderedTemplate; }

        return templateContext.newLineIndent + renderedTemplate;
    }
}

module.exports = RenderTemplate;