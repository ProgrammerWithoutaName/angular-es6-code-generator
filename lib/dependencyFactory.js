'use strict';
const valueMaps = require('./baseTypes/implementationTemplateHelpers/valueMaps');

function build(options) {
    return {
        name: options.name,
        parentModule: options.parentModule,
        buildDependencyDefinition: (definitionOptions) => {
            if(options.parentModule) {
                return buildAccessorDependencyType({
                    dependentsParentModule: definitionOptions.dependentsParentModule,
                    dependencyParentModule: options.parentModule.name,
                    accessName: definitionOptions.accessName,
                    dependencyName: options.name
                });
            }

            return buildStringDependencyType(options);
        }
    };
}

function buildAccessorDependencyType(options) {
    return {
        type: valueMaps.valueTypes.accessor,
        name: options.dependencyName,
        value: options.dependentsParentModule === options.dependencyParentModule ?
            ['components', options.dependencyName] :
            ['imports', options.dependencyParentModule, options.dependencyName]
    };
}

function buildStringDependencyType(options) {
    return {
        type: valueMaps.valueTypes.string,
        name: options,
        value: options
    };
}

module.exports = { build };