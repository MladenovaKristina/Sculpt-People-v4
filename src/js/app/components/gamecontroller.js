import Config from '../../data/config';
import ConfigurableParams from '../../data/configurable_params';
import Model from '../../data/model';
import Game from './game';

import TemplateGameController from './platforms/template';
// import FacebookGameController from './platforms/facebook';
// import AdColonyGameController from './platforms/adcolony';
// import UnityGameController from './platforms/unity';
// import IronSourceGameController from './platforms/ironsource';
// import MintegralController from './platforms/mintegral';
// import GoogleGameController from './platforms/google';
// import VungleGameController from './platforms/vungle';
// import TikTokGameController from './platforms/tiktok';

const WebpackConfig = require('../../data/settingswebpack');

export default class GameController {
  constructor(scene, camera, renderer, load) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.load = load;

    this.setMobileOperatingSystem();
    const config = new WebpackConfig();
    this.platform = config.getAdvertisingPlatform();

    if (this.platform === "mintegral") {
      window.dispatchEvent(new Event('resize'));
    } else if (this.platform === "google_landscape") {
      window.dispatchEvent(new Event('resize'));
    }

    this.redirectedToStore = false;
    this.gameController = null;
    this.isDown = false;
    Model.platform = this.platform;

    if (this.platform === "template") {
      this.gameController = new TemplateGameController();
    } else if (this.platform === "facebook") {
      this.gameController = new FacebookGameController();
    } else if (this.platform === "unity") {
      this.gameController = new UnityGameController();
    } else if (this.platform === "adcolony") {
      this.gameController = new AdColonyGameController();
    } else if (this.platform === "ironsource") {
      this.gameController = new IronSourceGameController();
    } else if (this.platform === "mintegral") {
      this.gameController = new MintegralController();
    } else if (this.platform === "google_landscape") {
      this.gameController = new GoogleGameController();
    } else if (this.platform === "google_portrait") {
      this.gameController = new GoogleGameController();
    } else if (this.platform === "vungle") {
      this.gameController = new VungleGameController();
    } else if (this.platform === "tiktok") {
      this.gameController = new TikTokGameController();
    }

    const type = WebpackConfig.version === WebpackConfig.versionFull ? 'DEFAULT' : ConfigurableParams.isCB() ? 'CLICKBAIT' : 'PLAY NOW BUTTON';
    console.log(`Build on platform ${Model.platform}. Date: ${WebpackConfig.date}. Version ${WebpackConfig.playableVersion}. Type: ${type}.`)

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.gameController.soundsController.pauseAll();
      }
      else if (document.visibilityState === "visible") {
        if (Model.operatingSystem === "ios") {
          Model.soundInitializationComplete = false;
        } else {
          this.gameController.soundsController.continueAll();
        }
      }
    });

    //=============================================
    // CREATION AND INITIALIZATION EVENTS LISTENERS
    //=============================================
    if ('ontouchstart' in document.documentElement) {
      window.addEventListener('touchstart', (event) => {
        event.preventDefault();
        this.onDown(event, event.touches[0].clientX, event.touches[0].clientY);
      }, { passive: false });
      window.addEventListener('touchend', (event) => {
        event.preventDefault();
        this.onUp();
      }, { passive: false });
      window.addEventListener('touchmove', (event) => {
        event.preventDefault();
        this.onMove(event.touches[0].clientX, event.touches[0].clientY);
      }, { passive: false });
    }
    else {
      window.addEventListener('mousedown', (event) => {
        this.onDown(event, event.clientX, event.clientY);
      });
      window.addEventListener('mouseup', () => {
        this.onUp();
      });
      window.addEventListener('mousemove', (event) => {
        this.onMove(event.clientX, event.clientY);
      });
    }

    Config.isLoaded = true;
  }

  onLoad() {
    this.game = new Game(this.scene, this.camera, this.renderer);

    this.game.messageDispatcher.on(this.game.onFinishEvent, (msg) => {
      this.redirectedToStore = true;
      this.gameController.goToStore();

      setTimeout(() => {
        this.game.enableStoreMode();
      }, 500);
    });

    Model.assetsLoaded = true;
  }

  onDown(event, x, y) {
    this.isDown = true;

    if (!Model.soundInitializationComplete) this.gameController.soundsController.initialization();
    this.gameController.onDown(event, x, y);

    if (this.redirectedToStore && !ConfigurableParams.isPN()) {
      this.gameController.goToStore();
    }
    else {
      this.game && this.game.onDown(x, y);
    }
  }

  onUp() {
    this.isDown = false;
    this.game && this.game.onUp();
  }

  onMove(x, y) {
    if (!this.isDown) return;
    this.game && this.game.onMove(x, y);
  }

  setMobileOperatingSystem() {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      Model.operatingSystem = "android";
    } else {
      Model.operatingSystem = "ios";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      Model.operatingSystem = "ios";
    }
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) {
    if (this.gameController === null) return;

    delta = Math.min(delta, 0.1);
    this.gameController.update(delta);

    if (this.game)
      this.game.onUpdate(delta);

    this._updateGameSteps();
  }

  _updateGameSteps() {
    if (Model.gameStep === Model.gameSteps.LOAD) {
      if (!Model.loadStarted) {
        Model.loadStarted = true;
        this.load();
      }
      if (Model.assetsLoaded) {
        Model.gameStep = Model.gameSteps.READY;
        if (!Model.soundEarlyInitializationComplete) this.gameController.soundsController.initializationEarly();
      }
    }
    else if (Model.gameStep === Model.gameSteps.READY) {
      Model.gameStep = Model.gameSteps.SHOW;
      if (this.platform !== 'mintegral') document.getElementById("loading-screen").style.display = "none";
      this.game.start();
    }
  }
}
