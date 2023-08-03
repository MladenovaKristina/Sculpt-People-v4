
import { Object3D, Raycaster, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { Black } from "../../../utils/black-engine.module";

export default class SceneController extends Object3D {
    constructor(camera, cameraController, layout2d, layout3d) {
        super();
        this._camera = camera;
        this._cameraController = cameraController;

        this._layout2d = layout2d;
        this._layout3d = layout3d;
        this.sceneNumber = 0;
        this.scene0();
        this.sculptFinish = 0;
        this.canMove = false;
    }

    onDown(x, y) {
        this.canMove = true;
        if (this.sceneNumber === 0) {

            this.getClayAtPosition(x, y, () => {

                this._layout2d._hideClayHint();
                this._layout3d.hideClay();
                this.scene1(this.selectedClayMaterial);
            });
        }

        if (this.sceneNumber === 2) {
            this.scene3();
        }
        if (this.sceneNumber === 3) {
            this.clickToEquip(x, y)
        }

        if (this.sceneNumber === 4) {
            this.scene5();
        }
    }

    getClayAtPosition(x, y, callback) {
        const raycaster = new Raycaster();
        const mouse = new Vector2();

        // Convert screen coordinates (x, y) to normalized device coordinates (-1 to +1)
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this._camera.threeCamera); // Use "this._camera" directly as it is the js camera object.
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
        if (this.canMove) {
            const raycaster = new Raycaster();
            const mouse = new Vector2();

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
    }
    onUp() {
        // if (this.sceneNumber === 3 && this.selectedDecoration) {
        //     this.draggedToHead()
        // }
    }

    draggedToHead() {
        if (this.canMove) {
            const bboxSelectedDecoration = new Box3().setFromObject(this.selectedDecoration);
            const bboxSculptHead = new Box3().setFromObject(this._layout3d._sculpt.head);

            const intersects = bboxSculptHead.intersectsBox(bboxSelectedDecoration);

            if (intersects && this.selectedDecoration.name) { // Add a check for name property
                this._layout3d._sculpt.head.traverse((element) => {
                    if (element.name === this.selectedDecoration.name) {
                        element.visible = true;
                        this.selectedDecoration.visible = false;
                        this.selectedDecoration = null;
                        this.numberOfDecorations--;
                        if (this.numberOfDecorations <= 0) { this.scene4(); }
                    }
                });
            }
        } else {
            // reset position
            this.selectedDecoration = null;
        }
    }

    clickToEquip(x, y) {
        if (this.canMove) {

            const raycaster = new Raycaster();
            const mouse = new Vector2();

            // Convert mouse coordinates to normalized device coordinates (-1 to +1)
            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, this._camera.threeCamera);

            // Find all intersected objects from _layout3d.dock elements
            const intersects = raycaster.intersectObjects(this._layout3d.dock.children, true);

            if (intersects.length > 0) {
                const selectedDecoration = intersects[0].object;

                // Find the element within this._layout3d._sculpt.head with the same name
                const elementInHead = this._layout3d._sculpt.head.getObjectByName(selectedDecoration.name);

                if (elementInHead) {
                    console.log("Clicked element:", selectedDecoration);
                    // Make the dock element invisible and the corresponding element in the head visible
                    selectedDecoration.visible = false;
                    elementInHead.visible = true;

                    // Set this.selectedDecoration to null as it's no longer selected
                    this.selectedDecoration = null;

                    this.numberOfDecorations--;
                    if (this.numberOfDecorations <= 0) {
                        this.scene4();
                    }
                }
            }
        }
    }

    onMove(x, y) {
        if (this.sceneNumber === 1 && this.canMove) {

            if (this.sculptFinish < 1) {
                this._layout3d._sculpt.playAnim('sculpt');
                this._layout3d._sculpt.smooth(x, y, this.sculptFinish);
                this.sculptFinish += 0.005;
            }
            else {
                this.scene2();
            }


            //             if (this.sceneNumber === 3 && this.canMove) {
            //                 const mouse = new Vector2();
            //                 mouse.x = (x / window.innerWidth) * 2 - 1;
            //                 mouse.y = -(y / window.innerHeight) * 2 + 1;
            // 
            //                 this.getElementAtPosition(mouse.x, mouse.y)
            // 
            //                 if (this.selectedDecoration) {
            //                     this.moveToMouse(mouse.x, mouse.y)
            //                 }
            // 
            //             }
        }
    }

    moveToMouse(x, y) {
        this.selectedDecoration.position.x = x;
        this.selectedDecoration.position.y = y + 3;
        this.selectedDecoration.position.z = -1;
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
        this._layout2d._cheers.show(0, Black.stage.centerX - 1, Black.stage.centerY + 1);

        this._layout2d._tutorial.hide();

        this._layout3d._sculpt.head.rotation.set(Math.PI / 2, 0, 0)
        this._layout3d._sculpt.head.visible = true;

        this._layout3d._sculpt.hide(this._layout3d._sculpt.arm);
        this._layout3d._sculpt.hide(this._layout3d._sculpt.rightArm);
        this.canMove = false;
        console.log("scene", this.sceneNumber);

    }
    scene3() {
        this._layout2d._cheers.show(1, Black.stage.centerX + 1, Black.stage.centerY - 1);

        this.sceneNumber = 3;

        this.canMove = false;
        this._layout3d._initDock("head");
        this.numberOfDecorations = this._layout3d.dock.children.length;
    }

    scene4() {
        this._layout2d._cheers.show(2, Black.stage.centerX + 1, Black.stage.centerY - 1);

        this.sceneNumber = 4;
        this._layout3d.hide(this._layout3d.bg);

        console.log("painting scene implement pls", this.sceneNumber);
    }
    scene5() {
        this.sceneNumber = 5;
        this.setCam(0, () => {
            this._layout2d._confetti.show()
            // this._layout2d._cheers.show(3, Black.stage.centerX, Black.stage.centerY - 2);

        });
        this._cameraController.setLookingAt(this._layout3d.stand.position)

        console.log("celebrate scene", this.sceneNumber);
    }
    scene6() {
        // this._layout2d._cheers.show(4, Black.stage.centerX + 1, Black.stage.centerY - 1);

        this.sceneNumber = 6;
        this._layout3d._initDock("body");

        console.log("body scene implement pls", this.sceneNumber);
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
