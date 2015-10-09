'use strict';
const proxyquire = require('proxyquire').noPreserveCache();


describe('injectName', () => {
    let injectName, mockExpressionReflection;
    const mockExpressionTypes = {
        classType: 'classYo',
        functionType: 'functionYo',
        arrowType: 'ArrowFunctionYo'
    };

    const testExpressionValues = {
        unnamedFunction: { type: mockExpressionTypes.functionType },
        namedFunction: { type: mockExpressionTypes.functionType, name: 'blarg' },
        unnamedClass: { type: mockExpressionTypes.classType },
        namedClass: { type: mockExpressionTypes.classType, name: 'blarg' },
        arrowFunction: { type: mockExpressionTypes.arrowFunction }
    };

    beforeEach(() => {
        mockExpressionReflection = jasmine.createSpyObj('expressionReflection', ['getBasicExpressionValues']);

        injectName = proxyquire('./injectName', {
            '../expressionTypes': mockExpressionTypes,
            '../expressionReflection': mockExpressionReflection
        });
    });

    describe('with an expressionValue defined', () => {

        it('should not attempt to parse the code', function () {
            injectName.transform('foo', 'thing', testExpressionValues.unnamedClass);
            expect(mockExpressionReflection.getBasicExpressionValues).not.toHaveBeenCalled();
        });

        runTestSuite(testExpressionValues, true);
    });

    describe('without an expressionValue defined', () => {
        it('should attempt to parse the code', function () {
            let fakeSource = 'stuff';
            mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.unnamedClass);
            injectName.transform('foo', fakeSource);
            expect(mockExpressionReflection.getBasicExpressionValues).toHaveBeenCalledWith(fakeSource);
        });

        runTestSuite(testExpressionValues, false);
    });

    function runTestSuite(testExpressionValues, givingExpression) {
        describe('with a function ', () => {
            describe('when unnamed', () => {
                let expressionValue;
                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.unnamedFunction);
                    } else {
                        expressionValue = testExpressionValues.unnamedFunction;
                    }
                });

                it('should return the correct source code', () => {
                    let singleLine, multiLine;
                    singleLine = {
                        name: 'snuu',
                        basic: function () { return 'other things'; },
                        expected: function snuu() { return 'other things'; },
                        expressionValue
                    };

                    multiLine = {
                        name: 'snuu',
                        basic: function (things, stuff) {
                            var otherStuff = function (item) { return item + 5; };
                            return otherStuff(things) + otherStuff(stuff);
                        },
                        expected: function snuu(things, stuff) {
                            var otherStuff = function (item) { return item + 5; };
                            return otherStuff(things) + otherStuff(stuff);
                        },
                        expressionValue
                    };
                    assertSuccessfulInjectionInCode(singleLine);
                    assertSuccessfulInjectionInCode(multiLine);
                });
            });

            describe('when named', () => {
                let expectedError, expressionValue;

                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.namedFunction);
                    } else {
                        expressionValue = testExpressionValues.namedFunction;
                    }

                    expectedError = `given expression ${testExpressionValues.namedFunction.type} already has a name of ${testExpressionValues.namedFunction.name}`;
                });

                it('should throw an error', () => {
                    let singleLine, multiLine;
                    singleLine = {
                        name: 'stuff',
                        basic: function foo() { return 'things'; },
                        expectedError,
                        expressionValue
                    };

                    multiLine = {
                        name: 'stuff',
                        basic: function fooBar() {
                            var otherThing = function () { return 'to sender'; };
                            return otherThing;
                        },
                        expectedError,
                        expressionValue
                    };
                    assertError(singleLine);
                    assertError(multiLine);
                });
            });
        });

        describe('with a class', () => {
            describe('when unnamed', () => {
                let expressionValue;
                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.unnamedClass);
                    } else {
                        expressionValue = testExpressionValues.unnamedClass;
                    }
                });

                it('should return the correct source code', () => {
                    let singleLine, multiLine;
                    singleLine = {
                        name: 'snuu',
                        basic: class { constructor() { this.item = 'more'; } },
                        expected: class snuu{ constructor() { this.item = 'more'; } },
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
                        expected: class snuu{
                            constructor() {
                                this.inconspicuousUnnamedFunction = function () { return 'otter'; };
                                this.needlessClassDeclaration = class { constructor () { this.item = 'needlessThings'; }};
                            }
                        },
                        expressionValue
                    };
                    assertSuccessfulInjectionInCode(singleLine);
                    assertSuccessfulInjectionInCode(multiLine);
                });
            });
            describe('when named', () => {
                let expectedError, expressionValue;

                beforeEach(() => {
                    if(!givingExpression) {
                        mockExpressionReflection.getBasicExpressionValues.and.returnValue(testExpressionValues.namedClass);
                    } else {
                        expressionValue = testExpressionValues.namedClass;
                    }

                    expectedError = `given expression ${testExpressionValues.namedClass.type} already has a name of ${testExpressionValues.namedClass.name}`;
                });

                it('should throw an error', () => {
                    let singleLine, multiLine;

                    singleLine = {
                        name: 'stuff',
                        basic: class Foo { constructor() { this.item = 'other'; } },
                        expectedError,
                        expressionValue,
                    };

                    multiLine = {
                        name: 'stuff',
                        basic: class Wharg {
                            constructor() {
                                this.inconspicuousUnnamedFunction = function () { return 'other'; };
                                this.needlessClassDeclaration = class { constructor () { this.item = 'needless'; }};
                            }
                        },
                        expectedError,
                        expressionValue,
                    };
                    assertError(singleLine);
                    assertError(multiLine);
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
                    name: 'stuff',
                    basic: () => 'foo',
                    expectedError,
                    expressionValue
                };

                functionReturning = {
                    name: 'stuff',
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
        let newSource = injectName.transform(testValues.name, testValues.basic.toString(), testValues.expressionValue);
        expect(newSource).toBe(testValues.expected.toString());
    }

    function assertError(testValues) {
        expect( () => { injectName.transform(testValues.name, testValues.basic.toString(), testValues.expressionValue); }).toThrow(testValues.expectedError);
    }
});
