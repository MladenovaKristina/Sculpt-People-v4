import Model from '../../../data/model';
import SoundsController from '../kernel/soundscontroller';

export default class UnityGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.INIT;

    /*--------------------------mraid--------------------------------*/
    // console.log('%c VERSION: 15:32 ', 'background: #1a73e8; color: #ffffff');
    this.soundsController = new SoundsController();

    // Wait for the SDK to become ready
    if (mraid.getState() === "loading") {
      mraid.addEventListener("ready", () => { this.onSdkReady() });
    } else {
      this.onSdkReady();
    }
  }

  onSdkReady() {
    mraid.addEventListener("viewableChange", () => { this.viewableChangeHandler() });
    // Wait for the ad to become viewable for the first time
    if (mraid.isViewable()) {
      this.showMyAd();
    }
  }

  viewableChangeHandler() {
    // start/pause/resume gameplay, stop/play sounds
    if (mraid.isViewable()) {
      this.showMyAd();
    } else {
      // pause
      this.onUp();
    }
  }

  showMyAd() {
    //...
    if (Model.gameStep === Model.gameSteps.INIT) Model.gameStep = Model.gameSteps.LOAD;
  }

  /*--------------------------mraid--------------------------------*/
  onDown(event, x, y) { }

  goToStore() {
    console.log("Go to store");
    if (Model.operatingSystem === "ios") {
      mraid.open(Model.linkIOS);
    } else {
      mraid.open(Model.linkAndroid);
    }
    return;

  }

  update(delta) { }
}