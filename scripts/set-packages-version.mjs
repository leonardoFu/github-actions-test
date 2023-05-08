#!/usr/bin/env zx

import { getPackageVersion } from './get-package-version.mjs'

import pkgJson from '../package.json';
import versionHelper from './version-helper.mjs';
const version = getPackageVersion();

if (!version) {
    console.error('Failed to get a target version');
    process.exit(1)
}


pkgJson.version = version;

const tag = versionHelper.getVersionTag(version);

pkgJson.publishConfig = {
    tag: tag
};

const jsonPath = path.join(__dirname, 'package.json');

await fs.outputJson(jsonPath, pkgJson);
