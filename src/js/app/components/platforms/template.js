import ConfigurableParams from '../../../data/configurable_params';
import Model from '../../../data/model';
import SoundsController from '../kernel/soundscontroller';

export default class TemplateGameController {
  constructor() {
    Model.gameStep = Model.gameSteps.LOAD;

    this.soundsController = new SoundsController();
  }

  onDown(event, x, y) { }

  goToStore() {
    console.log("Go to store");
    if (ConfigurableParams.getData()["store_link"]["android"]["value"] !== "" && ConfigurableParams.getData()["store_link"]["ios"]["value"] !== "") {
      if ( Model.operatingSystem === "ios" ) {
        location.href = ConfigurableParams.getData()["store_link"]["ios"]["value"];
      } else {
        location.href = ConfigurableParams.getData()["store_link"]["android"]["value"];
      }
    } else {
      let successWindow = document.createElement("div");
      successWindow.id = "modal";
      successWindow.innerText = "You have successfully clicked"
      successWindow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: #00FE00;
        font-size: 6vw;
        font-weight: 600;
        padding-top: 5vw;
        padding-bottom: 5vw;
        transform: translateY(-100%);
        transition-duration: .5s;
      `;
      document.body.appendChild(successWindow);
      setTimeout(() => {
        successWindow.style.transform = "translateY(0)";
      }, 100);
      setTimeout(() => {
        successWindow.style.transform = "translateY(-100%)";
      }, 2000);
      setTimeout(() => {
        successWindow.remove();
      }, 3000);
    }
    return;
  }

  //=============================================
  // UPDATE
  //=============================================
  update(delta) { }
}
