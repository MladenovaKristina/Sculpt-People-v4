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



    }
    getClayAtPosition(x, y, callback) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Convert screen coordinates (x, y) to normalized device coordinates (-1 to +1)
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this._camera.threeCamera); // Use "this._camera" directly as it is the Three.js camera object.
        const intersects = [];
        this._layout3d.clay.traverse((child) => {
            const intersect = raycaster.intersectObject(child); // The second parameter "true" enables recursive traversal.
            if (intersect.length > 0 && !this.selectedClayMaterial) {
                this.selectedClayMaterial = intersect[0].object.material;
                callback();
            }
        });
    }


    getElementAtPosition(x, y) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = x;
        mouse.y = y;

        raycaster.setFromCamera(mouse, this._camera.threeCamera);
        const intersects = [];
        this._layout3d.dock.traverse((child) => {

            const intersect = raycaster.intersectObject(child);
            if (intersect.length > 0 && !this.selectedDecoration) {
                this.selectedDecoration = intersect[0].object;

            }
        });
    }


    onUp() {
        if (this.sceneNumber === 2 && this.selectedDecoration) {
            const bboxSelectedDecoration = new THREE.Box3().setFromObject(this.selectedDecoration);
            const bboxSculptHead = new THREE.Box3().setFromObject(this._layout3d._sculpt.head);

            const intersects = bboxSculptHead.intersectsBox(bboxSelectedDecoration);

            if (intersects) {
                console.log("true");

                if (this.numberOfDecorations > 0) {
                    this.numberOfDecorations--;

                    this._layout3d._sculpt.head.traverse((element) => {

                        if (element.name === this.selectedDecoration.name) {
                            element.visible = true;
                            this.selectedDecoration.visible = false;
                            this.selectedDecoration = null;

                        }
                    })
                } else if (this.numberOfDecorations <= 0) { this.scene3(); }
            }


        } else {
            // reset position
            this.selectedDecoration = null;
        }
    }
}


onMove(x, y) {
    if (this.sceneNumber === 1) {

        if (this.sculptFinish < 1) {
            this._layout3d._sculpt.playAnim('sculpt');
            this._layout3d._sculpt.smooth(x, y, this.sculptFinish);
            this.sculptFinish += 0.005;
        }
        else {
            this.scene2();
        }
    }

    if (this.sceneNumber === 2) {
        const mouse = new THREE.Vector2();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        this.getElementAtPosition(mouse.x, mouse.y)

        if (this.selectedDecoration) {
            this.selectedDecoration.position.x = mouse.x;
            this.selectedDecoration.position.y = mouse.y + 3;
            this.selectedDecoration.position.z = -1;

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
    this._layout3d._initDock();
    this.numberOfDecorations = this._layout3d.dock.children.length;

    this.sceneNumber = 2;
    this._layout2d._tutorial.hide();

    this._layout3d._sculpt.head.rotation.set(Math.PI / 2, 0, 0)
    this._layout3d._sculpt.head.visible = true;

    this._layout3d._sculpt.hide(this._layout3d._sculpt.arm);
    this._layout3d._sculpt.hide(this._layout3d._sculpt.rightArm);

}
scene3() {
    this.sceneNumber = 3;
    console.log("scene", this.sceneNumber);
}

setCam(setX, callback) {
    const tempCameraPosition = { x: this._camera.threeCamera.position.x }; // Temporary object to hold camera position

    const tween = new TWEEN.Tween(tempCameraPosition) // Use the temporary object for tweening
        .to({ x: setX }, 400)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
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
