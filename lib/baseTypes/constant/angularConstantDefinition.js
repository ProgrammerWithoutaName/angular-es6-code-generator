'use strict';

const fs = require('fs-promise');
const path = require('path');
const constantFilenameFormatter = require('../../angularFilenameFormatters').constant;

function buildConstantFile(options) {
  let fileDefinition = {
    parentModule: options.parentModuleRelativeLocation,
    constantName: options.constantName,
    constantValueDefinition: options.constantBodyDefinition || '{}'
  };

  let constantBody = createConstantBody(fileDefinition);
  let constantFileName = constantFilenameFormatter(options.constantName);
  return fs.writeFile(path.join(options.constantFilePath, constantFileName), constantBody);
}

function createConstantBody(options) {
  return `'use strict';

import parentModule from '${options.parentModule}';
let implementationKey = parentModule.dependencyKeys.${options.constantName};
export default { implementation : implementationKey };

let value = ${options.constantValueDefinition};

parentModule.module.constant(implementationKey, value);`;
}

module.exports = { build: buildConstantFile };

