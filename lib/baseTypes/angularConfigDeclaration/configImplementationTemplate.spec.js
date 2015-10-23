'use strict';
let proxyquire = require('proxyquire').noPreserveCache();


describe('configImplementationTemplate', () => {
    let filterImplementationTemplate, inputs;

    beforeEach(() => {
        inputs = {
            mockDependencyDeclarations: jasmine.createSpyObj('dependencyDeclarations', ['format'])
        };

        filterImplementationTemplate = proxyquire('./configImplementationTemplate', {
            '../implementationTemplateHelpers/dependencyDeclarations': inputs.mockDependencyDeclarations
        })
    });

    it('should correctly format the text', () => {

        const expectedBody = `'use strict';
import parentModule from './FooPlace.js';

function fooConfig(bar, stuff) { this.things = bar + stuff; }
fooConfig.$inject = [
    dependenciesNstuff
];

parentModule.module.config(fooConfig);`;

        inputs.mockDependencyDeclarations.format.and.returnValue('dependenciesNstuff');
        let givenOptions = {
            parentModule: './FooPlace.js',
            functionName: 'fooConfig',
            source: 'function fooConfig(bar, stuff) { this.things = bar + stuff; }',
            dependencies: ['bar','stuff'],
            type: 'config'
        };

        let givenBody = filterImplementationTemplate.format(givenOptions);

        expect(givenBody).toBe(expectedBody);
    });

    describe('dependencyDeclarations.format call', () => {
        let givenOptions, formatOptions;
        beforeEach(() => {
            givenOptions = {
                parentModule: './FooPlace.js',
                functionName: 'fooConfig',
                source: 'function fooConfig(bar, stuff) { this.things = bar + stuff; }',
                dependencies: ['bar','stuff'],
                type: 'config'
            };
            filterImplementationTemplate.format(givenOptions);
            formatOptions = inputs.mockDependencyDeclarations.format.calls.mostRecent().args[0];
        });

        it('should be given an indent of 1', () => expect(formatOptions.indent).toBe(1));
        it('should be given the correct parentModuleName', () => expect(formatOptions.parentModuleName).toBe(givenOptions.parentModuleName));
        it('should be given "parentModule" as the accessName', () => expect(formatOptions.accessName).toBe('parentModule'));
        it('should be given dependencies defined in the options passed in', () => expect(formatOptions.dependencies).toBe(givenOptions.dependencies));
    });

});