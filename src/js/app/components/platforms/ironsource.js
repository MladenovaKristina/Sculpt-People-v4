import Config from '../../../data/config';
import Model from '../../../data/model';
import SoundsController from '../kernel/soundscontroller';

export default class IronSourceGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.INIT;

    this.soundsController = new SoundsController();

    /* -------------------------------DAPI------------------------------------ */
    //LOAD the game, but don't start it until the ad is visible
    window.onload = () => {
      (dapi.isReady()) ? () => { this.onReadyCallback() } : dapi.addEventListener("ready", () => { this.onReadyCallback() });
    };
  }

  onReadyCallback() {
    // console.log('%c READY ', 'background: #0095ff; color: #ffffff');
    //no need to listen to this event anymore
    dapi.removeEventListener("ready", () => { this.onReadyCallback() });

    if (dapi.isViewable()) {
      this.adVisibleCallback({ isViewable: true });
      // console.log('%c Check if visible TRUE ', 'background: #0095ff; color: #ffffff');
    }

    let isAudioEnabled = !!dapi.getAudioVolume();

    dapi.addEventListener("viewableChange", () => { this.adVisibleCallback(event) });
    dapi.addEventListener("adResized", () => { this.adResizeCallback() });
    dapi.addEventListener("audioVolumeChange", () => { this.audioVolumeChangeCallback(event) });
  }

  adVisibleCallback(event) {
    // console.log('%c VISIBLE ' + event.isViewable, 'background: #0095ff; color: #ffffff');
    if (event.isViewable) {

      //START or RESUME the ad
      if (Model.gameStep === Model.gameSteps.INIT) Model.gameStep = Model.gameSteps.LOAD;
      this.screenSize = dapi.getScreenSize();
    } else {
      this.onUp();
    }
  }

  adResizeCallback() {
    this.screenSize = dapi.getScreenSize();
    // console.log('%c RESIZE: width:' + this.screenSize.width +' height: '+ this.screenSize.height, 'background: #0095ff; color: #ffffff');
  }

  //When user clicks on the download button - use openStoreUrl function
  userClickedDownloadButton(event) {
    dapi.openStoreUrl();
  }

  audioVolumeChangeCallback(volume) {
    // console.log('%c VALUE CHANGE to '+volume, 'background: #0095ff; color: #ffffff');
    let isAudioEnabled = !!volume;
    if (isAudioEnabled) {
      //START or turn on the sound
      Model.mute = true;
    } else {
      //PAUSE the turn off the sound
      Model.mute = false;
    }
  }

  /* -------------------------------DAPI------------------------------------ */
  onDown(event, x, y) { }

  goToStore() {
    console.log("Go to store");

    this.userClickedDownloadButton();
    return;
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) {
    this.delta = delta;

    if (Model.gameStep === Model.gameSteps.INIT) {
      try {
        if (dapi.isViewable()) {
          Model.gameStep = Model.gameSteps.LOAD;
        }
      } catch (error) {
      }
    }
  }
}  