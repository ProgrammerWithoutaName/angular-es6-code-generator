'use strict';
const previousDirectoryRegex = (/^\.+\//g);

const importStatements = {
    format: formatImportStatements,
    formatBasicImportStatement,
    formatParentModuleImportStatement,
    formatFileLocation,
    getImportModule,
    getImportModules
};

function formatImportStatements (imports) {
    return imports.map((importValue) =>
        `import ${importValue.codeName} from '${importStatements.formatFileLocation(importValue.relativeLocation)}';`)
        .join('\n');
}

function formatBasicImportStatement (imports) {
    return imports.map((importValue) =>
            `import '${importStatements.formatFileLocation(importValue.relativeLocation)}';`)
        .join('\n');
}

function formatFileLocation (fileLocation) {
    let formattedLocation = (fileLocation || '').replace(/\\/g, '/');
    let formatMatch = formattedLocation.match(previousDirectoryRegex);
    if (!formatMatch) {
        formattedLocation = './' + formattedLocation;
    }

    return formattedLocation;
}

function formatParentModuleImportStatement (relativeLocation) {
    let parentModuleImport = {
        codeName: 'parentModule',
        relativeLocation
    };
    return importStatements.format([parentModuleImport]);
}

function getImportModule (baseImportModule) {
    let importModule = baseImportModule;
    if (importModule.collapseParentDefinition) {
        importModule = importModule.collapseParentDefinition.baseModule;
    }
    return importModule;
}

function getImportModules (imports) {
    let importSet = new Set();
    let moduleImports = [];
    imports.forEach(importModule => {
        let moduleToImport = importStatements.getImportModule(importModule);
        if (!importSet.has(moduleToImport)) {
            importSet.add(moduleToImport);
            moduleImports.push(moduleToImport);
        }
    });
    return moduleImports;
}

module.exports = importStatements;
