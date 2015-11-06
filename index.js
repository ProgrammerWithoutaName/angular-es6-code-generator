'use strict';
const buildAngularFile = require('./lib/baseTypes/buildAngularFile');

const components = new Map();
components.set('factory', (options) => buildAngularFile.buildFunctionFile(options, 'factory'));
components.set('controller', (options) => buildAngularFile.buildFunctionFile(options, 'controller'));
components.set('service', (options) => buildAngularFile.buildFunctionFile(options, 'service'));
components.set('directive', (options) => buildAngularFile.buildFunctionFile(options, 'directive'));
components.set('constant', (options) => buildAngularFile.buildValueFile(options, 'constant'));
components.set('value', (options) => buildAngularFile.buildValueFile(options, 'value'));
components.set('config', (options) => buildAngularFile.buildFunctionFile(options, 'config'));
components.set('run', (options) => buildAngularFile.buildFunctionFile(options, 'config'));
components.set('route', (options) => buildAngularFile.buildFunctionFile(options, 'route'));
components.set('provider', (options) => buildAngularFile.buildFunctionFile(options, 'provider'));
components.set('filter', (options) => buildAngularFile.buildFunctionFile(options, 'filter'));

module.exports = {
    buildFactory: (options) => components.get('factory')(options),
    buildController: (options) => components.get('controller')(options),
    buildService: (options) => components.get('service')(options),
    buildDirective: (options) => components.get('directive')(options),
    buildConstant: (options) => components.get('constant')(options),
    buildValue: (options) => components.get('value')(options),
    buildConfig: (options) => components.get('config')(options),
    buildRun: (options) => components.get('run')(options),
    buildRoute: (options) => components.get('route')(options),
    buildProvider: (options) => components.get('provider')(options),
    buildFilter: (options) => components.get('filter')(options),
    buildModule: (options) => buildAngularFile.buildModuleFile(options),
    buildModuleExports: (options) => buildAngularFile.buildModuleExportFile(options),
    buildExternalModuleExports: (options) => buildAngularFile.buildExternalModuleExportFile(options),
    buildComponent: (type, options) => {
        if (components.has(type)) {
            return components.get(type)(options);
        }
        throw new Error(`type ${type} not a defined component.`);
    }
};
