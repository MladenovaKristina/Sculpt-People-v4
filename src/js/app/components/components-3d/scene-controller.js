import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class SceneController extends THREE.Object3D {
    constructor(camera, layout2d, layout3d) {
        super();
        this._camera = camera;
        this._layout2d = layout2d;
        this._layout3d = layout3d;
    }
    onDown(x, y) {
        setTimeout(() => { this.setCam(); }, 200)
    }

    onUp() {

    }

    onMove(x, y) {

    }

    setCam() {
        this._camera.threeCamera.position.x = -0.01;
    }
}