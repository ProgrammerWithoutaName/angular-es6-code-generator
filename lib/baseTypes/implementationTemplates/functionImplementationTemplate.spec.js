'use strict';
let functionImplementationTemplate= require('./functionImplementationTemplate');

describe('functionImplementationTemplate', () => {
    it('should correctly format the text', () => {

        const expectedBody = `'use strict';
import parentModule from './FooPlace.js';
let implementationKey = parentModule.dependencyKeys.controllerThings;
export default { implementation : implementationKey };

function Foo(bar, stuff) { this.things = bar + stuff; }
Foo.$inject = ['bar', 'stuff'];
parentModule.module.controller(implementationKey, Foo);`;

        let givenOptions = {
            parentModule: './FooPlace.js',
            name: 'controllerThings',
            functionName: 'Foo',
            source: 'function Foo(bar, stuff) { this.things = bar + stuff; }',
            dependencies: ['bar','stuff'],
            type: 'controller'
        };

        let givenBody = functionImplementationTemplate.format(givenOptions);

        expect(givenBody).toBe(expectedBody);
    });
});