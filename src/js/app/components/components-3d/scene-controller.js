
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
        this.animating = false;
    }

    onDown(x, y) {
        if (!this.animating) {
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
                // this.nextScene(4)
                this._layout2d.selectSpray(x, y, () => {
                    this.nextScene(4)
                });
            }
            if (this.sceneNumber === 4) {
                this.clickToEquip(x, y)
            }

            if (this.sceneNumber === 5) {
                this.clickToEquip(x, y)

            }

            if (this.sceneNumber === 7) {
                this.clickToEquip(x, y)
            }
            if (this.sceneNumber === 8) {
                this.nextScene(9)
            }
        }
    }

    getClayAtPosition(x, y, callback) {
        const raycaster = new Raycaster();
        const mouse = new Vector2();

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

    }



    nextScene(scene) {
        const sceneFunctions = [
            this.scene0.bind(this),
            this.scene1.bind(this),
            this.scene2.bind(this),
            this.scene3.bind(this),
            this.scene4.bind(this),
            this.scene5.bind(this),
            this.scene6.bind(this),
            this.scene7.bind(this),
            this.scene8.bind(this),
            this.scene9.bind(this)

        ];

        if (scene >= 0 && scene < sceneFunctions.length) {
            this.sceneNumber = scene;
            sceneFunctions[scene]();
        } else { console.log("no scene"); return; }
    }

    clickToEquip(x, y) {
        if (this.canMove) {
            const raycaster = new Raycaster();
            const mouse = new Vector2();

            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this._camera.threeCamera);

            const intersects = raycaster.intersectObjects(this._layout3d.dock.children, true);
            console.log(intersects);

            if (intersects.length > 0) {
                const selectedDecoration = intersects[0].object;
                let headGroup, elementInHead;

                headGroup = this._layout3d.model3d.head;

                elementInHead = headGroup.getObjectByName(selectedDecoration.name);
                console.log(selectedDecoration, "from", elementInHead)

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
        this._layout2d._cheers.show(2, Black.stage.centerX + 1, Black.stage.centerY - 1);


        console.log("painting scene implement pls", this.sceneNumber);
        this._layout2d._initDockBG("spray", () => { this.sceneNumber = 3; });

    }

    scene4() {
        this.sceneNumber = 4;

        this.canMove = false;

        this._layout2d.hide(this._layout2d._bg);
        this._layout3d._initDock("head");

        this.numberOfDecorations = this._layout3d.model3d.headParts.length;

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
        setTimeout(() => { this.scene7() }, 3000)


    }

    scene7() {
        console.log('7')
        this.sceneNumber = 7;
        this._layout3d.body();
        this.numberOfDecorations = 1;

    }

    scene8() {
        this._layout3d.hide(this._layout3d.bg)
        this._layout3d.hide(this._layout3d.dock)
        console.log('8, moving body')
        this.sceneNumber = 8;
    }
    scene9() {
        this.sceneNumber = 9;
        this._layout2d._confetti.show();
        this._layout2d._confetti.show();

    }
    setCam(setX, setY, setZ, callback) {
        this.animating = true;
        let targetX = setX, targetY = setY, targetZ = setZ;
        const tempCameraPosition = { x: this._camera.threeCamera.position.x, y: this._camera.threeCamera.position.y, z: this._camera.threeCamera.position.z }; // Temporary object to hold camera position
        if (!setX) targetX = this._camera.threeCamera.position.x; else targetX = this._camera.threeCamera.position.x - setX;

        if (!setY) targetY = this._camera.threeCamera.position.y; else targetY = this._camera.threeCamera.position.y - setY;
        if (!setZ) targetZ = this._camera.threeCamera.position.z; else targetZ = this._camera.threeCamera.position.z - setZ;

        const tween = new TWEEN.Tween(tempCameraPosition)
            .to({ x: targetX, y: targetY, z: targetZ }, 400)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(300)
            .onUpdate(() => {
                this._camera.threeCamera.position.x = tempCameraPosition.x;
                this._camera.threeCamera.position.y = tempCameraPosition.y;
                this._camera.threeCamera.position.z = tempCameraPosition.z;
            })
            .onComplete(() => {
                if (this._camera.threeCamera.position.x == targetX) {
                    callback();
                    this.animating = false;
                }
            })
            .start();

        this.animate();
    }

    animate() {
        TWEEN.update();
        requestAnimationFrame(() => this.animate());
    }
}
