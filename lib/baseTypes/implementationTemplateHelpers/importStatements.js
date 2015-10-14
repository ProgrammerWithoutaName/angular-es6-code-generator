'use strict';

function formatImportStatements(imports) {
    return imports.map((importValue) =>
        `import ${importValue.name} from '${importValue.relativeLocation}';`)
        .join('\n');
}

module.exports = {
    format: imports =>  imports.map((importValue) =>
        `import ${importValue.name} from '${importValue.relativeLocation}';`)
        .join('\n')
};