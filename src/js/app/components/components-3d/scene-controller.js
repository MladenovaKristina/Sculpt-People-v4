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
        // const mat = new THREE.MeshPhysicalMaterial({ color: 0xff00ff });
        // this.scene1(mat);
        this.sculptFinish = 0;
    }

    onDown(x, y) {
        if (this.sceneNumber === 0) {
            this.getClayAtPosition(x, y, () => {
                this._layout2d._hideClayHint();
                this._layout3d.hideClay();
                this.scene1(this.selectedClayMaterial);
            });
        }
        // if (this.sceneNumber == 1) {
        //     this._layout3d._sculpt.hide(this._layout3d._sculpt.group)
        //     this.scene2();
        // }

        if (this.sceneNumber == 2) {
            this.getElementAtPosition(x, y, () => {
                console.log(this.selectedDecorationMaterial.name)
            })
        }


    }
    getClayAtPosition(x, y, callback) {

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this._camera.threeCamera);

        const intersects = [];
        this._layout3d.clay.traverse((child) => {

            const intersect = raycaster.intersectObject(child);
            if (intersect.length > 0 && !this.selectedClayMaterial) {

                this.selectedClayMaterial = intersect[0].object.material;
                callback()

            }
        });

        return null;
    }

    getElementAtPosition(x, y, callback) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this._camera.threeCamera);
        const intersects = [];
        this._layout3d.dock.traverse((child) => {
            console.log("dock", child.name)

            const intersect = raycaster.intersectObject(child);
            if (intersect.length > 0 && !this.selectedDecorationMaterial) {

                this.selectedDecorationMaterial = intersect[0].object.material;
                callback()

            }
        });

        return null;

    }

    onUp() {

    }

    onMove(x, y) {
        if (this.sceneNumber == 1) {

            if (this.sculptFinish < 1) {
                this._layout3d._sculpt.playAnim('sculpt');
                this._layout3d._sculpt.smooth(x, y, this.sculptFinish);
                this.sculptFinish += 0.005;
            }
            else {

                this.scene2();

            }
        }
    }

    scene0() {
        this._layout3d._initClay();
        this._layout2d._startClayHint();
    }

    scene1(clayMaterial) {
        this.sceneNumber = 1;
        this._layout3d._initSculpt(clayMaterial);
        this.setCam(-2, () => {
            this._layout2d.startHint();
        });
    }

    scene2() {
        this.sceneNumber = 2;
        this._layout2d._tutorial.hide();

        this._layout3d._sculpt.head.rotation.set(Math.PI / 2, 0, 0)
        this._layout3d._sculpt.head.visible = true;
        this._layout3d._sculpt.hide(this._layout3d._sculpt.arm);
        this._layout3d._sculpt.hide(this._layout3d._sculpt.rightArm);

        this._layout3d._initDock();
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
