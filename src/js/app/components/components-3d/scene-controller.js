
import { Object3D, Raycaster, Vector2, Vector3 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { Black } from "../../../utils/black-engine.module";
import Helpers from "../../helpers/helpers";

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
            this.nextScene(3)
        }
        if (this.sceneNumber === 3) {
            this.nextScene(4)
        }
        if (this.sceneNumber === 4) {
            this.clickToEquip(x, y)
        }

        if (this.sceneNumber === 5) {
            this.clickToEquip(x, y)
            // this.nextScene(6)

        }
        if (this.sceneNumber === 6) {
            this.nextScene(7)
        }
        if (this.sceneNumber === 7) {
            this.clickToEquip(x, y)
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
                this._layout3d.model3d.head.traverse((element) => {
                    if (element.name === this.selectedDecoration.name) {
                        element.visible = true;
                        this.selectedDecoration.visible = false;
                        this.selectedDecoration = null;
                        this.numberOfDecorations--;
                        if (this.numberOfDecorations <= 0) { this.nextScene(this.sceneNumber + 1); }
                    }
                });
            }
        } else {
            this.selectedDecoration = null;
        }
    }

    nextScene(scene) {
        if (scene === 0) {
            this.scene0();
        }
        if (scene === 1) {
            this.scene1();
        }
        if (scene === 2) {
            this.scene2();
        }
        if (scene === 3) {
            this.scene3();
        }
        if (scene === 4) {
            this.scene4();
        }
        if (scene === 5) {
            this.scene5();
        }
        if (scene === 6) {
            this.scene6();
        }
        if (scene === 7) {
            this.scene7();
        }

    }
    clickToEquip(x, y) {
        if (this.canMove) {

            const raycaster = new Raycaster();
            const mouse = new Vector2();

            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this._camera.threeCamera);

            const intersects = raycaster.intersectObjects(this._layout3d.dock.children, true);
            console.log(intersects)
            if (intersects.length > 0) {
                const selectedDecoration = intersects[0].object;

                let headGroup = this._layout3d.model3d.head
                const elementInHead = headGroup.getObjectByName(selectedDecoration.name);

                if (elementInHead) {

                    selectedDecoration.visible = false;
                    elementInHead.visible = true;

                    this.selectedDecoration = null;

                    this.numberOfDecorations--;
                    if (this.numberOfDecorations <= 0) {
                        this.nextScene(this.sceneNumber + 1);
                    }
                }
            }
        }
    }

    onMove(x, y) {
        if (this.sceneNumber === 1 && this.canMove) {

            if (this.sculptFinish < 1) {
                this._layout3d.model3d.playAnim('sculpt');
                this._layout3d.model3d.smooth(x, y, this.sculptFinish);
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
        this._layout3d.model3d.show();
        this.setCam(2, null, null, () => {
            this._layout2d.startHint()
        });
    }

    scene2() {
        this.sceneNumber = 2;
        this.setCam(null, null, 2, () => {
            console.log("zoom")
        })
        this._layout2d._cheers.show(0, Black.stage.centerX - 1, Black.stage.centerY + 1);

        this._layout2d._tutorial.hide();
        this._layout3d._sculpt.head.rotation.set(Math.PI / 2, 0, 0)
        this._layout3d._sculpt.head.visible = true;

        this._layout3d.model3d.hide(this._layout3d.model3d.group);

        this.canMove = false;
        console.log("scene", this.sceneNumber, "sculpting scene");
    }
    scene3() {
        this.sceneNumber = 3;

        this._layout2d._cheers.show(2, Black.stage.centerX + 1, Black.stage.centerY - 1);


        console.log("painting scene implement pls", this.sceneNumber);
    }

    scene4() {
        this.sceneNumber = 4;

        this.canMove = false;
        this._layout3d._initDock("head");
        // this._layout2d._startClayHint(Helpers.vector3ToBlackPosition(this._layout3d.model3d));
        this.numberOfDecorations = this._layout3d.model3d.headDecor.length;

        this._layout2d._cheers.show(1, Black.stage.centerX + 1, Black.stage.centerY - 1);
        console.log("decorating head scene", this.sceneNumber);
    }

    scene5() {
        this.sceneNumber = 5;

        this.canMove = false;
        this._layout3d._initDock("accessories");
        this.numberOfDecorations = this._layout3d.model3d.accessories.length;
        this._layout2d._cheers.show(2, Black.stage.centerX + 1, Black.stage.centerY - 1);
    }

    scene6() {
        this.sceneNumber = 6;
        this._layout3d.hide(this._layout3d.bg)
        this._layout3d.hide(this._layout3d.dock)
        this.setCam(-0.5, 2, -2, () => {
            this._layout2d._confetti.show()
        });
        const standVector = new Vector3(this._layout3d.stand.position.x, this._layout3d.stand.position.y - 1, this._layout3d.stand.position.z)
        this._cameraController.setLookingAt(standVector)

        console.log("celebrate scene", this.sceneNumber);
        setTimeout(() => { this.nextScene(7) }, 5000)
    }

    scene7() {
        this.sceneNumber = 7;
        this._layout3d._initDock("body");
    }

    setCam(setX, setY, setZ, callback) {
        let targetX = setX, targetY = setY, targetZ = setZ;
        const tempCameraPosition = { x: this._camera.threeCamera.position.x, y: this._camera.threeCamera.position.y, z: this._camera.threeCamera.position.z }; // Temporary object to hold camera position
        if (!setX) targetX = this._camera.threeCamera.position.x; else targetX = this._camera.threeCamera.position.x - setX;

        if (!setY) targetY = this._camera.threeCamera.position.y; else targetY = this._camera.threeCamera.position.y - setY;
        if (!setZ) targetZ = this._camera.threeCamera.position.z; else targetZ = this._camera.threeCamera.position.z - setZ;

        const tween = new TWEEN.Tween(tempCameraPosition) // Use the temporary object for tweening
            .to({ x: targetX, y: targetY, z: targetZ }, 400)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this._camera.threeCamera.position.x = tempCameraPosition.x;
                this._camera.threeCamera.position.y = tempCameraPosition.y;

                this._camera.threeCamera.position.z = tempCameraPosition.z;

            })
            .onComplete(() => {
                if (this._camera.threeCamera.position.x == targetX)
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
