'use strict';
let valueImplementationTemplate = require('./valueImplementationTemplate');

describe('angularConstantImplementationTemplate', () => {
    it('should correctly format the text', () => {

        const expectedBody = `'use strict';

import parentModule from './FooPlace.js';
let implementationKey = parentModule.dependencyKeys.constantThings;
export default { implementation : implementationKey };

let value = { item:'bob', thing:'that' };

parentModule.module.constant(implementationKey, value);`;

        let givenOptions = {
            parentModule: './FooPlace.js',
            name: 'constantThings',
            valueDefinition: "{ item:'bob', thing:'that' }",
            type: 'constant'
        };

        let givenBody = valueImplementationTemplate.format(givenOptions);

        expect(givenBody).toBe(expectedBody);
    });
});