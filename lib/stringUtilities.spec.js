'use strict';
const stringUtilities = require('./stringUtilities');

describe('stringUtilities', () => {
    it('.capitalizeFirstLetter should capitalize the first letter in the string', () => {
        const givenString = 'fooThingBar';
        let result = stringUtilities.capitalizeFirstLetter(givenString);
        expect(result).toBe('FooThingBar');
    });
});