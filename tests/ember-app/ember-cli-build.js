'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    babel: {
      // --> has good impact on build size
      // --> has no impact on build size
      // useBuiltIns: false, // default, no polyfill
      // useBuiltIns: 'entry', // our browsertargets already include what would be polyfilled
      // --> breaks the build
      // useBuiltIns: 'usage',
    },
    'ember-cli-babel': {
      // --> environment setup
      throwUnlessParallelizable: true,
      enableTypeScriptTransform: true,
      // --> has good impact on build size
      // --> has no impact on build size
      disableEmberModulesAPIPolyfill: true,
      disableEmberDataPackagesPolyfill: true,
      disableDebugTooling: true,
      includeExternalHelpers: false,
      includePolyfill: false,
      // --> breaks the build
      // leaves the ESM, but still concatenates everything, which is then invalid ESM
      // compileModules: false,
    },
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
