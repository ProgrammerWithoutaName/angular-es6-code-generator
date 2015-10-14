'use strict';
let proxyquire = require('proxyquire').noPreserveCache();

describe('functionDeclarationTemplate', () => {
    let inputs, functionDeclarationTemplate;

    beforeEach(() => {
        inputs = {
            mockStringUtilities: jasmine.createSpyObj('stringUtilities', ['capitalizeFirstLetter']),
            mockExpressionDeclarationModifier: jasmine.createSpyObj('expressionDeclarationModifier', ['buildExpressionDeclaration'])
        };

        functionDeclarationTemplate = proxyquire('./functionDeclarationTemplate', {
            '../../sourceModifiers/expressionDeclarationModifier': inputs.mockExpressionDeclarationModifier,
            '../../stringUtilities': inputs.mockStringUtilities
        });
    });

    it('should call stringUtilities.capitalizeFirstLetter on the given name', () => {
        let inputOptions = {
            name: 'thatService',
            baseFunction: function foo() {}
        };
        functionDeclarationTemplate.format(inputOptions);
        expect(inputs.mockStringUtilities.capitalizeFirstLetter).toHaveBeenCalledWith(inputOptions.name);
    });

    it('should call expressionDeclarationModifier.buildDeclaration with the correct alternateName', () => {
        let inputOptions = {
            name: 'thatService',
            baseFunction: function foo() {}
        };

        inputs.mockStringUtilities.capitalizeFirstLetter.and.returnValue('Foo');
        functionDeclarationTemplate.format(inputOptions);
        let givenDeclarationOptions = inputs.mockExpressionDeclarationModifier.buildExpressionDeclaration.calls.mostRecent().args[0];
        expect(givenDeclarationOptions.alternateName).toBe('buildFoo');
    });

    it('should call expressionDeclarationModifier with the given base function', () => {
        let inputOptions = {
            name: 'thatService',
            baseFunction: function foo() {}
        };


        inputs.mockStringUtilities.capitalizeFirstLetter.and.returnValue('Foo');
        functionDeclarationTemplate.format(inputOptions);
        let givenDeclarationOptions = inputs.mockExpressionDeclarationModifier.buildExpressionDeclaration.calls.mostRecent().args[0];
        expect(givenDeclarationOptions.baseFunction).toBe(inputOptions.baseFunction);
    });

    it('should return what expressionDeclarationModifier returns', () => {
        let expectedResults = {id:'this is expected back'};
        inputs.mockStringUtilities.capitalizeFirstLetter.and.returnValue('Foo');
        inputs.mockExpressionDeclarationModifier.buildExpressionDeclaration.and.returnValue(expectedResults);
        let results = functionDeclarationTemplate.format({});
        expect(results).toBe(expectedResults);
    });
});