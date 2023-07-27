import Model from '../../../data/model';
import SoundsController from '../kernel/soundscontroller';

export default class AdColonyGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.INIT;
    this.soundsController = new SoundsController();

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
  onDown(event, x, y) {
    /*--------------------------AdColony BEGIN--------------------------------*/
    if (event.target.id === "volume_on") {
      this.volumeOnOff("on");
      return;
    }
    if (event.target.id === "volume_off") {
      this.volumeOnOff("off");
      return;
    }
    /*--------------------------AdColony END--------------------------------*/
  }

  goToStore() {
    console.log("Go to store");
    if (Model.operatingSystem === "ios") {
      mraid.open(Model.linkIOS);
    } else {
      mraid.open(Model.linkAndroid);
    }
    return;
  }

  volumeOnOff(name) {
    if (name === "on") {
      document.getElementById("volume_on").style.display = "none";
      document.getElementById("volume_off").style.display = "block";
      Model.mute = true;
      this.soundsController.pauseAll();
    } else {
      document.getElementById("volume_off").style.display = "none";
      document.getElementById("volume_on").style.display = "block";
      Model.mute = false;
      this.soundsController.continueAll();
    }
  }

  update(delta) { }
}