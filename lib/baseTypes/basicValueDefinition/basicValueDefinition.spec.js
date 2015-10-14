'use strict';

let path = require('path');
let fs = require('fs-promise');
let proxyquire = require('proxyquire').noPreserveCache();

describe('basicValueDefinition', () => {
    let inputs, basicValueDefinition;
    beforeEach(() => {
        inputs = {
            mockFs : jasmine.createSpyObj('fs-promise', ['writeFile']),
            mockPath: jasmine.createSpyObj('path', ['join']),
            mockWritePromise: jasmine.createSpy('writeFilePromise'),
            mockAngularFilenameFormatters: jasmine.createSpyObj('angularFilenameFormatter', ['constant']),
            mockValueImplementationTemplate: jasmine.createSpyObj('valueImplementationTemplate', ['format']),
            pathReturn: 'placeThing.jsFoo',
            formatReturn: 'formattedThing.jsFooThing'
        };

        inputs.mockFs.writeFile.and.returnValue(inputs.mockWritePromise);
        inputs.mockPath.join.and.returnValue(inputs.pathReturn);
        inputs.mockAngularFilenameFormatters.constant.and.returnValue(inputs.formatReturn);

        basicValueDefinition = proxyquire('./basicValueDefinition', {
            'fs-promise': inputs.mockFs,
            'path': inputs.mockPath,
            '../../angularFilenameFormatters': inputs.mockAngularFilenameFormatters,
            './valueImplementationTemplate': inputs.mockValueImplementationTemplate
        });
    });

    describe('path.join call', () => {
        it('should pass the given filePath to path.join', () => {
            let expectedConstantFilePath = 'this/thing/andSTuff';

            basicValueDefinition.build({
                parentModuleRelativeLocation: 'doesntMatter',
                name: 'foo',
                filePath: expectedConstantFilePath,
                type:'constant'
            });

            let pathConstantLocationResults = inputs.mockPath.join.calls.mostRecent().args[0];
            expect(pathConstantLocationResults).toBe(expectedConstantFilePath);
        });

        it('should pass the correct file name to path.join', () => {
            let name = 'moreDoesntMatter';
            let expectedConstantFileName = inputs.formatReturn;


            basicValueDefinition.build({
                parentModuleRelativeLocation: 'doesntMatter',
                name,
                filePath: 'doesntMatter',
                type:'constant'
            });

            let pathFileNameResults = inputs.mockPath.join.calls.mostRecent().args[1];
            expect(pathFileNameResults).toBe(expectedConstantFileName);
        });
    });

    describe('valueImplementationTemplate.format', () => {
        it('should pass the given parentModuleLocation as parentModule to valueImplementationTemplate.format', () => {
            let inputOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: "{ item:'bob', thing:'that' }",
                type:'constant'
            };

            basicValueDefinition.build(inputOptions);

            let givenOptions = inputs.mockValueImplementationTemplate.format.calls.mostRecent().args[0];
            expect(givenOptions.parentModule).toBe(inputOptions.parentModuleRelativeLocation);
        });

        it('should pass the given name to valueImplementationTemplate.format', () => {
            let inputOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: "{ item:'bob', thing:'that' }",
                type:'constant'
            };

            basicValueDefinition.build(inputOptions);

            let givenOptions = inputs.mockValueImplementationTemplate.format.calls.mostRecent().args[0];
            expect(givenOptions.name).toBe(inputOptions.name);
        });

        it('should pass the given valueDefinition as valueDefinition to valueImplementationTemplate.format', () => {
            let inputOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: "{ item:'bob', thing:'that' }",
                type:'constant'
            };

            basicValueDefinition.build(inputOptions);

            let givenOptions = inputs.mockValueImplementationTemplate.format.calls.mostRecent().args[0];
            expect(givenOptions.valueDefinition).toBe(inputOptions.valueDefinition);
        });

        it('should pass "{}" as the valueDefinition to valueImplementationTemplate.format if no valueDefinition is given', () => {
            let inputOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: undefined,
                type:'constant'
            };

            basicValueDefinition.build(inputOptions);

            let givenOptions = inputs.mockValueImplementationTemplate.format.calls.mostRecent().args[0];
            expect(givenOptions.valueDefinition).toBe("{}");
        });

        it('should pass options.type as type to valueImplementationTemplate', () => {
            let inputOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: undefined,
                type: 'constant'
            };

            basicValueDefinition.build(inputOptions);

            let givenOptions = inputs.mockValueImplementationTemplate.format.calls.mostRecent().args[0];
            expect(givenOptions.type).toBe("constant");
        })

    });

    describe('fs.write', () => {
        it('should return the promise returned from writeFile', () => {
            let givenOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: "{ item:'bob', thing:'that' }",
                type:'constant'
            };

            let returned = basicValueDefinition.build(givenOptions);
            expect(returned).toBe(inputs.mockWritePromise);
        });

        it('should pass in the correct fileName', () => {
            let givenOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: "{ item:'bob', thing:'that' }",
                type:'constant'
            };

            basicValueDefinition.build(givenOptions);

            let givenFilename = inputs.mockFs.writeFile.calls.mostRecent().args[0];
            expect(givenFilename).toBe(inputs.pathReturn);
        });


        it('should pass what is returned from valueImplementationTemplate.format as the file body', () => {

            const expectedBody = {id: 'thisIsTheFileBody'};

            let givenOptions = {
                parentModuleRelativeLocation: './FooPlace.js',
                name: 'constantThings',
                filePath: 'doesntMatter/',
                valueDefinition: "{ item:'bob', thing:'that' }",
                type:'constant'
            };

            inputs.mockValueImplementationTemplate.format.and.returnValue(expectedBody);
            basicValueDefinition.build(givenOptions);

            let givenBody = inputs.mockFs.writeFile.calls.mostRecent().args[1];
            expect(givenBody).toBe(expectedBody);
        });
    });

});
