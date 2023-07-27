import Config from '../../../data/config';
import Model from '../../../data/model';
import SoundsController from '../kernel/soundscontroller';

export default class MintegralController {
  constructor() {
    Model.gameStep = Model.gameSteps.LOAD;
    this.soundsController = new SoundsController();
    this.gameReady = false;
  }

  //=============================================
  // Mintegral API: 5. Called gameStart method. By exposing a global public function name "gameStart" in the game, we will automatically call this function at the beginning of the game,so that developers can handle some logic at the beginning of the game, such as starting the countdown, starting the background music, etc.
  //=============================================
  gameStart() {

  }

  gameIsReady() {
    //=============================================
    //Mintegral API: 4. Called gameReady method All resources need to be loaded while game initializing, once the loading completes must call API window.gameReady && window.gameReady(); 
    //=============================================
    window.gameReady && window.gameReady();
    this.gameReady = true;
  }

  onDown(event, x, y) { }

  goToStore() {
    //=============================================
    //Mintegral API: 2. Called download button method. The whole process of the playable needs a button for directing to Store, in order to make sure a button labeled “Download Now” can be shown all the time through the game and direct to Store. All features that direct to App Store must call API window.install && window.install(); 
    //=============================================
    window.install && window.install();

    //=============================================
    //Mintegral API: 3. Called gameEnd method. At the end of the game (when the game wins or fails), you should call the API window.gameEnd && window.gameEnd(); 
    //=============================================
    window.gameEnd && window.gameEnd();

    console.log("Go to store");

    return;
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) {
    this.delta = delta;

    if (Model.gameStep === Model.gameSteps.SHOW && !this.gameReady) {
      this.gameIsReady();
      this.gameStart();
    }
  }
}