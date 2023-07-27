import ConfigurableParams from "./configurable_params";
import WebpackConfig from "./settingswebpack"

const config = new WebpackConfig();
const platform = config.getAdvertisingPlatform();

export default {
  platform: null,

  linkIOS: platform === 'vungle' ? "" : ConfigurableParams.getData()["store_link"]["ios"]["value"],
  linkAndroid: platform === 'vungle' ? "" : ConfigurableParams.getData()["store_link"]["android"]["value"],

  // MAIN
  operatingSystem: null,
  loadStarted: false,
  assetsLoaded: false,

  // SOUNDS
  soundInitializationComplete: false,
  soundEarlyInitializationComplete: false,
  mute: false,

  gameSteps: {
    INIT: 0,
    LOAD: 1,
    READY: 2,
    SHOW: 3
  },
  gameStep: null
}
