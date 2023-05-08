const versionHelper = require('./version-helper.mjs');

const latestVersion = versionHelper.getLatestVersionTag();
export function getPackageVersion() {
  let newVersion = '';
  try {
    if (!process.env.TAG) {
      return;
    }
      
    const tag = process.env.TAG;
    newVersion = tag.substring(1);
    if (!versionParser.isGreaterOrEqual(newVersion, latestVersion)) {
      throw new Error(
        `New version "${newVersion}" is not >= latest version "${latestVersion}" on this branch.`
      );
    }
    return newVersion;

  } catch (e) {
    console.error(e);
  }
}