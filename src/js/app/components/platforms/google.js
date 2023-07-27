import Model from '../../../data/model';
import SoundsController from '..//kernel/soundscontroller';

export default class GoogleGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.LOAD;

    this.soundsController = new SoundsController();
  }

  onDown(event, x, y) {
  }

  onUp() { }

  goToStore() {
    console.log("Go to store");
    ExitApi.exit();
    return;
  }

  update(delta) { }
}