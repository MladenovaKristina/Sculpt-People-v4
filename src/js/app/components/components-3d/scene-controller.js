import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Helpers from "../../helpers/helpers";
import { Vector3 } from "three";

export default class SceneController extends THREE.Object3D {
    constructor(camera, layout2d, layout3d) {
        super();
        this._camera = camera;
        this._layout2d = layout2d;
        this._layout3d = layout3d;

        this.scene0();
    }
    onDown(x, y) {
        setTimeout(() => {
            this.setCam();
        }, 200);
    }

    onUp() {

    }

    onMove(x, y) {

    }

    scene0() {
        this._layout3d._initClay();
        this._layout2d._startClayHint();
    }

    setCam() {
        const tween = new TWEEN.Tween(this._camera.threeCamera.position) // Use proper camera position reference
            .to({ x: -2 }, 400)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start(); // Correctly call start method

        // Make sure you have your animation loop in the SceneController class to update the tween
        this.animate();
    }

    animate() {
        // Your animation logic here
        TWEEN.update();
        requestAnimationFrame(() => this.animate());
    }
}
