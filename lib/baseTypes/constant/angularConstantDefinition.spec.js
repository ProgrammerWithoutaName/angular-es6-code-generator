'use strict';

let path = require('path');
let fs = require('fs-promise');
let proxyquire = require('proxyquire').noPreserveCache();

describe('angularConstantDefinition', () => {
  let inputs, angularConstantDefinition;
  beforeEach(() => {
    inputs = {
      mockFs : jasmine.createSpyObj('fs-promise', ['writeFile']),
      mockPath: jasmine.createSpyObj('path', ['join']),
      mockWritePromise: jasmine.createSpy('writeFilePromise'),
      mockAngularFilenameFormatters: jasmine.createSpyObj('angularFilenameFormatter', ['constant']),
      pathReturn: 'placeThing.jsFoo',
      formatReturn: 'formattedThing.jsFooThing'
    };

    inputs.mockFs.writeFile.and.returnValue(inputs.mockWritePromise);
    inputs.mockPath.join.and.returnValue(inputs.pathReturn);
    inputs.mockAngularFilenameFormatters.constant.and.returnValue(inputs.formatReturn);

    angularConstantDefinition = proxyquire('./angularConstantDefinition.js', {
      'fs-promise': inputs.mockFs,
      'path': inputs.mockPath,
      '../../angularFilenameFormatters': inputs.mockAngularFilenameFormatters
    });
  });

  describe('path.join call', () => {
    it('should pass the given constantFilePath to path.join', () => {
      let expectedConstantFilePath = 'this/thing/andSTuff';

      angularConstantDefinition.build({
        parentModuleRelativeLocation: 'doesntMatter',
        constantName: 'foo',
        constantFilePath: expectedConstantFilePath
      });

      let pathConstantLocationResults = inputs.mockPath.join.calls.mostRecent().args[0];
      expect(pathConstantLocationResults).toBe(expectedConstantFilePath);
    });

    it('should pass the correct file name to path.join', () => {
      let constantName = 'moreDoesntMatter';
      let expectedConstantFileName = inputs.formatReturn;


      angularConstantDefinition.build({
        parentModuleRelativeLocation: 'doesntMatter',
        constantName,
        constantFilePath: 'doesntMatter'
      });

      let pathFileNameResults = inputs.mockPath.join.calls.mostRecent().args[1];
      expect(pathFileNameResults).toBe(expectedConstantFileName);
    });
  });

  describe('fs.write', () => {
    it('should return the promise returned from writeFile', () => {
      let givenOptions = {
        parentModuleRelativeLocation: './FooPlace.js',
        constantName: 'constantThings',
        constantFilePath: 'doesntMatter/',
        constantBodyDefinition: "{ item:'bob', thing:'that' }"
      };

      let returned = angularConstantDefinition.build(givenOptions);
      expect(returned).toBe(inputs.mockWritePromise);
    });

    it('should pass in the correct fileName', () => {
      let givenOptions = {
        parentModuleRelativeLocation: './FooPlace.js',
        constantName: 'constantThings',
        constantFilePath: 'doesntMatter/',
        constantBodyDefinition: "{ item:'bob', thing:'that' }"
      };

      angularConstantDefinition.build(givenOptions);

      let givenFilename = inputs.mockFs.writeFile.calls.mostRecent().args[0];
      expect(givenFilename).toBe(inputs.pathReturn);
    });

    it('should pass in the correct file Body when a constantValueDefinition is not supplied', () => {
      const expectedBody = `'use strict';

import parentModule from './FooPlace.js';
let implementationKey = parentModule.dependencyKeys.constantThings;
export default { implementation : implementationKey };

let value = {};

parentModule.module.constant(implementationKey, value);`;

      let givenOptions = {
        parentModuleRelativeLocation: './FooPlace.js',
        constantName: 'constantThings',
        constantFilePath: 'doesntMatter/'
      };

      angularConstantDefinition.build(givenOptions);

      let givenBody = inputs.mockFs.writeFile.calls.mostRecent().args[1];
      expect(givenBody).toBe(expectedBody);
    });

    it('should pass in the correct file Body when a constantValueDefinition is supplied', () => {

      const expectedBody = `'use strict';

import parentModule from './FooPlace.js';
let implementationKey = parentModule.dependencyKeys.constantThings;
export default { implementation : implementationKey };

let value = { item:'bob', thing:'that' };

parentModule.module.constant(implementationKey, value);`;

      let givenOptions = {
        parentModuleRelativeLocation: './FooPlace.js',
        constantName: 'constantThings',
        constantFilePath: 'doesntMatter/',
        constantBodyDefinition: "{ item:'bob', thing:'that' }"
      };

      angularConstantDefinition.build(givenOptions);

      let givenBody = inputs.mockFs.writeFile.calls.mostRecent().args[1];
      expect(givenBody).toBe(expectedBody);
    });
  });

});
