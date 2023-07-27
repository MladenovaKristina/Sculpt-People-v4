// import * as THREE from 'three';
import { Clock, Scene, Cache } from 'three';
import { Black, GameObject, CanvasDriver, Input, Engine, StageScaleMode } from "../utils/black-engine.module";

// import OrbitControls from '../utils/orbitControls'
import Renderer from './components/kernel/renderer';
import Camera from './components/kernel/camera';
import Light from './components/kernel/light';
import Loader3D from './components/kernel/loader-3d';
import GameController from './components/gamecontroller';
import AssetsLoader from './components/kernel/assets-loader-2d';
import Config from '../data/config';

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor(container) {

    this.clock = new Clock();
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene, container);
    this.camera = new Camera(this.renderer.threeRenderer);
    this.light = new Light(this.scene);

    Cache.enabled = true;

    const blackEngine = new Engine('appInnerContainer', GameObject, CanvasDriver, [Input]);
    blackEngine.pauseOnBlur = false;
    blackEngine.pauseOnHide = false;
    blackEngine.start();
    blackEngine.stage.setSize(960, 960);
    blackEngine.stage.scaleMode = StageScaleMode.LETTERBOX;
    blackEngine.viewport.isTransparent = true;

    const load = () => {
      const blackAssetsLoader = new AssetsLoader();
      blackAssetsLoader.on(blackAssetsLoader.loaded, (msg) => {
        this.scenePrefab = new Loader3D();
        this.scenePrefab.load().then((r) => {
          Config.isLoaded = true;
          this.game.onLoad();
        });
      });

      Black.stage.add(blackAssetsLoader);
    };

    this.game = new GameController(this.scene, this.camera, this.renderer, load);

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera.threeCamera);
    const delta = this.clock.getDelta();
    this.game.update(delta);

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
