'use strict';

function formatImplementation(options) {
    return `'use strict';

import parentModule from '${options.parentModule}';
let implementationKey = parentModule.dependencyKeys.${options.name};
export default { implementation : implementationKey };

let value = ${options.valueDefinition};

parentModule.module.${options.type}(implementationKey, value);`;
}


module.exports = { format: formatImplementation};