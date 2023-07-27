import { Black, Vector } from "../../utils/black-engine.module";
import * as THREE from 'three';

export default class Helpers {
  static LP(l, p) {
    return window.innerWidth > window.innerHeight ? l : p;
  }

  static clamp(value, min, max) {
    return value > max ? max : value < min ? min : value;
  }

  static clampMirror(value, min, max) {
    if (value > 0) return Math.max(max, value);
    if (value < 0) return Math.min(min, value);
    return 0;
  }

  static rndSign() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  /**
   * Converts point in Three.js 3D space to BlackSmith 2D space
   * @param {THREE.Vector3} vector3 3d position of the object in Three.js space
   * @param {THREE.WebGLRenderer} renderer 
   * @param {THREE.PerspectiveCamera} camera 
   * @returns {Vector} 2d position in Black space
   */
  static vector3ToBlackPosition(vector3, renderer, camera) {
    const dpr = Black.device.getDevicePixelRatio();
    const width = renderer.getContext().canvas.width / dpr;
    const height = renderer.getContext().canvas.height / dpr;

    camera.updateMatrixWorld();

    const tempVector3 = new THREE.Vector3().copy(vector3);
    tempVector3.project(camera);

    const globalPos = new Vector().copyFrom(tempVector3);
    globalPos.x = (globalPos.x + 1) * width / 2;
    globalPos.y = - (globalPos.y - 1) * height / 2;

    return Black.stage.worldTransformationInverted.transformVector(globalPos);
  }
}