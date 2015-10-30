'use strict';
const previousDirectoryRegex = (/^\.+\//g);

const importStatements = {
    format: formatImportStatements,
    formatParentModuleImportStatement,
    formatFileLocation
};

function formatImportStatements(imports) {
    return imports.map((importValue) =>
        `import ${importValue.codeName} from '${importStatements.formatFileLocation(importValue.relativeLocation)}';`)
        .join('\n');
}

function formatFileLocation(fileLocation) {
    let formattedLocation = (fileLocation || '').replace(/\\/g,'/').replace(/\.es6$/g, '');
    let formatMatch = formattedLocation.match(previousDirectoryRegex);
    if(!formatMatch) {
        formattedLocation = './' + formattedLocation;
    }

    return formattedLocation;
}

function formatParentModuleImportStatement(relativeLocation) {
    let parentModuleImport = {
        codeName: 'parentModule',
        relativeLocation
    };
    return importStatements.format([parentModuleImport]);
}

module.exports = importStatements;