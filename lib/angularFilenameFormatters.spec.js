'use strict';
const angularFilenameFormatters = require('./angularFilenameFormatters');

describe('angularFilenameFormats', () => {
    let inputs;
    beforeEach(() => {
        inputs = { name: 'foo' };
    });

    function assertCorrectName(testCall, subName) {
        let expected = subName ? `${inputs.name}.${subName}.es6` : `${inputs.name}.es6`;
        let results = testCall(inputs.name);
        expect(results).toBe(expected);
    }

    it('.config() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.config, 'config'));

    it('.constant() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.constant, 'constant'));

    it('.controller() should create the correct fileName', () => {
        let fooControllerName = 'fooController';
        let results = angularFilenameFormatters.controller(fooControllerName);
        expect(results).toBe('foo.controller.es6');
    });

    it('.controller() should only replace the last instance of "Controller"', () => {
        let fooControllerName = 'thingControllerController';
        let results = angularFilenameFormatters.controller(fooControllerName);
        expect(results).toBe('thingController.controller.es6');
    });

    it('.directive() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.directive, 'directive'));

    it('.factory() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.factory, 'factory'));

    it('.module() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.module, 'module'));

    it('.moduleExport() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.moduleExport));

    it('.provider() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.provider, 'provider'));

    it('.route() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.route, 'config'));

    it('.service() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.service, 'service'));

    it('.value() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.value, 'value'));

    it('.run() should create the correct fileName',
        () => assertCorrectName(angularFilenameFormatters.run, 'run'));

});
