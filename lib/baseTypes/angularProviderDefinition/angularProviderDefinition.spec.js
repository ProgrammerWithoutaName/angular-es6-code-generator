'use strict';
let proxyquire = require('proxyquire').noPreserveCache();

describe('angularProviderDefinition', () => {
    let inputs, angularProviderDefinition;

    beforeEach(() => {
        inputs = {
            mockFs: jasmine.createSpyObj('fs-promise', ['writeFile']),
            mockPath: jasmine.createSpyObj('path', ['join']),
            mockAngularFilenameFormatters: jasmine.createSpyObj('angularFilenameFormatters', ['provider']),
            mockProviderImplementationTemplate: jasmine.createSpyObj('functionImplementationTemplate',['format']),
            mockExpressionNameModifier: jasmine.createSpyObj('expressionNameModifier', ['makeIntoTypeDefinition'])
        };

        angularProviderDefinition = proxyquire('./angularProviderDefinition', {
            'fs-promise': inputs.mockFs,
            'path': inputs.mockPath,
            '../../angularFilenameFormatters': inputs.mockAngularFilenameFormatters,
            './providerImplementationTemplate': inputs.mockProviderImplementationTemplate,
            '../../sourceModifiers/expressionNameModifier': inputs.mockExpressionNameModifier
        });
    });

    it('should call expressionNameModifier.makeIntoTypeDefinition with the supplied name and implementation', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {}
        };

        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue({});

        angularProviderDefinition.build(inputOptions);
        expect(inputs.mockExpressionNameModifier.makeIntoTypeDefinition).toHaveBeenCalledWith(inputOptions.name, inputOptions.functionImplementation);
    });

    it('should pass an empty function to expressionNameModifier.makeIntoTypeDefinition if one does not exist', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'dontcare',
            name: 'doesntMatter'
        };

        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue({});
        angularProviderDefinition.build(inputOptions);
        let givenTypeFunction = inputs.mockExpressionNameModifier.makeIntoTypeDefinition.calls.mostRecent().args[1];
        expect(givenTypeFunction.toString()).toBe("function () { }");
    });

    describe('functionImplementationTemplate.format call', () => {
        let inputOptions, formatCallOptions, typeDefinitionReturnValue;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                name: 'foo',
                functionImplementation: function thisThing () {}
            };

            typeDefinitionReturnValue = {
                name: 'moo',
                source: 'sourceAndStuffThings'
            };

            inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue(typeDefinitionReturnValue);
            angularProviderDefinition.build(inputOptions);
            formatCallOptions = inputs.mockProviderImplementationTemplate.format.calls.mostRecent().args[0];
        });

        it('should set parentModule to given parentModuleRelativeLocation', () => {
            expect(formatCallOptions.parentModule).toBe(inputOptions.parentModuleRelativeLocation);
        });

        it('should set name to given name', () => {
            expect(formatCallOptions.name).toBe(inputOptions.name);
        });

        it('should set source to expressionNameModifier.makeIntoTypeDefinition returned value.source', () => {
            expect(formatCallOptions.source).toBe(typeDefinitionReturnValue.source);
        });

        it('should set functionName to expressionNameModifier.makeIntoTypeDefinition returned value.name', () => {
            expect(formatCallOptions.functionName).toBe(typeDefinitionReturnValue.name);
        });
    });

    it('should call angularFilenameFormatters.provider with the given options.name', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            name: 'foo',
            functionImplementation: function thisThing () {}
        };

        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue({});

        angularProviderDefinition.build(inputOptions);

        expect(inputs.mockAngularFilenameFormatters.provider).toHaveBeenCalledWith(inputOptions.name);
    });

    it('should call path.join with options.serviceFilePath and filename to generate the fileName', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            functionImplementation: function thisThing () {}
        };

        let expectedFilename = 'dancingFooThingsStuff.js';

        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue({});
        inputs.mockAngularFilenameFormatters.provider.and.returnValue(expectedFilename);
        angularProviderDefinition.build(inputOptions);

        expect(inputs.mockPath.join).toHaveBeenCalledWith(inputOptions.filePath, expectedFilename);
    });

    it('should call fs.writeFile with the results of path.join for the filename, and the results of functionImplementationTemplate.format for the fileBody', () => {
        let expectedSource = 'sourceFooStuff';
        let expectedFilename = 'thingsStuffName';
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            functionImplementation: function thisThing () {}
        };
        inputs.mockPath.join.and.returnValue(expectedFilename);
        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue({});
        inputs.mockProviderImplementationTemplate.format.and.returnValue(expectedSource);
        angularProviderDefinition.build(inputOptions);
        expect(inputs.mockFs.writeFile).toHaveBeenCalledWith(expectedFilename, expectedSource);
    });

    it('should return the promise returned by fs.writeFile', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            functionImplementation: function thisThing () {}
        };
        let expectedOutput = {id: 'this is expected!'};

        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue({});
        inputs.mockFs.writeFile.and.returnValue(expectedOutput);
        let givenOutput = angularProviderDefinition.build(inputOptions);
        expect(givenOutput).toBe(expectedOutput);
    });
});