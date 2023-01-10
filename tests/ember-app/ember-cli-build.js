'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const { SOURCEMAP, ESBUILD_SOURCEMAP, DISABLE_MINIFY } = process.env;

module.exports = function (defaults) {
  let options = {
    'ember-cli-esbuild': {
      enabled: !DISABLE_MINIFY,
    },
    sourcemaps: {},
  };

  if (SOURCEMAP) {
    options.sourcemaps.enabled = true;
  }

  if (ESBUILD_SOURCEMAP) {
    options['ember-cli-esbuild'].sourceMap = ESBUILD_SOURCEMAP;
  }

  let app = new EmberApp(defaults, {
    // Add options here
    ...options,
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
