import { Vector3 } from "three";
import TWEEN from "@tweenjs/tween.js";
import Helpers from "../../helpers/helpers";

export default class CameraController {
  constructor(camera) {
    this._camera = camera;

    this._shakeTween = null;

    this._startPosition = new Vector3();
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

    this._camera.lookAt(new Vector3(0.5, 0, 0))
  }

  setLookingAt(position) {
    const lookAtTarget = new Vector3(position.x, position.y, position.z);
    const currentLookAt = this._camera.getWorldDirection(new Vector3());
    const duration = 500;
    // Create a new tween for the camera's lookAt position
    const tween = new TWEEN.Tween(currentLookAt)
      .to(lookAtTarget, duration)
      .onUpdate(() => {
        this._camera.lookAt(currentLookAt);
      })
      .start();
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
      this._startPosition = new Vector3(0.5, 0, 1);
    }
    else {
      this._startPosition = new Vector3(0.5, 0, 1);
    }
  }

  changePositions(x, y, z) {
    this._camera.position.x += x;
    this._camera.position.y += y;
    this._camera.position.z += z;
  }
}