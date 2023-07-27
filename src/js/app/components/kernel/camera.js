import { PerspectiveCamera } from 'three';
import Helpers from '../../helpers/helpers';

// Class that creates and updates the main camera
export default class Camera {
  constructor(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;

    this.threeCamera = null;
    this.currentPosition = null;
    this._orientation = null;

    if (window.innerWidth >= window.innerHeight) {
      this._orientation = "lanscape";
    } 
    else {
      this._orientation = "portrait";
    }

    this.threeCamera = new PerspectiveCamera(Helpers.LP(40, 60), width / height, 0.01, 100);
    this.threeCamera.setFocalLength(40);

    this.updateSize(renderer);
    window.addEventListener('resize', () => this.updateSize(renderer), false);
  }

  updateSize(renderer) {
    if (window.innerWidth >= window.innerHeight) {
      this._orientation = "lanscape";
    } 
    else {
      this._orientation = "portrait";
    }

    this.threeCamera.fov = Helpers.LP(40, 60);
    this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
    this.threeCamera.updateProjectionMatrix();
  }
}
