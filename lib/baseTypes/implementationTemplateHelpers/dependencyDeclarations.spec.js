'use strict';
let proxyquire = require('proxyquire').noPreserveCache();

describe('dependencyDeclarations', () => {
    let dependencyDeclarations, inputs;

    beforeEach(() => {
        inputs = {
            mockIndent: jasmine.createSpyObj('indent', ['create'])
        };
        dependencyDeclarations = proxyquire('./dependencyDeclarations', {
            './indent': inputs.mockIndent
        })
    });

    it('should output the correct dependencyString based on the return of each dependency.render', () => {
        inputs.mockIndent.create.and.returnValue('=');
        let expected = 'foo,\n=bar,\n=thing';
        let inputOptions = {
            dependencies: [{ render: () => 'foo'}, { render: () => 'bar'}, { render: () => 'thing'}],
            parentModuleName: 'someModule',
            accessName: 'nameThing',
            indent: 52
        };
        let results = dependencyDeclarations.format(inputOptions);

        expect(results).toBe(expected);
    });

    it('should pass the expected indentLevel to indent.create', () => {
        let inputOptions = {
            dependencies: [{ render: () => 'foo'}, { render: () => 'bar'}, { render: () => 'thing'}],
            parentModuleName: 'someModule',
            accessName: 'nameThing',
            indent: 52
        };
        inputs.mockIndent.create.and.returnValue('=');

        dependencyDeclarations.format(inputOptions);
        expect(inputs.mockIndent.create).toHaveBeenCalledWith(inputOptions.indent);
    });

    it('should pass the parentModule and the accessName to render', () => {

        let inputOptions = {
            dependencies: [jasmine.createSpyObj('', ['render']), jasmine.createSpyObj('', ['render'])],
            parentModuleName: 'someModule',
            accessName: 'nameThing',
            indent: 52
        };
        inputs.mockIndent.create.and.returnValue('=');
        dependencyDeclarations.format(inputOptions);

        inputOptions.dependencies.forEach((dependency) =>
            expect(dependency.render).toHaveBeenCalledWith(inputOptions.parentModuleName, inputOptions.accessName));
    });
});