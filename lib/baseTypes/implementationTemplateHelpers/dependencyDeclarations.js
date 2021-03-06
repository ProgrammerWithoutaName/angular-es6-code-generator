'use strict';
const indent = require('../../codeStyling/codeStyleContext').getCodeStyleHandlerFor('indent');
const codeNameBuilder = require('../implementationTemplateHelpers/codeNameBuilder');

function format (options) {
    function buildDependency (dependency) {
        return dependency.buildDependencyDefinition({
            dependentsParentModule: codeNameBuilder.format(options.parentModuleName),
            accessName: options.accessName
        });
    }
    let dependencyDefinitions = options.dependencies.map(buildDependency);
    let dependencyRenders = dependencyDefinitions.map(definition => {
        let value;
        if (definition === undefined || definition === null) {
            console.log(`${options.parentModuleName}'s definition for dependency is undefined/null!!`);
        }
        if (Array.isArray(definition.value)) {
            value = definition.value.join('.');
        } else {
            value = "'" + definition.value + "'";
        }
        return value;
    });

    return dependencyRenders.join(',\n' + indent.create(options.indent));
}

module.exports = { format };