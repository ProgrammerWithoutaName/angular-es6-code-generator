'use strict';
let functionImplementationTemplate= require('./providerImplementationTemplate');

describe('providerImplementationTemplate', () => {
    it('should correctly format the text', () => {

        const expectedBody = `'use strict';
import parentModule from './FooPlace.js';
let implementationKey = parentModule.dependencyKeys.providerThings;
export default { implementation : implementationKey };

function Foo(bar, stuff) { this.things = bar + stuff; }
parentModule.module.provider(implementationKey, Foo);`;

        let givenOptions = {
            parentModule: './FooPlace.js',
            name: 'providerThings',
            functionName: 'Foo',
            source: 'function Foo(bar, stuff) { this.things = bar + stuff; }'
        };

        let givenBody = functionImplementationTemplate.format(givenOptions);

        expect(givenBody).toBe(expectedBody);
    });
});