var handlebars = require('handlebars')
  , path = require('path')
  , uglify = require('uglify-js')
  , fs = require('q-fs')
  , q = require('q')
  , ref = q.ref;

var each = function(list, callback) {

    var result = ref();

    list.forEach(function() {

        var args = arguments
          , context = this;

        result = result.then(function() {

            return callback.apply(context, args);
        });
    });

    return result;
};

exports.compile = function(directory, moduleName, minify) {

    directory = path.resolve(directory);

    return fs.listTree(directory).then(function(fileList) {

        var templates = [];

        return each(fileList, function(file) {

            return fs.isDirectory(file).then(function(isDirectory) {

                if(!isDirectory && /\.handlebars$/.test(file)) {

                    return fs.read(file).then(function(contents) {

                        contents = contents.toString();

                        file = path.relative(directory, file);

                        templates.push("templates['" + file.replace(/\.handlebars$/, '') + "'] = " +  handlebars.precompile(contents, { path: file }));
                    });
                }
            });
        }).then(function() {

            var compiled = "define(" + (moduleName ? "'" + moduleName + "', " : "") + "['handlebars'], function(Handlebars) {\n"
                         + "    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n"
                         + templates.join('\n    ') + "\n"
                         + "    return Handlebars.templates;\n"
                         + "});";

            return minify ? uglify(compiled) : compiled;
        }, function(e) {
            
            console.error(e.toString());
        });
    });
};
