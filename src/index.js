'use strict';

var through = require('through2');
var compile = require('slm').compile;
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;

function handleCompile(contents, opts) {
  return compile(contents, opts)(opts.locals || opts.data);
}

module.exports = function(options) {
  var opts = options || {},
  extension = opts.extension !== undefined ? opts.extension : '.html';

  function CompileSlm(file, enc, cb) {
    opts.filename = file.path;

    if (file.data) {
      opts.data = file.data;
    }

    file.path = ext(file.path, extension);

    if (file.isStream()) {
      return cb(new PluginError('gulp-slm', 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      try {
        file.contents = new Buffer(handleCompile(String(file.contents), opts));
      } catch (e) {
        return cb(new PluginError('gulp-slm', e));
      }
    }

    cb(null, file);
  }

  return through.obj(CompileSlm);
};