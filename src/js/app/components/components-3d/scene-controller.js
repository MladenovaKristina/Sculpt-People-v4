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
        this.sceneNumber = 0;
        this.scene0();
    }

    onDown(x, y) {
        if (this.sceneNumber == 0) {
            this.getClayAtPosition(x, y, () => {
                this._layout2d._hideClayHint();
                this._layout3d.hideClay();
                this.setCam(-2, () => {
                    this.scene1(this.selectedClayMaterial);
                });

            });

        }
    }
    getClayAtPosition(x, y, callback) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Convert screen coordinates (x, y) to normalized device coordinates (-1 to +1)
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, this._camera.threeCamera);

        // Array to store objects intersected by the ray
        const intersects = [];
        // Traverse through the children of this._layout3d.clay
        this._layout3d.clay.traverse((child) => {
            if (child.isMesh) {
                const intersect = raycaster.intersectObject(child);
                if (intersect.length > 0 && !this.selectedClayMaterial) {
                    this.selectedClayMaterial = intersect[0].object.material;
                    callback();
                    return;
                }
            }
        });
    }


    onUp() {

    }

    onMove(x, y) {

    }

    scene0() {
        this._layout3d._initClay();
        this._layout2d._startClayHint();
    }

    scene1(clayMaterial) {
        this.sceneNumber = 1;
        console.log("selected", clayMaterial)
        this._layout3d._initSculpt(clayMaterial);
    }

    setCam(setX, callback) {
        const tempCameraPosition = { x: this._camera.threeCamera.position.x }; // Temporary object to hold camera position

        const tween = new TWEEN.Tween(tempCameraPosition) // Use the temporary object for tweening
            .to({ x: setX }, 400)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                // Update the actual camera position using the value from the temporary object
                this._camera.threeCamera.position.x = tempCameraPosition.x;
            })
            .onComplete(() => {
                if (this._camera.threeCamera.position.x == setX)
                    callback();
            })
            .start();

        this.animate();
    }

    animate() {
        TWEEN.update();
        requestAnimationFrame(() => this.animate());
    }
}
