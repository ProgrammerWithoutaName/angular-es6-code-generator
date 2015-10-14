'use strict';

function build(options) {
    return {
        name: options.name,
        parentModule: options.parentModule,
        render: (parentModule, accessName) => {
            if(parentModule === options.parentModule) {
                return `${accessName}.dependencyKeys.${options.name}`
            } else {
                return `${accessName}.imports.${options.parentModule}.${options.name}`
            }
        }
    };
}