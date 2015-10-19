'use strict';
let proxyquire = require('proxyquire').noPreserveCache();


describe('filterImplementationTemplate', () => {
    let filterImplementationTemplate, inputs;//= require('./filterImplementationTemplate');

    beforeEach(() => {
        inputs = {
            mockDependencyDeclarations: jasmine.createSpyObj('dependencyDeclarations', ['format'])
        };

        filterImplementationTemplate = proxyquire('./filterImplementationTemplate', {
            '../implementationTemplateHelpers/dependencyDeclarations': inputs.mockDependencyDeclarations
        })
    });

    it('should correctly format the text', () => {

        const expectedBody = `'use strict';
import parentModule from './FooPlace.js';
let implementationKey = parentModule.dependencyKeys.controllerThings;
export default {
    implementation : implementationKey + 'Filter',
    filterName: implementationKey
};

function Foo(bar, stuff) { this.things = bar + stuff; }
Foo.$inject = [
    dependenciesNstuff
];

parentModule.module.filter(implementationKey, Foo);`;

        inputs.mockDependencyDeclarations.format.and.returnValue('dependenciesNstuff');
        let givenOptions = {
            parentModule: './FooPlace.js',
            name: 'controllerThings',
            functionName: 'Foo',
            source: 'function Foo(bar, stuff) { this.things = bar + stuff; }',
            dependencies: ['bar','stuff']
        };

        let givenBody = filterImplementationTemplate.format(givenOptions);

        expect(givenBody).toBe(expectedBody);
    });

    describe('dependencyDeclarations.format call', () => {
        let givenOptions, formatOptions;
        beforeEach(() => {
            givenOptions = {
                parentModule: './FooPlace.js',
                parentModuleName: 'FooPlace',
                name: 'controllerThings',
                functionName: 'Foo',
                source: 'function Foo(bar, stuff) { this.things = bar + stuff; }',
                dependencies: ['bar','stuff']
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