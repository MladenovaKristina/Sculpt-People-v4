import Model from '../../../data/model';
import SoundsController from '..//kernel/soundscontroller';

export default class FacebookGameController {
  constructor(scene, scenePrefab, cam) {

    this.scene = scene;
    this.camera = cam;
    this.scenePrefab = scenePrefab;

    this.soundsController = new SoundsController();

    Model.gameStep = Model.gameSteps.LOAD;
  }

  onDown(event, x, y) { }

  endOneRedirection() {
    Model.canGoToStore = false;
    this.goToStore();
  }

  goToStore() {
    console.log("Go to store");
    FbPlayableAd.onCTAClick();
    return;
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) { }
}
