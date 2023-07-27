import Model from '../../../data/model';
import SoundsController from '..//kernel/soundscontroller';

export default class VungleGameController {

  constructor() {
    Model.gameStep = Model.gameSteps.LOAD;
    this.pause = false;
    this.soundsController = new SoundsController();

    ////////////////    Vungle PAUSE   ///////////////////
    window.addEventListener('ad-event-pause', () => {
      // Pause audio/video/animations inside here
      this.pause = true;
      this.onUp();
    });

    ////////////////    Vungle RESUME   ///////////////////
    window.addEventListener('ad-event-resume', () => {
      // Resume audio/video/animations inside here
      this.pause = false;
    });
  }

  onDown(event, x, y) { }

  goToStore() {
    //////////////////////////////////////              VUNGLE     go to store AND end              /////////////////////////////////////////////////////////////////////
    console.log("Go to store");
    parent.postMessage('download', '*');
    return;
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) { }
}
