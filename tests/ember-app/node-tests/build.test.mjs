/* globals process */
'use strict';

import execa from 'execa';

// fs/promises is not available in node 12
// import fs from 'fs/promises';
import { default as fsWithCallbacks } from 'fs';
import del from 'del';
import { globby, globbySync } from 'globby';

import { jest, expect, beforeEach, test } from '@jest/globals';

const fs = fsWithCallbacks.promises;

jest.setTimeout(60_000);

beforeEach(async () => {
  await del(['./dist']);
});

function exists(glob) {
  let result = globbySync(glob, { expandDirectories: true });

  return result.length > 0;
}

async function build(env = {}) {
  await execa('ember', ['build', '--environment', 'production'], {
    env,
    ...(process.env.DEBUG_EMBER ? { stdio: 'inherit' } : {}),
  });
}

async function hasSourceMappingURL(glob, expectation) {
  let key = '//# sourceMappingURL';
  let files = await globby(glob, { expandDirectories: true });

  if (files.length === 0) {
    return false;
  }

  for (let file of files) {
    let data = await fs.readFile(file);

    if (!data.includes(key)) {
      if (expectation) {
        console.error(`${file} did not have content matching ${key}`);
      }
      return false;
    }
  }

  return true;
}

async function hasJSSourceMapsURL(expectation) {
  return await hasSourceMappingURL('dist/**/*.js', expectation);
}

async function appJS() {
  // based of package.json#name
  let files = await globby('**/ember-app-*.js', { expandDirectories: true });

  if (files.length === 0) {
    throw new Error('No app js file found');
  }

  // there can only be one app js file
  let data = await fs.readFile(files[0]);
  return data.toString();
}

async function vendorJS() {
  let files = await globby('**/vendor-*.js', { expandDirectories: true });

  if (files.length === 0) {
    throw new Error('No vendor js file found');
  }

  // there can only be one app js file
  let data = await fs.readFile(files[0]);
  return data.toString();
}

test('basic build', async () => {
  await build();

  expect(exists('dist/**/*.map')).toBeFalsy();
  expect(await hasJSSourceMapsURL(false)).toBeFalsy();

  // assert that the image references end with a fingerprint
  // (because we don't want to interfece with broccoli-asset-rev)
  let app = await appJS();
  let vendor = await vendorJS();

  // fingerprint occurred
  expect(app).toMatch(/unsplash-[0-9a-f]{16,}\.jpg/);
  expect(vendor).toMatch(/unsplash-[0-9a-f]{16,}\.jpg/);
  // fingerprint did not occur
  expect(app).not.toMatch(/unsplash\.jpg/);
  expect(vendor).not.toMatch(/unsplash\.jpg/);
});

test('build: source map enabled through Ember CLI config', async () => {
  await build({ SOURCEMAP: 'true' });

  expect(exists('dist/**/*.map')).toBeTruthy();
  expect(await hasJSSourceMapsURL(true)).toBeTruthy();
});

test('build: sourceMap: linked', async () => {
  await build({ ESBUILD_SOURCEMAP: 'linked' });

  expect(exists('dist/**/*.map')).toBeTruthy();
  expect(await hasJSSourceMapsURL(true)).toBeTruthy();
});

test('build: sourceMap: external', async () => {
  await build({ ESBUILD_SOURCEMAP: 'external' });

  expect(exists('dist/**/*.map')).toBeTruthy();
  expect(await hasJSSourceMapsURL(false)).toBeFalsy();
});

test('build: sourceMap: both', async () => {
  await build({ ESBUILD_SOURCEMAP: 'both' });

  expect(exists('dist/**/*.map')).toBeTruthy();
  expect(await hasJSSourceMapsURL(true)).toBeTruthy();
});

test('build: sourceMap: inline', async () => {
  await build({ ESBUILD_SOURCEMAP: 'inline' });

  expect(exists('dist/**/*.map')).toBeFalsy();
  expect(await hasJSSourceMapsURL(true)).toBeTruthy();
});
