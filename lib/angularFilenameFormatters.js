'use strict';

let angularFilenameFormatters =  {
    config: name => `${name}.config.es6`,
    route: name => `${name}.config.es6`,
    run: name => `${name}.run.es6`,
    constant: name => `${name}.constant.es6`,
    controller: name => `${name.replace(/Controller$/g,'')}.controller.es6`,
    directive: name => `${name}.directive.es6`,
    factory: name => `${name}.factory.es6`,
    module: name => `${name}.module.es6`,
    moduleExport: name => `${name}.es6`,
    provider: name => `${name}.provider.es6`,
    filter: name => `${name}.filter.es6`,
    service: name => `${name}.service.es6`,
    value: name => `${name}.value.es6`
};

module.exports = angularFilenameFormatters;