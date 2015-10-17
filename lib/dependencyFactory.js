'use strict';
const valueMaps = require('./baseTypes/implementationTemplateHelpers/valueMaps');

function build(options) {
    return {
        name: options.name,
        parentModule: options.parentModule,
        buildDependencyDefinition: (dependentsParentModule, accessName) => {
            if(options.parentModule) {
                return buildAccessorDependencyType({
                    dependentsParentModule,
                    accessName,
                    dependencyParentModule: options.parentModule,
                    dependencyName: options.name
                });
            }

            return buildStringDependencyType({dependencyName: options.name});
        }
    };
}

function buildAccessorDependencyType(options) {
    return {
        type: valueMaps.valueTypes.accessor,
        value: options.dependentsParentModule === options.dependencyParentModule ?
            [options.accessName, 'dependencyKeys', options.dependencyName] :
            [options.accessName, 'imports', options.dependencyParentModule, options.dependencyName]
    };
}

function buildStringDependencyType(options) {
    return {
        type: valueMaps.valueTypes.string,
        value: options.name
    };
}

module.exports = { build };