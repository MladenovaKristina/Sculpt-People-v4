module.exports = class WebpackConfig {
  constructor() {
    WebpackConfig.settings = {
      gameTitle: "Dashboard Template",
      indexCurrentAdvertisingPlatform: 0,
      advertisingsPlatforms: [
        "template",//0
        "facebook",//1
        "adcolony",//2
        "unity",//3
        "ironsource",//4
        "mintegral",//5
        "google_landscape",//6
        "google_portrait",//7
        "vungle",//8
        "tiktok",//9
        "applovin",//10
        "chartboost"//11
      ]
    };

    WebpackConfig.versionFull = 0;
    WebpackConfig.versionCB = 1;
    WebpackConfig.versionPN = 2;

    WebpackConfig.versionDefault = 0;
    WebpackConfig.versionLong = 1;
    WebpackConfig.versionShort = 2;
    WebpackConfig.versionMid = 3;

    WebpackConfig.version = WebpackConfig.versionPN;
    WebpackConfig.versionDuration = WebpackConfig.versionDefault;

    WebpackConfig.date = '30.01.23';
    WebpackConfig.playableVersion = '1.0';

    WebpackConfig.isCB = WebpackConfig.version === WebpackConfig.versionCB;
    WebpackConfig.isPN = WebpackConfig.version === WebpackConfig.versionPN;
    WebpackConfig.isAgr = WebpackConfig.versionDuration === WebpackConfig.versionShort;
    WebpackConfig.isMid = WebpackConfig.versionDuration === WebpackConfig.versionMid;
    WebpackConfig.isLong = WebpackConfig.versionDuration === WebpackConfig.versionLong;
  }

  gameTitle() {
    return WebpackConfig.settings.gameTitle;
  }

  getAdvertisingPlatform() {
    let index = WebpackConfig.settings.indexCurrentAdvertisingPlatform;
    if (index === 10 || index === 11) {
      index = 3;
    }

    return WebpackConfig.settings.advertisingsPlatforms[index];
  }

  getPathIndexHtml() {
    return "src/html/index_" + this.getAdvertisingPlatform() + ".html";
  }

  ifUseMraid() {
    let platformUse = this.getAdvertisingPlatform();

    if (platformUse === "unity" || platformUse === "adcolony" || platformUse === "applovin" || platformUse === "chartboost") {
      return true;
    } else {
      return false;
    }
  }

  _getVersionDurationSymbol() {
    switch (WebpackConfig.versionDuration) {
      case WebpackConfig.versionDefault:
        return '';
      case WebpackConfig.versionLong:
        return '_L';
      case WebpackConfig.versionShort:
        return '_S';
      case WebpackConfig.versionMid:
        return '_M';
    }
  }

  getFolderName() {
    const playableVersion = WebpackConfig.playableVersion;
    let duration = '';
    let version = '';

    switch (WebpackConfig.versionDuration) {
      case WebpackConfig.versionLong:
        duration = ' Long';
        break;
      case WebpackConfig.versionShort:
        duration = ' Short';
        break;
      case WebpackConfig.versionMid:
        duration = ' Mid';
        break;
    }

    switch (WebpackConfig.version) {
      case WebpackConfig.versionPN:
        version = ' PN';
        break;
      case WebpackConfig.versionCB:
        version = ' CB';
        break;
    }

    return `v${playableVersion}${duration}${version}`;
  }

  getZipName(index = WebpackConfig.settings.indexCurrentAdvertisingPlatform) {
    return this._getFormedName(index).replace('.html', '.zip');
  }

  getFileName(index = WebpackConfig.settings.indexCurrentAdvertisingPlatform) {
    if (index === 8) {
      return 'ad.html';
    } else if (index === 9) {
      return 'index.html';
    } else {
      return this._getFormedName(index);
    }
  }

  _getFormedName(index) {
    const platformNames = [
      "TEMPLATE",//0
      "FACEBOOK",//1
      "ADCOLONY",//2
      "UNITY",//3
      "IRONSOURCE",//4
      "MINTEGRAL",//5
      "GOOGLE-L",//6
      "GOOGLE-P",//7
      "VUNGLE",//8
      "TIKTOK",//9
      "APPLOVIN",//10
      "CHARTBOOST"//11
    ];

    const type = WebpackConfig.version === WebpackConfig.versionFull ? '' : WebpackConfig.version === WebpackConfig.versionCB ? 'CB' : 'PN';

    const name = WebpackConfig.settings.gameTitle.replace(/ /g, '');
    const playableVersion = `V` + WebpackConfig.playableVersion.replace('.', '_');
    const playableDuration = this._getVersionDurationSymbol();
    const date = WebpackConfig.date.replace(/\./g, '');

    return `${platformNames[index]}_AP_${name}${playableVersion}${type}${playableDuration}_${date}.html`;
  }
};


