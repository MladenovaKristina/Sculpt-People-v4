import { Black, MessageDispatcher, Timer, GameObject } from "../../utils/black-engine.module";
import * as THREE from 'three';
import Model from "../../data/model";
import Helpers from "../helpers/helpers";
import Layout2D from "./components-2d/layout-2d";
import CameraController from "./components-3d/camera-controller";
import SoundsController from "./kernel/soundscontroller";
import ConfigurableParams from "../../data/configurable_params";
import Layout3D from "./components-3d/layout-3d";
import SceneController from "./components-3d/scene-controller";

export default class Game {
  constructor(scene, camera, renderer) {

    this.messageDispatcher = new MessageDispatcher();
    this.onFinishEvent = 'onFinishEvent';

    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;

    this._state = STATES.INTRO;

    this._clicks = 0;
    this._startTime = 0;

    this._storeOnDown = false;
    this._lastClickTime = 0;

    this._clicksToStore = ConfigurableParams.getData()["market_details"]["go_to_market_after_x_click"]["value"];
    this._timeToStore = ConfigurableParams.getData()["market_details"]["go_to_market_after_x_time"]["value"];

    this._init();

    this.onResize();
    Black.stage.on('resize', this.onResize, this);
  }

  _init() {
    this._cameraController = new CameraController(this._camera.threeCamera);

    this._initLayout2D();
    this._initLayout3D();
    this._initSceneController();
  }

  start() {
    this._startTime = Date.now();

    if (ConfigurableParams.isXTime()) {
      setInterval(() => {
        this._countTime();
      }, 1000);
    }
  }

  _initLayout2D() {
    this._layout2d = new Layout2D();
    Black.stage.add(this._layout2d);

    this._layout2d.on(this._layout2d.onPlayBtnClickEvent, (msg) => {
      this._state = STATES.FINAL;
      this.messageDispatcher.post(this.onFinishEvent);
    });
  }

  _initLayout3D() {
    this._layout3d = new Layout3D(this._camera);
    this._scene.add(this._layout3d);
  }

  _initSceneController() {
    this._sceneController = new SceneController(this._camera, this._layout2d, this._layout3d);
    this._scene.add(this._layout3d);
  }

  onDown(x, y) {
    const downloadBtnClicked = this._layout2d.onDown(x, y);
    if (downloadBtnClicked) return;

    this._isDown = true;
    this._lastClickTime = Date.now();

    if (this._storeOnDown) {
      this._onFinish();
    }

    this._countClicks();
    this._sceneController.onDown(x, y);
  }

  onMove(x, y) {
    // if (this._state !== STATES.GAMEPLAY) return;

    this._layout2d.onMove(x, y);
    this._sceneController.onMove(x, y);
  }

  onUp() {
    // if (this._state !== STATES.GAMEPLAY) return;
    this._isDown = false;

    this._layout2d.onUp();
  }

  _countClicks() {
    if (this._isStore) return;

    this._clicks++;
    if (ConfigurableParams.isXClick() && this._clicks >= this._clicksToStore) {
      this._onFinish();
      console.log('clicks');
    }
  }

  _countTime() {
    if (this._isStore) return;

    if (ConfigurableParams.isXTime() && (Date.now() - this._startTime) / 1000 > this._timeToStore) {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown || ConfigurableParams.isPN())
        this._onFinish()
      else
        this._storeOnDown = true;

      console.log('time');
    }
  }

  onUpdate(dt) {
    if (this._isStore) return;
    dt = Math.min(dt, 0.02);

  }

  onResize() {
    this._cameraController.onResize();
  }

  _onFinish() {
    if (this._state === STATES.FINAL) return;
    this._state = STATES.FINAL;

    if (ConfigurableParams.isPN()) {
      if (Model.platform === 'vungle') {
        parent.postMessage('complete', '*');
      }

      if (ConfigurableParams.getData()['audio']['sound_final_enabled']['value'])
        SoundsController.playWithKey('win');

      this.enableStoreMode();
    }
    else {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown)
        this.messageDispatcher.post(this.onFinishEvent);
      else
        this._storeOnDown = true;
    }
  }

  enableStoreMode() {
    if (this._isStore) return;
    this._isStore = true;
    this._state = STATES.FINAL;

    SoundsController.playWithKey('win');

    this._layout2d.enableStoreMode();
  }
}

const STATES = {
  INTRO: 0, // if we want to make some action before the player interaction
  GAMEPLAY: 1,
  OUTRO: 2, // if we want to make some action before the end screen
  FINAL: 3 // end screen
};
