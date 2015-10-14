'use strict';
const proxyquire = require('proxyquire').noPreserveCache();

describe('expressionDeclarationModifier', () => {
    let inputs, expressionDeclarationModifier;

    beforeEach(() => {
        inputs = {
            mockExpressionNameModifier: jasmine.createSpyObj('expressionNameModifier', ['getName'])
        };

        expressionDeclarationModifier = proxyquire('./expressionDeclarationModifier', {
            './expressionNameModifier': inputs.mockExpressionNameModifier
        });
    });

    it('should pass the baseFunctions source to expressionModifier.getName', () => {
        let expectedValue = { id: 'whatShouldGetPassedToGetName' };
        let inputOptions = {
            alternateName: 'foo',
            baseFunction: { toString: () => expectedValue }
        };

        expressionDeclarationModifier.buildExpressionDeclaration(inputOptions);
        expect(inputs.mockExpressionNameModifier.getName).toHaveBeenCalledWith(expectedValue);
    });

    describe('when expressionNameModifier.getName returns a value', () => {
        let returnValue, getNameReturn, inputOptions, baseFunctionToStringReturn;

        beforeEach(() => {
            getNameReturn = 'test';
            baseFunctionToStringReturn = 'stuff';
            inputOptions = {
                alternateName: 'thing',
                baseFunction: { toString: () => baseFunctionToStringReturn }
            };
            inputs.mockExpressionNameModifier.getName.and.returnValue(getNameReturn);
            returnValue = expressionDeclarationModifier.buildExpressionDeclaration(inputOptions);
        });

        it('should set returnValue.name to the value returned from getName', () => {
            expect(returnValue.name).toBe(getNameReturn);
        });

        it('should set returnValue.source to options.baseFunction.toString()', () => {
            expect(returnValue.source).toBe(baseFunctionToStringReturn);
        });
    });

    describe('when expressionNameModifier.getName returns undefined', () => {
        let returnValue, getNameReturn, inputOptions, baseFunctionToStringReturn;

        beforeEach(() => {
            getNameReturn = 'test';
            baseFunctionToStringReturn = 'stuff';
            inputOptions = {
                alternateName: 'thing',
                baseFunction: { toString: () => baseFunctionToStringReturn }
            };
            returnValue = expressionDeclarationModifier.buildExpressionDeclaration(inputOptions);
        });

        it('should set returnValue.name to options.alternateName', () => {
            expect(returnValue.name).toBe(inputOptions.alternateName);
        });

        it('should set returnValue.source to assign the given function to a variable named after options.alternateName', () => {
            expect(returnValue.source).toBe('let thing = stuff;');
        });
    });

});