'use strict';

function formatImplementation(options) {
    return `'use strict';
import parentModule from '${options.parentModule}';
let implementationKey = parentModule.dependencyKeys.${options.name};
export default { implementation : implementationKey };

${options.source}
parentModule.module.provider(implementationKey, ${options.functionName});`;
}

module.exports = { format: formatImplementation };