var StylusCompiler = require('broccoli-stylus-single');

function StylusPlugin(options) {
  this.name = 'ember-cli-stylus';
  this.ext = 'styl';
  options = options || {};
  options.inputFile = options.inputFile || 'app.styl';
  options.outputFile = options.outputFile || 'app.css';
  if (options.sourceMap) {
    options.sourceComments = 'map';
    options.sourceMap = options.outputFile + '.map';
  }
  this.options = options;
};

StylusPlugin.prototype.toTree = function(tree, inputPath, outputPath) {
  var trees = [tree];
  if (this.options.includePaths) trees = trees.concat(this.options.includePaths);
  inputPath += '/' + this.options.inputFile;
  outputPath += '/' + this.options.outputFile;
  return new StylusCompiler(trees, inputPath, outputPath, this.options);
};

function EmberCLIStylus(project) {
  this.project = project;
  this.name = 'Ember CLI Stylus';
}

EmberCLIStylus.prototype.treeFor = function treeFor(type) {
};

EmberCLIStylus.prototype.included = function included(app, parentAddon) {

  this._super.included.apply(this, arguments);

  var target = parentAddon || app;

  if (target.app) {
    target = target.app;
  }
  target.options = target.options || {};

  var options = target.options.stylusOptions || {};
  if ((options.sourceMap === undefined) && (target.env == 'development')) {
    options.sourcemap = {
      inline: true
    };
    options.cache = false;
  }
  options.outputFile = options.outputFile || target.project.name + '.css';
  target.registry.add('css', new StylusPlugin(options));
};

module.exports = EmberCLIStylus;
