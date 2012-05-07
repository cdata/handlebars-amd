# Handlebars AMD

Handlebars is a cool template system that allows you to precompile your templates as JavaScript for great performance. One thing that Handlebars could stand to play nicely with is AMD module loaders (like RequireJS and CloudFlareJS). This node module allows you to compile entire directories of Handlebars templates (recursively) into a named AMD module.

## Installing

```sh
# For command line:
npm install -g handlebars-amd

# For Node apps:
npm install handlebars-amd
```

## Usage

On the command line:

```sh
handlebars-amd -i ./my/templates -n 'app/templates' -m
```

In your web server:

```javascript
require('handlebars-amd').compile(
    './my/templates', // Template directory.. 
    'app/templates', // Resulting module name.. 
    true // Minify!
).then(function(compiled) {

    // Compiled is a string of JavaScript that contains your module!
});
```
