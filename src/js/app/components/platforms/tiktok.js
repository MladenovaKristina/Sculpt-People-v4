import Model from '../../../data/model';
import SoundsController from '..//kernel/soundscontroller';

export default class TikTokGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.LOAD;
    this.soundsController = new SoundsController();
  }

  onDown(event, x, y) { }

  goToStore() {
    // window.openAppStore();     OLD SDK
    console.log("Go to store");
    // window.playableSDK.openAppStore();
    window.openAppStore();
    return;
  }

  update(delta) { }
}