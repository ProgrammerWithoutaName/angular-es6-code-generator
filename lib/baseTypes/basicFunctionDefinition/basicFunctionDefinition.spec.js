'use strict';
let proxyquire = require('proxyquire').noPreserveCache();

describe('basicFunctionDefinition', () => {
    let inputs, basicFunctionDefinition;

    beforeEach(() => {
        inputs = {
            mockFs: jasmine.createSpyObj('fs-promise', ['writeFile']),
            mockPath: jasmine.createSpyObj('path', ['join']),
            mockAngularFilenameFormatters: jasmine.createSpyObj('angularFilenameFormatters', ['factory', 'controller', 'service']),
            mockFunctionImplementationTemplate: jasmine.createSpyObj('functionImplementationTemplate',['format']),
            mockFunctionDeclarationTemplate: jasmine.createSpyObj('functionDeclarationTemplate',['format']),
            mockExpressionNameModifier: jasmine.createSpyObj('expressionNameModifier', ['makeIntoTypeDefinition']),
            mockChangeIndent: jasmine.createSpyObj('indentChange', ['deindentSource'])
        };

        basicFunctionDefinition = proxyquire('./basicFunctionDefinition', {
            'fs-promise': inputs.mockFs,
            'path': inputs.mockPath,
            '../../angularFilenameFormatters': inputs.mockAngularFilenameFormatters,
            './functionImplementationTemplate': inputs.mockFunctionImplementationTemplate,
            './functionDeclarationTemplate': inputs.mockFunctionDeclarationTemplate,
            '../../sourceModifiers/expressionNameModifier': inputs.mockExpressionNameModifier,
            '../implementationTemplateHelpers/changeIndent': inputs.mockChangeIndent
        });
    });

    function setReturnValues(options) {
        options = options || {};
        inputs.mockFs.writeFile.and.returnValue(options.fsWriteFile || {});
        inputs.mockPath.join.and.returnValue(options.join || '');
        inputs.mockAngularFilenameFormatters.factory.and.returnValue(options.factoryNameFormat || '');
        inputs.mockAngularFilenameFormatters.controller.and.returnValue(options.controllerNameFormat || '');
        inputs.mockAngularFilenameFormatters.service.and.returnValue(options.serviceNameFormat || '');
        inputs.mockFunctionImplementationTemplate.format.and.returnValue(options.functionImplementation || {});
        inputs.mockFunctionDeclarationTemplate.format.and.returnValue(options.functionDeclarationFormat || {});
        inputs.mockExpressionNameModifier.makeIntoTypeDefinition.and.returnValue(options.expressionNameModifier || {});
        inputs.mockChangeIndent.deindentSource.and.returnValue(options.deindentSource || []);
    }

    describe('functionDeclarationTemplate call', () => {
        let inputOptions, formatCallOptions;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                name: 'foo',
                dependencies: [],
                functionImplementation: function thisThing () {},
                type: 'factory'
            };
            setReturnValues();
            basicFunctionDefinition.build(inputOptions);
            formatCallOptions = inputs.mockFunctionDeclarationTemplate.format.calls.mostRecent().args[0];
        });

        it('should be called with options.name set to name', () => expect(formatCallOptions.name).toBe(inputOptions.name) );

        it('should be called with options.baseFunction set to functionImplementation', () =>
            expect(formatCallOptions.baseFunction).toBe(inputOptions.functionImplementation)
        );
    });

    describe('functionImplementationTemplate.format call', () => {
        let inputOptions, functionDeclarationTemplateReturnValue, formatCallOptions, deindentSourceReturn;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                parentModuleName: 'place',
                name: 'foo',
                dependencies: [],
                functionImplementation: function thisThing () {},
                type: 'factory'
            };

            functionDeclarationTemplateReturnValue = {
                name: 'moo',
                source: 'sourceAndStuffThings'
            };

            deindentSourceReturn = ['foo', 'bar', 'moreLine'];

            setReturnValues({ functionDeclarationFormat: functionDeclarationTemplateReturnValue, deindentSource: deindentSourceReturn});
            basicFunctionDefinition.build(inputOptions);
            formatCallOptions = inputs.mockFunctionImplementationTemplate.format.calls.mostRecent().args[0];
        });

        it('should call deindentSource with the source value returned from functionDeclarationTemplate.format', () => {
            expect(inputs.mockChangeIndent.deindentSource).toHaveBeenCalledWith(functionDeclarationTemplateReturnValue.source);
        });

        it('should set parentModule to given parentModuleRelativeLocation', () => {
            expect(formatCallOptions.parentModule).toBe(inputOptions.parentModuleRelativeLocation);
        });

        it('should set parentModuleName to given parentModuleName', () => {
            expect(formatCallOptions.parentModuleName).toBe(inputOptions.parentModuleName);
        });

        it('should set name to given name', () => {
            expect(formatCallOptions.name).toBe(inputOptions.name);
        });

        it('should set source to changeIndent.deindentSource joined with new lines', () => {
            expect(formatCallOptions.source).toBe(deindentSourceReturn.join('\n'));
        });

        it('should set functionName to functionDeclarationTemplate.format returned value.name', () => {
            expect(formatCallOptions.functionName).toBe(functionDeclarationTemplateReturnValue.name);
        });

        it('should set dependencies to given options.dependencies', () => {
            expect(formatCallOptions.dependencies).toBe(inputOptions.dependencies);
        });

        it('should set type to options.type', () => {
            expect(formatCallOptions.type).toBe(inputOptions.type);
        });
    });

    describe('expressionNameModifier.makeIntoTypeDefinition call', () => {
        let inputOptions, typeDefinitionReturnValue, typeDefinitionCallArguments;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                name: 'foo',
                dependencies: [],
                functionImplementation: function thisThing () {},
                type: 'controller'
            };

            typeDefinitionReturnValue = {
                name: 'moo',
                source: 'sourceAndStuffThings'
            };

            setReturnValues({ expressionNameModifier: typeDefinitionReturnValue});

            basicFunctionDefinition.build(inputOptions);
            typeDefinitionCallArguments = inputs.mockExpressionNameModifier.makeIntoTypeDefinition.calls.mostRecent().args;
        });

        it('should pass the given function to expressionNameModifier.makeIntoTypeDefinition', () => {
            expect(typeDefinitionCallArguments[1]).toBe(inputOptions.functionImplementation);
        });

        it('should pass an empty function to expressionNameModifier.makeIntoTypeDefinition if one does not exist', () => {
            let inputOptions = {
                parentModuleRelativeLocation: 'dontcare',
                name: 'doesntMatter',
                dependencies: ['doesnt', 'matter'],
                type: 'controller'
            };

            basicFunctionDefinition.build(inputOptions);
            let givenTypeFunction = inputs.mockExpressionNameModifier.makeIntoTypeDefinition.calls.mostRecent().args[1];
            expect(givenTypeFunction.toString()).toBe("function () { }");
        });

        it('should pass the given controller name to expressionNameModifier', () => {
            expect(typeDefinitionCallArguments[0]).toBe(inputOptions.name);
        });

        it('should call expressionNameModifier.makeIntoTypeDefinition for types of controller and service', () => {
            let types = ['controller', 'service'];

            types.forEach( (type) => {
                inputOptions.type = type;
                basicFunctionDefinition.build(inputOptions);
                expect(inputs.mockExpressionNameModifier.makeIntoTypeDefinition).toHaveBeenCalled();
            });
        });
    });

    it('should angularFilenameFormatters of the correct type with the given options.name', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {},
            type: 'factory'
        };

        setReturnValues();
        basicFunctionDefinition.build(inputOptions);

        expect(inputs.mockAngularFilenameFormatters.factory).toHaveBeenCalledWith(inputOptions.name);
    });

    it('should call path.join with options.serviceFilePath and filename to generate the fileName', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {},
            type: 'factory'
        };

        let expectedFilename = 'dancingFooThingsStuff.js';

        setReturnValues({ factoryNameFormat: expectedFilename});
        basicFunctionDefinition.build(inputOptions);

        expect(inputs.mockPath.join).toHaveBeenCalledWith(inputOptions.filePath, expectedFilename);
    });

    it('should call fs.writeFile with the results of path.join for the filename, and the results of functionImplementationTemplate.format for the fileBody', () => {
        let expectedSource = 'sourceFooStuff';
        let expectedFilename = 'thingsStuffName';
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {},
            type: 'factory'
        };

        setReturnValues({ join: expectedFilename, functionImplementation: expectedSource});
        basicFunctionDefinition.build(inputOptions);
        expect(inputs.mockFs.writeFile).toHaveBeenCalledWith(expectedFilename, expectedSource);
    });

    it('should return the promise returned by fs.writeFile', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {},
            type: 'factory'
        };
        let expectedOutput = {id: 'this is expected!'};

        setReturnValues({ fsWriteFile: expectedOutput});

        let givenOutput = basicFunctionDefinition.build(inputOptions);
        expect(givenOutput).toBe(expectedOutput);
    });
});