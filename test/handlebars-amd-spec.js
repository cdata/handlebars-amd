var vm = require('vm')
  , mocha = require('mocha')
  , expect = require('expect.js')
  , Handlebars = require('handlebars')
  , handlebars = require('../lib/handlebars-amd.js');

function mockDefine(moduleCache) {

    return function() {

        var args = Array.prototype.slice.call(arguments).reverse()
          , factory = args[0]
          , dependencies = args[1] instanceof Array ? [] : args[1]
          , name = (typeof args[1] == 'string' ? args[1] : args[2]) || 'anonymous';

        if(typeof factory == 'function')
            moduleCache[name] = factory(Handlebars); 
    };
}

describe('Handlebars AMD', function() {

    describe('.compile(...)', function() {

        var define
          , moduleCache;

        beforeEach(function() {

            moduleCache = {};
            define = mockDefine
        });

        it('converts a directory of templates into a valid AMD module', function(done) {

            handlebars.compile('./test/templates', 'templates').then(function(compiled) {

                var cache = {}
                  , define = mockDefine(cache)
                  , module;

                try {

                    vm.runInContext(compiled, vm.createContext({ define: define }), true);
                } catch(e) {
                    
                    done(new Error('Failed to execute templates in VM. ' + e.message));
                    return;
                }

                module = cache['templates'];

                try {

                    expect(module).to.be.an('object');
                    expect(module.a).to.be.a('function');
                    expect(module.b).to.be.a('function');
                    expect(module.c).to.be.a('function');
                    expect(module['sub/d']).to.be.a('function');
                } catch(e) {

                    done(e);
                    return;
                }

                done();
            });
        });

        it('converts a directory of templates into an anonymous AMD module', function(done) {

            handlebars.compile('./test/templates').then(function(compiled) {

                try {
                    expect(compiled).to.match(/^define\(\['handlebars'\], function\(/);
                } catch(e) {
                    done(e);
                    return;
                }

                done();
            });
        });
    });
});
