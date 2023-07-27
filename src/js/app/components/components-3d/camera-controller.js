import { Black, Ease } from "../../../utils/black-engine.module";
import * as THREE from "three";
import UTween from "../../../utils/utween";
import Helpers from "../../helpers/helpers";

export default class CameraController {
  constructor(camera) {
    this._camera = camera;

    this._shakeTween = null;

    this._startPosition = new THREE.Vector3();
    this._startRotation = 0;

    this._updatePositions();
    this._updateTransform();
  }

  onResize() {
    if (this._shakeTween) {
      this._shakeTween.stop();
    }

    this._updatePositions();
    this._updateTransform();

    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  _updateTransform() {
    let position = null;
    let rotationX = null;

    position = this._startPosition;
    rotationX = this._startRotation;

    this._camera.position.x = position.x;
    this._camera.position.y = position.y;
    this._camera.position.z = position.z;

    this._camera.rotation.x = rotationX;
  }

  _updatePositions() {
    if (Helpers.LP(false, true)) {
      this._startPosition = new THREE.Vector3(0, 0, 10);
    }
    else {
      this._startPosition = new THREE.Vector3(0, 0, 0.8);
    }
  }

  changePositions(x, y, z) {
    this._camera.position.x += x;
    this._camera.position.y += y;
    this._camera.position.z += z;
  }
}