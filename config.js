'use strict';

(function(module) {

  var options = {
    // Build options
    sourcePath: './src',
    templateOutputPath: './page-templates',
    assetOutputPath: './assets',

    // SASS options
    sass: {
      sourcemap: true,
      style: 'expanded'
    }
  };

  module.exports = options;

})(module);
