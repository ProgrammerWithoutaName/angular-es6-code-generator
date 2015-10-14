'use strict';
const buildAngularFile = require('./buildAngularFile');

module.exports = {
    buildFactory: (options) => buildAngularFile.buildFunctionFile(options, 'factory'),
    buildController: (options) => buildAngularFile.buildFunctionFile(options, 'controller'),
    buildService: (options) => buildAngularFile.buildFunctionFile(options, 'service'),
    buildDirective: (options) => buildAngularFile.buildFunctionFile(options, 'directive'),
    buildFilter: (options) => buildAngularFile.buildFunctionFile(options, 'filter'),
    buildConstant: (options) => buildAngularFile.buildValueFile(options, 'constant'),
    buildValue: (options) => buildAngularFile.buildValueFile(options, 'value'),
    buildConfig: (options) => buildAngularFile.buildFunctionFile(options, 'config'),
    buildRoute: (options) => buildAngularFile.buildFunctionFile(options, 'route'),
    buildProvider: () => { throw 'not yet implemented'; },
    buildModule: () => { throw 'not yet implemented'; },
    buildModuleExports: () => { throw 'not yet implemented'; }
};

