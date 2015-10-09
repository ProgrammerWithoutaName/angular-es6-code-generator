'use strict';
const proxyquire = require('proxyquire').noPreserveCache();

describe('expressionNameModifier', () => {
    let inputs, expressionNameModifier;

    beforeEach(() => {
        inputs = {
            mockStringUtilities: jasmine.createSpyObj('stringUtilities', ['capitalizeFirstLetter']),
            mockInjectName: jasmine.createSpyObj('injectName', ['transform']),
            mockReplaceName: jasmine.createSpyObj('replaceName', ['transform']),
            mockExpressionReflection: jasmine.createSpyObj('expressionReflection', ['getBasicExpressionValues']),
            mockExpressionTypes: {
                classType: 'mockClass',
                functionType: 'mockFunction',
                differentType: 'something'
            }
        };

       expressionNameModifier = proxyquire('./expressionNameModifier', {
           '../stringUtilities': inputs.mockStringUtilities,
           './expressionNameModifiers/injectName': inputs.mockInjectName,
           './expressionNameModifiers/replaceName': inputs.mockReplaceName,
           './expressionReflection': inputs.mockExpressionReflection,
           './expressionTypes': inputs.mockExpressionTypes
       });
    });

    describe('.getName', () => {
        it('should return the expressions name if its a classType', () => {
            let expectedName = 'thatName';
            inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue({
                name: expectedName,
                type: inputs.mockExpressionTypes.classType
            });
            let results = expressionNameModifier.getName('fakeSource');
            expect(results).toBe(expectedName);
        });

        it('should return the expressions name if its a functionType', () => {
            let expectedName = 'thatName';
            inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue({
                name: expectedName,
                type: inputs.mockExpressionTypes.functionType
            });
            let results = expressionNameModifier.getName('fakeSource');
            expect(results).toBe(expectedName);
        });

        it('should return undefined if the expression is not a classType or functionType', () => {
            inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue({
                name: 'stuff',
                type: inputs.mockExpressionTypes.differentType
            });
            let results = expressionNameModifier.getName('fakeSource');
            expect(results).toBeUndefined();
        });

        runGetBasicExpressionValueTestSuite((source, expressionValue) =>
            expressionNameModifier.getName(source, expressionValue));
    });

    describe('.setName', () => {

        describe('when expression has a name', () => {
            it('should call replaceName.transform with given name, source, and expressionValue', () => {
                let expectedName = 'thing';
                let expectedExpression = "stuff";
                let expectedExpressionValue = {
                    name: 'other',
                    type: inputs.mockExpressionTypes.classType
                };
                inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue(expectedExpressionValue);
                expressionNameModifier.setName(expectedName, expectedExpression);
                expect(inputs.mockReplaceName.transform).toHaveBeenCalledWith(expectedName, expectedExpression, expectedExpressionValue);
            });

            it('should return the results from replaceName.transform', () => {
                let givenExpressionValue = {
                    name: 'other',
                    type: inputs.mockExpressionTypes.classType
                };
                let expectedResults = {id: 'replaceNameCalled'};
                inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue(givenExpressionValue);
                inputs.mockReplaceName.transform.and.returnValue(expectedResults);
                let results = expressionNameModifier.setName('things', 'stuff');
                expect(results).toBe(expectedResults);
            });
        });

        describe('when expression does not have a name', () => {
            it('should call injectName.transform with given name, source, and expressionValue', () => {
                let expectedName = 'thing';
                let expectedExpression = "stuff";
                let expectedExpressionValue = {
                    type: inputs.mockExpressionTypes.classType
                };
                inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue(expectedExpressionValue);
                expressionNameModifier.setName(expectedName, expectedExpression);
                expect(inputs.mockInjectName.transform).toHaveBeenCalledWith(expectedName, expectedExpression, expectedExpressionValue);
            });

            it('should return the results from injectName.transform', () => {
                let givenExpressionValue = {
                    type: inputs.mockExpressionTypes.classType
                };
                let expectedResults = {id: 'injectNameCalled'};
                inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue(givenExpressionValue);
                inputs.mockInjectName.transform.and.returnValue(expectedResults);
                let results = expressionNameModifier.setName('things', 'stuff');
                expect(results).toBe(expectedResults);
            });
        } );

        it('should throw an error if expression is not a classType or functionType', () => {
            inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue({type: inputs.mockExpressionTypes.differentType});
            expect( () => expressionNameModifier.setName('stuff', 'things')).toThrow('given expression cannot be named');
        });

        runGetBasicExpressionValueTestSuite((source, expressionValue) =>
            expressionNameModifier.setName('foo', source, expressionValue));
    });

    describe('.makeIntoTypeDefinition', () => {
        it('should call stringUtilities.capitalizeFirstLetter with the given name', () => {
            let expectedResults = 'foo';
            spyOn(expressionNameModifier, 'setName');
            expressionNameModifier.makeIntoTypeDefinition(expectedResults, 'something');
            expect(inputs.mockStringUtilities.capitalizeFirstLetter).toHaveBeenCalledWith(expectedResults);
        });

        it('should pass the results from stringUtilities.capitalizeFirstLetter, expression.toString, and given expressionValue to setName', () => {
            let expectedName = "thingStuff";
            let expectedExpression = "needMoreIdeas";
            let expectedExpressionValue = { id:'other' };

            inputs.mockStringUtilities.capitalizeFirstLetter.and.returnValue(expectedName);
            spyOn(expressionNameModifier, 'setName');
            expressionNameModifier.makeIntoTypeDefinition('name', expectedExpression, expectedExpressionValue);
        });

        it('should return an object with the correct values for name and source', () => {
            let expectedName = "thingStuff";
            let expectedSource = "Souuuurce";

            spyOn(expressionNameModifier, 'setName');
            inputs.mockStringUtilities.capitalizeFirstLetter.and.returnValue(expectedName);
            expressionNameModifier.setName.and.returnValue(expectedSource);
            let results = expressionNameModifier.makeIntoTypeDefinition('name', 'Thing');
            expect(results.name).toBe(expectedName);
            expect(results.source).toBe(expectedSource);
        });
    });

    function runGetBasicExpressionValueTestSuite(testRun) {
        it('should not call getBasicExpressionValues if an expressionValue is supplied', () => {
            testRun('fakeSource', { name:'bob', type:inputs.mockExpressionTypes.classType});
            expect(inputs.mockExpressionReflection.getBasicExpressionValues).not.toHaveBeenCalled();
        });

        it('should call getBasicExpressionValues with the given source if an expressionValue is supplied', () => {
            let expectedSource = 'source of the problem!';
            inputs.mockExpressionReflection.getBasicExpressionValues.and.returnValue({
                name: 'stuff',
                type: inputs.mockExpressionTypes.classType
            });
            testRun(expectedSource);
            expect(inputs.mockExpressionReflection.getBasicExpressionValues).toHaveBeenCalledWith(expectedSource);
        });
    }
});