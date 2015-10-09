'use strict';
const proxyquire = require('proxyquire').noPreserveCache();


describe('replaceName', () => {
    let replaceName, mockExpressionReflection;
    const mockExpressionTypes = {
        classType: 'classYo',
        functionType: 'functionYo',
        arrowType: 'ArrowFunctionYo'
    };

    const testExpressionValues = {
        unnamedFunction: { type: mockExpressionTypes.functionType },
        namedFunction: { type: mockExpressionTypes.functionType, name: 'testFoo' },
        unnamedClass: { type: mockExpressionTypes.classType },
        namedClass: { type: mockExpressionTypes.classType, name: 'Wharg' },
        arrowFunction: { type: mockExpressionTypes.arrowFunction }
    };

    beforeEach(() => {
        mockExpressionReflection = jasmine.createSpyObj('expressionReflection', ['getBasicExpressionValues']);

        replaceName = proxyquire('./replaceName', {
            '../expressionTypes': mockExpressionTypes,
            '../expressionReflection': mockExpressionReflection
        });
    });

    describe('with an expressionValue defined', () => {

        it('should not attempt to parse the code', function () {
            replaceName.transform('foo', 'thing', testExpressionValues.namedClass);
            expect(mockExpressionReflection.getBasicExpressionValues).not.toHaveBeenCalled();
        });

        runTestSuite(testExpressionValues, true);
    });

    describe('without an expressionValue defined', () => {
        it('should attempt to parse the code', function () {
            let fakeSource = 'stuff';
            mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.namedClass);
            replaceName.transform('foo', fakeSource);
            expect(mockExpressionReflection.getBasicExpressionValues).toHaveBeenCalledWith(fakeSource);
        });

        runTestSuite(testExpressionValues, false);
    });

    function runTestSuite(testExpressionValues, givingExpression) {
        describe('with a function ', () => {
            describe('when unnamed', () => {
                let expressionValue, expectedError;
                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.unnamedFunction);
                    } else {
                        expressionValue = testExpressionValues.unnamedFunction;
                    }

                    expectedError = `no name to replace in given expression ${testExpressionValues.unnamedFunction.type}`;
                });

                it('should throw an error', () => {
                    let singleLine, multiLine;
                    singleLine = {
                        name: 'snuu',
                        basic: function () { return 'other things'; },
                        expectedError,
                        expressionValue
                    };

                    multiLine = {
                        name: 'snuu',
                        basic: function (things, stuff) {
                            var otherStuff = function (item) { return item + 5; };
                            return otherStuff(things) + otherStuff(stuff);
                        },
                        expectedError,
                        expressionValue
                    };
                    assertError(singleLine);
                    assertError(multiLine);
                });
            });

            describe('when named', () => {
                let expressionValue;

                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.namedFunction);
                    } else {
                        expressionValue = testExpressionValues.namedFunction;
                    }

                });

                it('should return the correct source code', () => {
                    let singleLine, multiLine;
                    singleLine = {
                        name: 'blar',
                        basic: function testFoo() { return 'things'; },
                        expected: function blar() { return 'things'; },
                        expressionValue
                    };

                    multiLine = {
                        name: 'blar',
                        basic: function testFoo() {
                            var otherThing = function () { return 'to sender'; };
                            return otherThing;
                        },
                        expected: function blar() {
                            var otherThing = function () { return 'to sender'; };
                            return otherThing;
                        },
                        expressionValue
                    };
                    assertSuccessfulInjectionInCode(singleLine);
                    assertSuccessfulInjectionInCode(multiLine);
                });
            });
        });

        describe('with a class', () => {
            describe('when unnamed', () => {
                let expressionValue, expectedError;
                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.unnamedClass);
                    } else {
                        expressionValue = testExpressionValues.unnamedClass;
                    }
                    expectedError = `no name to replace in given expression ${testExpressionValues.unnamedClass.type}`;
                });

                it('should throw an error', () => {
                    let singleLine, multiLine;
                    singleLine = {
                        name: 'snuu',
                        basic: class { constructor() { this.item = 'more'; } },
                        expectedError,
                        expressionValue
                    };

                    multiLine = {
                        name: 'snuu',
                        basic: class {
                            constructor() {
                                this.inconspicuousUnnamedFunction = function () { return 'otter'; };
                                this.needlessClassDeclaration = class { constructor () { this.item = 'needlessThings'; }};
                            }
                        },
                        expectedError,
                        expressionValue
                    };
                    assertError(singleLine);
                    assertError(multiLine);
                });
            });

            describe('when named', () => {
                let expressionValue;

                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.namedClass);
                    } else {
                        expressionValue = testExpressionValues.namedClass;
                    }
                });

                it('should return the correct source code', () => {
                    let singleLine, multiLine;

                    singleLine = {
                        name: 'ThingStuff',
                        basic: class Wharg { constructor() { this.item = 'other'; } },
                        expected: class ThingStuff { constructor() { this.item = 'other'; } },
                        expressionValue
                    };

                    multiLine = {
                        name: 'MoreStuff',
                        basic: class Wharg {
                            constructor() {
                                this.inconspicuousUnnamedFunction = function () { return 'other'; };
                                this.needlessClassDeclaration = class { constructor () { this.item = 'needless'; }};
                            }
                        },
                        expected: class MoreStuff {
                            constructor() {
                                this.inconspicuousUnnamedFunction = function () { return 'other'; };
                                this.needlessClassDeclaration = class { constructor () { this.item = 'needless'; }};
                            }
                        },
                        expressionValue
                    };
                    assertSuccessfulInjectionInCode(singleLine);
                    assertSuccessfulInjectionInCode(multiLine);
                });
            });
        });

        describe('with arrow functions', () => {
            let expectedError, expressionValue;
            beforeEach(() => {
                if(!givingExpression) {
                    mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.arrowFunction);
                } else {
                    expressionValue = testExpressionValues.arrowFunction;
                }

                expectedError = `given expression is a ${testExpressionValues.arrowFunction.type} and cannot be named.`;
            });

            it('should throw an error', () => {
                let singleLine, functionReturning, multiLine;

                singleLine = {
                    basic: () => 'foo',
                    expectedError,
                    expressionValue
                };

                functionReturning = {
                    basic: () => function () { return 'stuff'},
                    expectedError,
                    expressionValue
                };

                multiLine = {
                    basic: () => {
                        return function() { return 'things'; };
                    },
                    expectedError,
                    expressionValue
                };

                assertError(singleLine);
                assertError(functionReturning);
                assertError(multiLine);
            });
        });

    }

    function assertSuccessfulInjectionInCode(testValues) {
        let newSource = replaceName.transform(testValues.name, testValues.basic.toString(), testValues.expressionValue);
        expect(newSource).toBe(testValues.expected.toString());
    }

    function assertError(testValues) {
        expect( () => { replaceName.transform(testValues.name, testValues.basic.toString(), testValues.expressionValue); }).toThrow(testValues.expectedError);
    }
});
