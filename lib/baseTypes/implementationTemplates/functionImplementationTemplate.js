'use strict';

function formatImplementation(options) {
    return `'use strict';
import parentModule from '${options.parentModule}';
let implementationKey = parentModule.dependencyKeys.${options.name};
export default { implementation : implementationKey };

${options.source}
${options.functionName}.$inject = [${buildDependencyString(options.dependencies)}];
parentModule.module.${options.type}(implementationKey, ${options.functionName});`;
}

function buildDependencyString(dependencies) {
    return dependencies.map(dependency => `'${dependency}'`).join(', ');
}

module.exports = { format: formatImplementation };