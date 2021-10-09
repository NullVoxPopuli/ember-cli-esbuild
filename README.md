
@nullvoxpopuli/ember-cli-esbuild
==============================================================================

[![npm](https://img.shields.io/npm/v/@nullvoxpopuli/ember-cli-esbuild.svg)](https://www.npmjs.com/package/@nullvoxpopuli/ember-cli-esbuild)
[![Build Status](https://github.com/nullvoxpopuli/ember-cli-esbuild/workflows/CI/badge.svg)](https://github.com/nullvoxpopuli/ember-cli-esbuild/actions?query=workflow%3ACI)

[terser](https://github.com/terser/terser) integration to
[ember-cli](http://cli.emberjs.com/) to minify your JavaScript.


Installation
------------------------------------------------------------------------------

```
yarn add --dev @nullvoxpopuli/ember-cli-esbuild
# or
npm install --save-dev @nullvoxpopuli/ember-cli-esbuild
```

Usage
------------------------------------------------------------------------------

After installing `ember-cli-esbuild` it will automatically hook into the build
pipeline and minify your JS files in production builds.

If you want to customize how `ember-cli-esbuild` is running terser under the
hood you have several configuration options available:

```js
// ember-cli-build.js

var app = new EmberApp({
  'ember-cli-esbuild': {
    enabled: true,

    exclude: ['vendor.js'],

    terser: {
      compress: {
        sequences: 50,
      },
      output: {
        semicolons: true,
      },
    },

    // Tell broccoli-terser-sourcemap to not add sourcemap URLs
    hiddenSourceMap: true,
  },
});
```


### Options

- `enabled?: boolean`: Enables/Disables minification (defaults to `true` for
  production builds, `false` for development builds)

- `exclude?: string[]`: A list of paths or globs to exclude from minification

- `terser?: TerserOptions`: A hash of [options](https://github.com/terser/terser#minify-options)
  that are passed directly to terser

If no `terser` option is passed, a default configuration will be used.

Options supported by [broccoli-terser-sourcemap](https://github.com/ember-cli/broccoli-terser-sourcemap) may be added as top-level fields.

### Source Maps

Source maps are disabled by default for production builds in Ember CLI. If you
want to enable source maps for production builds you can configure that in your
`ember-cli-build.js` too:

```js
// ember-cli-build.js

var app = new EmberApp({
  sourcemaps: {
    enabled: true,
    extensions: ['js'],
  },
});
```

Contributing
------------------------------------------------------------------------------

Debugging this plugin can be done with
```bash
JOBS=1 NODE_OPTIONS="--inspect-brk" ember test -e production
```
and then visit `chrome://inspect` in Google Chrome.
you'll want to place a `debugger` somewhere in the broccoli code
(located at `./lib/broccoli`) so that execution pauses near the code you want
to inspect.


License
------------------------------------------------------------------------------
ember-cli-esbuild is licensed under the [MIT License](LICENSE.md).
