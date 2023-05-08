const sauceConnectLauncher = require('sauce-connect-launcher');
const webdriver = require('selenium-webdriver');

// requiring this automatically adds the chromedriver binary to the PATH
require('chromedriver');
const chai = require('chai');
const expect = chai.expect;

const HttpServer = require('http-server');

// Launch static server
HttpServer.createServer({
  showDir: false,
  autoIndex: false,
  root: './',
}).listen(8000, '0.0.0.0' );

const browserConfig = {
  platform: 'windows',
  name: 'chrome',
  version: 112
};


const capabilities = {
    name: `xgplayer setup`,
    browserName: browserConfig.name,
    platformName: browserConfig.platform,
    browserVersion: browserConfig.version,
    commandTimeout: 90,
};

browser = new webdriver.Builder();

capabilities['sauce:options'] = {
    ['tunnel-identifier']: `local-${Date.now()}`,
};

let sauceConnectProcess;
async function sauceConnect(tunnelIdentifier) {
  return new Promise(function (resolve, reject) {
    console.log(
      `Running sauce-connect-launcher. Tunnel id: ${tunnelIdentifier}`
    );
    sauceConnectLauncher(
      {
        username: 'oauth-yuhao.fu1995-e09c4',
        accessKey: '1e11bcc6-ba93-4273-821d-6f7b27fd2990',
        verbose: true,
        tunnelIdentifier: tunnelIdentifier,
      },
      (err, sauceConnectProcess) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }
        console.log('Sauce Connect ready');
        resolve(sauceConnectProcess);
      }
    );
  });
}



capabilities['sauce:options'].public = 'public restricted';
capabilities['sauce:options'].avoidProxy = true;
capabilities['sauce:options']['record-screenshots'] = false;

async function testWindowLoaded() {

  const result = await browser.executeAsyncScript(
    async function () {
      const callback = arguments[arguments.length - 1];
      if (self._my_flag_ === true) {
        callback(1);
      } else {
        callback(0)
      }
    }
  );
  expect(result).toEqual(1)
}

async function sauceDisconnect() {
  return new Promise(function (resolve) {
    if (!sauceConnectProcess) {
      resolve();
    }
    sauceConnectProcess.close(function () {
      console.log('Closed Sauce Connect process');
      resolve();
    });
  });
}

describe(`testing hls.js playback in the browser on chrome 112`, function () {
    before(async function () {
      sauceConnectProcess = await sauceConnect(
        capabilities['sauce:options']['tunnel-identifier']
      );
      browser = browser.usingServer(
        `https://oauth-yuhao.fu1995-e09c4:1e11bcc6-ba93-4273-821d-6f7b27fd2990@ondemand.us-west-1.saucelabs.com:443/wd/hub`
      );
      browser = browser.withCapabilities(capabilities).build();
      const [, session] = await Promise.all([
        browser.manage().setTimeouts({ script: 75000 }),
        browser.getSession(),
      ]);
      console.log('session: ', session);
    })
    after(async function () {
        console.log('Quitting browser...');
        await browser.quit();
        console.log('Browser quit.');
        await sauceDisconnect();
  });

  it(
    `should have my flag`,
    testWindowLoaded.bind(null)
  );
});
