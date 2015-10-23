'use strict';
let proxyquire = require('proxyquire').noPreserveCache();

describe('angularFilterDefinition', () => {
    let inputs, angularFilterDefinition;

    beforeEach(() => {
        inputs = {
            mockFs: jasmine.createSpyObj('fs-promise', ['writeFile']),
            mockPath: jasmine.createSpyObj('path', ['join']),
            mockAngularFilenameFormatters: jasmine.createSpyObj('angularFilenameFormatters', ['filter']),
            mockFilterImplementationTemplate: jasmine.createSpyObj('filterImplementationTemplate',['format']),
            mockFunctionDeclarationTemplate: jasmine.createSpyObj('functionDeclarationTemplate',['format']),
            mockChangeIndent: jasmine.createSpyObj('changeIndent',['deindentSource'])
        };

        angularFilterDefinition = proxyquire('./angularFilterDefinition', {
            'fs-promise': inputs.mockFs,
            'path': inputs.mockPath,
            '../../angularFilenameFormatters': inputs.mockAngularFilenameFormatters,
            './filterImplementationTemplate': inputs.mockFilterImplementationTemplate,
            '../basicFunctionDefinition/functionDeclarationTemplate': inputs.mockFunctionDeclarationTemplate,
            '../implementationTemplateHelpers/changeIndent': inputs.mockChangeIndent
        });
    });

    function setReturnValues(options) {
        options = options || {};
        inputs.mockFs.writeFile.and.returnValue(options.fsWriteFile || {});
        inputs.mockPath.join.and.returnValue(options.join || '');
        inputs.mockAngularFilenameFormatters.filter.and.returnValue(options.filterNameFormat);
        inputs.mockFilterImplementationTemplate.format.and.returnValue(options.filterImplementation || {});
        inputs.mockFunctionDeclarationTemplate.format.and.returnValue(options.functionDeclarationFormat || {});
        inputs.mockChangeIndent.deindentSource.and.returnValue(options.deindentSource || []);
    }

    describe('functionDeclarationTemplate call', () => {
        let inputOptions, formatCallOptions;
        beforeEach(() => {
            inputOptions = {
                parentModuleRelativeLocation: 'thing',
                name: 'foo',
                dependencies: [],
                functionImplementation: function thisThing () {}
            };
            setReturnValues();
            angularFilterDefinition.build(inputOptions);
            formatCallOptions = inputs.mockFunctionDeclarationTemplate.format.calls.mostRecent().args[0];
        });

        it('should be called with options.name set to name', () => expect(formatCallOptions.name).toBe(inputOptions.name) );

        it('should be called with options.baseFunction set to functionImplementation', () =>
            expect(formatCallOptions.baseFunction).toBe(inputOptions.functionImplementation)
        );
    });

    describe('filterImplementationTemplate.format call', () => {
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

            setReturnValues({ deindentSource: deindentSourceReturn, functionDeclarationFormat: functionDeclarationTemplateReturnValue });

            angularFilterDefinition.build(inputOptions);
            formatCallOptions = inputs.mockFilterImplementationTemplate.format.calls.mostRecent().args[0];
        });

        it('should call deindentSource with the source returned from functionDeclarationTemplate', () => {
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

        it('should set source to changeIndent.deindentSource return joined with newlines', () => {
            expect(formatCallOptions.source).toBe(deindentSourceReturn.join('\n'));
        });

        it('should set functionName to functionDeclarationTemplate.format returned value.name', () => {
            expect(formatCallOptions.functionName).toBe(functionDeclarationTemplateReturnValue.name);
        });

        it('should set dependencies to given options.dependencies', () => {
            expect(formatCallOptions.dependencies).toBe(inputOptions.dependencies);
        });
    });

    it('should angularFilenameFormatters of the correct type with the given options.name', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {}
        };
        setReturnValues();

        angularFilterDefinition.build(inputOptions);

        expect(inputs.mockAngularFilenameFormatters.filter).toHaveBeenCalledWith(inputOptions.name);
    });

    it('should call path.join with options.serviceFilePath and filename to generate the fileName', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {}
        };

        let expectedFilename = 'dancingFooThingsStuff.js';
        setReturnValues({ filterNameFormat: expectedFilename });
        angularFilterDefinition.build(inputOptions);

        expect(inputs.mockPath.join).toHaveBeenCalledWith(inputOptions.filePath, expectedFilename);
    });

    it('should call fs.writeFile with the results of path.join for the filename, and the results of filterImplementationTemplate.format for the fileBody', () => {
        let expectedSource = 'sourceFooStuff';
        let expectedFilename = 'thingsStuffName';
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {}
        };
        setReturnValues({ join: expectedFilename, filterImplementation: expectedSource });
        angularFilterDefinition.build(inputOptions);
        expect(inputs.mockFs.writeFile).toHaveBeenCalledWith(expectedFilename, expectedSource);
    });

    it('should return the promise returned by fs.writeFile', () => {
        let inputOptions = {
            parentModuleRelativeLocation: 'thing',
            filePath: 'place',
            name: 'foo',
            dependencies: [],
            functionImplementation: function thisThing () {}
        };
        let expectedOutput = {id: 'this is expected!'};

        setReturnValues({fsWriteFile: expectedOutput});
        let givenOutput = angularFilterDefinition.build(inputOptions);
        expect(givenOutput).toBe(expectedOutput);
    });
});