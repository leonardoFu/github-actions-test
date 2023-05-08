const semver = require('semver');

const VALID_VERSION_REGEX =
    /^v(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z][0-9a-zA-Z-]*))?/;

const STABLE_VERSION_REGEX = /^v\d+\.\d+\.\d+$/;

export default {
    isValid: function (version) {
        return VALID_VERSION_REGEX.test(version);
    },
    isStable: function (version) {
        return this.isValid(version) && STABLE_VERSION_REGEX.test(version);
    },
    patch: function (version) {
        return 'v' + semver.inc(version, 'patch');
    },
    getVersionTag: function (version) {
        if (!this.isValid(version)) {
            throw new Error('Invalid version');
        }

        const [,,,tag] = VALID_VERSION_REGEX.exec(version);

        return tag || 'latest';
    },
    getLatestVersionTag: function () {
        let commitish = '';
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const tag = exec('git describe --tag --abbrev=0 --match="v*" ' + commitish);
            if (!tag) {
                throw new Error('Could not find tag.');
            }
            if (versionParser.isValidVersion(tag)) {
                return tag;
            }
            // next time search older tags than this one
            commitish = tag + '~1';
        }
    }
}