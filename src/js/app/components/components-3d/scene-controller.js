import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Helpers from "../../helpers/helpers";

export default class SceneController extends THREE.Object3D {
    constructor(camera, layout2d, layout3d) {
        super();
        this._camera = camera;
        this._layout2d = layout2d;
        this._layout3d = layout3d;
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

    setCam() {
        const tween = new TWEEN.Tween({ x: this._camera.threeCamera.position.x }) // Use proper camera position reference
            .to({ x: -0.5 }, 200)
            .onUpdate(() => {
                console.log("aaa");
                this._camera.threeCamera.position.x = this.x; // Update the camera position properly
            })
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
