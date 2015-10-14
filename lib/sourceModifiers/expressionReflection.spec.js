'use strict';
const proxyquire = require('proxyquire').noPreserveCache();


const basicArrowFunctionWithFunctionInside = () => {
    function intelInside() { return 'oldCpuToFrys'; }
    return intelInside();
};

describe('expressionReflection', () => {
    let inputs, expressionReflection;

    beforeEach(() => {
        inputs = {
            mockEsprima: jasmine.createSpyObj('esprima', ['parse'])
        };

        expressionReflection = proxyquire('./expressionReflection', {
            esprima: inputs.mockEsprima
        });
    });

    describe('.getParsedSyntaxTree', () => {
        it('should pass "var inspectedFunction = {givenSource}" to esprima.parse', () => {
            let expected = "var inspectedFunction = snoozles;";
            let givenSource = "snoozles";
            expressionReflection.getParsedSyntaxTree(givenSource);
            expect(inputs.mockEsprima.parse).toHaveBeenCalledWith(expected);
        });

        it('should return the value returned from esprima.parse', () => {
            let expected = { id: 'winning' };
            inputs.mockEsprima.parse.and.returnValue(expected);
            let given = expressionReflection.getParsedSyntaxTree('dontCareAboutInputForThisTest');
            expect(given).toBe(expected);
        });
    });

    describe('.getExpressionValue', () => {
        const expected = { id: 'this is what matters' };
        const wrapped = { body: [ { declarations: [ { init: expected }]}]};

        beforeEach(() => {
            spyOn(expressionReflection, 'getParsedSyntaxTree');
            expressionReflection.getParsedSyntaxTree.and.returnValue(wrapped);
        });
        it('should pass given source to getParsedSyntaxTree', () => {
            let expectedSource = "more";
            expressionReflection.getExpressionValue(expectedSource);
            expect(expressionReflection.getParsedSyntaxTree).toHaveBeenCalledWith(expectedSource);
        });

        it('should return the first actual expression in the code', () => {
            let given = expressionReflection.getExpressionValue('things');
            expect(given).toBe(expected);
        });
    });

    describe('.getBasicExpressionValues', () => {
        const mockId = { name: 'thing' };
        let mockExpression = { id: mockId, type: 'mockType' };

        beforeEach(() => {
            spyOn(expressionReflection, 'getExpressionValue');
            expressionReflection.getExpressionValue.and.returnValue(mockExpression);
        });

        it('should pass source to getParsedSyntaxTree', () => {
            let expected = "sourceNstuff";
            expressionReflection.getBasicExpressionValues(expected);
            expect(expressionReflection.getExpressionValue).toHaveBeenCalledWith(expected);
        });

        describe('returnedValue.name', () => {
            it('should be the name of the expressions id if it exists', () => {
                let given = expressionReflection.getBasicExpressionValues('someSource');
                expect(given.name).toBe(mockId.name);
            });

            it('should be undefined if expression.id does not exist', () => {
                mockExpression.id = undefined;
                let given = expressionReflection.getBasicExpressionValues('someSource');
                expect(given.name).toBeUndefined();
            });
        });

        describe('returnedValue.type', () => {
            it('should be equal to the expressions type', () => {
                let given = expressionReflection.getBasicExpressionValues('someSource');
                expect(given.type).toBe(mockExpression.type);
            });
        });
    });

});