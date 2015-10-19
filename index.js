'use strict';
const buildAngularFile = require('./lib/baseTypes/buildAngularFile');

module.exports = {
    buildFactory: (options) => buildAngularFile.buildFunctionFile(options, 'factory'),
    buildController: (options) => buildAngularFile.buildFunctionFile(options, 'controller'),
    buildService: (options) => buildAngularFile.buildFunctionFile(options, 'service'),
    buildDirective: (options) => buildAngularFile.buildFunctionFile(options, 'directive'),
    buildConstant: (options) => buildAngularFile.buildValueFile(options, 'constant'),
    buildValue: (options) => buildAngularFile.buildValueFile(options, 'value'),
    buildConfig: (options) => buildAngularFile.buildFunctionFile(options, 'config'),
    buildRoute: (options) => buildAngularFile.buildFunctionFile(options, 'route'),
    buildProvider: (options) => buildAngularFile.buildProviderFile(options, 'provider'),
    buildFilter: (options) => buildAngularFile.buildFilterFile(options),
    buildModule: () => buildAngularFile.buildModuleFile(options),
    buildModuleExports: () => buildAngularFile.buildModuleExportFile(options)
};

