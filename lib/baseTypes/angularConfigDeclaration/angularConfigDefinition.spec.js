'use strict';
let proxyquire = require('proxyquire').noPreserveCache();

describe('angularConfigDefinition', () => {
    let inputs, angularConfigDefinition;

    beforeEach(() => {
        inputs = {
            mockFs: jasmine.createSpyObj('fs-promise', ['writeFile']),
            mockPath: jasmine.createSpyObj('path', ['join']),
            mockAngularFilenameFormatters: jasmine.createSpyObj('angularFilenameFormatters', ['run', 'config', 'route']),
            mockConfigImplementationTemplate: jasmine.createSpyObj('functionImplementationTemplate',['format']),
            mockFunctionDeclarationTemplate: jasmine.createSpyObj('functionDeclarationTemplate',['format']),
            mockChangeIndent: jasmine.createSpyObj('indentChange', ['deindentSource']),
            mockStringUtilities: jasmine.createSpyObj('stringUtilities', ['capitalizeFirstLetter'])
        };

        angularConfigDefinition = proxyquire('./angularConfigDefinition', {
            'fs-promise': inputs.mockFs,
            'path': inputs.mockPath,
            '../../angularFilenameFormatters': inputs.mockAngularFilenameFormatters,
            './configImplementationTemplate': inputs.mockConfigImplementationTemplate,
            '../basicFunctionDefinition/functionDeclarationTemplate': inputs.mockFunctionDeclarationTemplate,
            '../implementationTemplateHelpers/changeIndent': inputs.mockChangeIndent,
            '../../stringUtilities': inputs.mockStringUtilities
        });
    });

    function setReturnValues(options) {
        options = options || {};
        inputs.mockFs.writeFile.and.returnValue(options.fsWriteFile || {});
        inputs.mockPath.join.and.returnValue(options.join || '');
        inputs.mockAngularFilenameFormatters.run.and.returnValue(options.runNameFormat || '');
        inputs.mockAngularFilenameFormatters.config.and.returnValue(options.configNameFormat || '');
        inputs.mockAngularFilenameFormatters.route.and.returnValue(options.routeNameFormat || '');
        inputs.mockConfigImplementationTemplate.format.and.returnValue(options.configImplementation || {});
        inputs.mockFunctionDeclarationTemplate.format.and.returnValue(options.functionDeclarationFormat || {});
        inputs.mockChangeIndent.deindentSource.and.returnValue(options.deindentSource || []);
        inputs.mockStringUtilities.capitalizeFirstLetter.and.returnValue(options.capitalizeFirstLetter, '');
    }

    describe('functionDeclarationTemplate call', () => {
        let inputOptions, formatCallOptions, capitalizeFirstLetterReturn;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                name: 'foo',
                dependencies: [],
                functionImplementation: function thisThing () {},
                type: 'config'
            };
            capitalizeFirstLetterReturn = "That";
            setReturnValues({ capitalizeFirstLetter: capitalizeFirstLetterReturn});
            angularConfigDefinition.build(inputOptions);
            formatCallOptions = inputs.mockFunctionDeclarationTemplate.format.calls.mostRecent().args[0];
        });

        it('should be called with options.name set to name + ',
            () => expect(formatCallOptions.name).toBe(inputOptions.name + capitalizeFirstLetterReturn) );

        it('should call stringUtilities.capitalizeFirstLetter with the given type',
            () => expect(inputs.mockStringUtilities.capitalizeFirstLetter).toHaveBeenCalledWith(inputOptions.type));

        it('should be called with options.baseFunction set to functionImplementation', () =>
            expect(formatCallOptions.baseFunction).toBe(inputOptions.functionImplementation)
        );
    });

    describe('configImplementationTemplate.format call', () => {
        let inputOptions, functionDeclarationTemplateReturnValue, formatCallOptions, deindentSourceReturn;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                parentModuleName: 'place',
                name: 'foo',
                dependencies: [],
                functionImplementation: function thisThing () {},
                type: 'config'
            };

            functionDeclarationTemplateReturnValue = {
                name: 'moo',
                source: 'sourceAndStuffThings'
            };

            deindentSourceReturn = ['foo', 'bar', 'moreLine'];

            setReturnValues({ functionDeclarationFormat: functionDeclarationTemplateReturnValue, deindentSource: deindentSourceReturn});
            angularConfigDefinition.build(inputOptions);
            formatCallOptions = inputs.mockConfigImplementationTemplate.format.calls.mostRecent().args[0];
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

    it('should angularFilenameFormatters of the correct type with the given options.name', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {},
            type: 'config'
        };

        setReturnValues();
        angularConfigDefinition.build(inputOptions);

        expect(inputs.mockAngularFilenameFormatters.config).toHaveBeenCalledWith(inputOptions.name);
    });

    it('should call path.join with options.serviceFilePath and filename to generate the fileName', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {},
            type: 'config'
        };

        let expectedFilename = 'dancingFooThingsStuff.js';

        setReturnValues({ configNameFormat: expectedFilename});
        angularConfigDefinition.build(inputOptions);

        expect(inputs.mockPath.join).toHaveBeenCalledWith(inputOptions.filePath, expectedFilename);
    });

    it('should call fs.writeFile with the results of path.join for the filename, and the results of configImplementationTemplate.format for the fileBody', () => {
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

        setReturnValues({ join: expectedFilename, configImplementation: expectedSource});
        angularConfigDefinition.build(inputOptions);
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

        let givenOutput = angularConfigDefinition.build(inputOptions);
        expect(givenOutput).toBe(expectedOutput);
    });
});