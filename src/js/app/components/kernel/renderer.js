import { WebGLRenderer, PCFShadowMap } from 'three';
import Config from '../../../data/config';
import ConfigurableParams from '../../../data/configurable_params';
const WebpackConfig = require('../../../data/settingswebpack');

export default class Renderer {
  constructor(scene, container) {
    this.scene = scene;
    this.container = container;

    this.webpackConfig = new WebpackConfig();

    this.threeRenderer = new WebGLRenderer({ antialias: false, });

    const bgColor = Number(ConfigurableParams.getData()["settings"]["background_color"]["value"].replace('#', '0x'));
    this.threeRenderer.setClearColor(bgColor);

    try {
      this.threeRenderer.setPixelRatio(window.devicePixelRatio);
    } catch (error) {
      // For performance ¯\_(ツ)_/¯
      this.threeRenderer.setPixelRatio(1);
    }

    // Appends canvas
    container.appendChild(this.threeRenderer.domElement);

    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = PCFShadowMap;
    this.threeRenderer.localClippingEnabled = true;

    this.updateSize();
    document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize() {
    if (this.webpackConfig.ifUseMraid()) {
      try {
        let screenSize = mraid.getScreenSize();

        if (Number.isInteger(screenSize.width) && Number.isInteger(screenSize.height)) {
          this.threeRenderer.setSize(screenSize.width, screenSize.height);
          Config.screen.width = screenSize.width;
          Config.screen.height = screenSize.height;
        }
        else {
          this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
          Config.screen.width = this.container.offsetWidth;
          Config.screen.height = this.container.offsetHeight;
        }
      }
      catch (error) {
        this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        Config.screen.width = this.container.offsetWidth;
        Config.screen.height = this.container.offsetHeight;
      }
    }
    else {
      this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      Config.screen.width = this.container.offsetWidth;
      Config.screen.height = this.container.offsetHeight;
    }
  }

  render(scene, camera) {
    this.threeRenderer.render(scene, camera);
  }
}
