import { Group, Cache, Mesh, MeshPhysicalMaterial, PlaneGeometry, DoubleSide, SphereGeometry, Vector3, NormalBlending, AnimationMixer } from 'three';
import TWEEN from '@tweenjs/tween.js';
import ConfigurableParams from '../../../data/configurable_params';

export default class Models3D extends Group {
    constructor(stand) {
        super();
        this._asset = Cache.get('assets').scene.children[0];
        this.flipX = new Vector3(-1, 1, 1);
        this.stand = stand;
        this._animations = {
            sculpt: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: Infinity,
                yoyo: true
            }
        }

        this._rightAnimations = {
            sculpt: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: Infinity,
                yoyo: true
            }
        }
        this.init()
    }
    init() {
        this._initAssets();
        this._initSprayCan()
        this._initView();
    }

    _initTexture(clayMaterial) {
        this.clayMaterial = clayMaterial;

        this.head.traverse((child) => {
            if (child.name === "ears" || child.name === "EARS" || child.name === "ear_l" || child.name === "ear_r") {
                child.material = this.clayMaterial;
            }

        })

        this.sphere.material = this.clayMaterial;

    }

    _initSprayCan() {
        this.sprayCanGroup = Cache.get("sprayCan").scene;
        this.sprayCanGroup.traverse((child) => {
            if (child.name === "spray_can_type4") {
                child.visible = true;
                this.sprayCan = child;
                // this.sprayCan.scale.set(1, 1, 1);
                this.sprayCan.position.set(0, 1, 0.5);
                this.sprayCan.rotation.set(Math.PI / 2, 0, Math.PI);
                this.sprayCan.visible = true;
                this.sprayCan.traverse((cap) => {
                    if (child.name === "can_tip_whole") {
                        this.canTip = cap; this.paintEmitter()
                    }
                })
            }
        });

        this.add(this.sprayCan);
    }
    _initAssets() {
        this.add(this._asset)
        const selectedCharacter = ConfigurableParams.getData()['character']['select_character']['value'];
        const characterMappings = {
            Big: { bodyName: 'b_big1', headName: 'h_bride' },
            Bride: { bodyName: 'b_bride1', headName: 'h_bride' },
            Harley: { bodyName: 'b_harley1', headName: 'h_harley' },
            Tuxedo: { bodyName: 'b_tuxedo2', headName: 'h_tuxedo' }
        };

        this.accessories = [];
        this.headParts = [];
        this.bodies3d = [];
        this.bodies2d = [];

        this._asset.traverse((child) => {
            child.receiveShadow = true;
            child.castShadow = true;

            if (child.material) child.material.side = DoubleSide;

            if (child.name === "Armature") {
                child.visible = false;
                this.armature = child;

            }
            if (child.name === "Heads") { this.heads = child; }
        })
        const scaledown = new Vector3(0.8, 0.8, 0.8)
        this.armature.traverse((bodies) => {
            bodies.position.set(0, -0.38, 0);
            bodies.scale.multiply(scaledown)
            bodies.rotation.set(0, 0, 0)
            bodies.visible = false;

            if (bodies.name.includes("b_")) {
                this.bodies3d.push(bodies)
            }
        })

        this.heads.traverse((head) => {
            if (head.name == "glasses" ||
                head.name == "veil" ||
                head.name == "spiderman" ||
                head.name == "moustache") {
                head.visible = false;
                head.rotation.set(Math.PI / 2, 0, 0);
                this.accessories.push(head)
            }
            const mapping = characterMappings[selectedCharacter];

            if (mapping && head.name === mapping.headName) {
                this.head = head;

            } else if (head.name.includes("h_"))
                head.visible = false;
        })


        this.initHeadParts()
    }

    initHeadParts() {
        this.head.traverse((child) => {
            const childName = child.name.toLowerCase();
            child.visible = false;
            if (!childName.includes("mask") && childName != this.head.name) {
                if (childName.includes("ring") || childName.includes("ear") || childName.includes("eye")) {

                    const child_r = child.clone();
                    child_r.name += "_r";
                    child_r.scale.multiply(this.flipX);
                    child_r.position.multiply(this.flipX);
                    this.head.add(child_r)

                    child.name += "_l";
                    this.headParts.push(child);
                    this.headParts.push(child_r);
                }
                else
                    this.headParts.push(child);
            } else if (childName.includes("mask")) {
                this.mask = child;
                this.mask.material = new MeshPhysicalMaterial({ color: 0xffffff })
            }

        });

        this.head.children = this.head.children.concat(...this.accessories)
    }

    _initView() {
        this.group = new Group();
        this.add(this.group);

        this.arm = Cache.get("arm").scene;
        this.arm.scale.set(1, 1, 1);
        this.arm.rotation.set(0, -Math.PI / 2, -0.5);
        this.arm.traverse((child) => {
            child.material = new MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })

            if (child.name === "ref_position") {
                child.visible = false;
            }
        });
        this.group.position.set(0, -0.22, 0.65)

        this.group.add(this.arm);

        this.rightArm = Cache.get('rightArm').scene;
        this.rightArm.scale.set(1, 1, 1);
        const scale = new Vector3(1, 1, -1)
        this.rightArm.scale.multiply(scale);

        this.rightArm.rotation.copy(this.arm.rotation);
        this.rightArm.traverse((child) => {
            child.material = new MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
            if (child.name === "ref_position") {
                child.visible = true;
                this.sphere = child;
                this.fingerprintSphere = new Mesh(this.sphere.geometry, this.customMaterial)

            }
        })
        this.rightArm.position.copy(this.arm.position)

        this.group.add(this.rightArm);


        const radius = 1.2;
        const geometry = new SphereGeometry(radius, 10, 20);
        const fingerprintTexture = Cache.get('fingerprint');

        this.customMaterial = new MeshPhysicalMaterial({
            map: fingerprintTexture,
            blending: NormalBlending,
            transparent: true,
            opacity: 0.4
        });

        const animationsNames = ["sculpt"];

        for (let index = 0; index < animationsNames.length; index++) {
            const animName = animationsNames[index];
            const anim = Cache.get('arm').animations[index];
            this._animations[animName].duration = anim.duration;
            this._animations[animName].mixer = new AnimationMixer(this.arm);
            this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);

            this._rightAnimations[animName].duration = anim.duration;
            this._rightAnimations[animName].mixer = new AnimationMixer(this.rightArm);
            this._rightAnimations[animName].action = this._rightAnimations[animName].mixer.clipAction(anim);
        }

    }

    show() {
        this.visible = true;

        const targetPosition = 0;

        const duration = 1000;
        this.group.position.x = -5;

        const tween = new TWEEN.Tween(this.group.position.y)
            .to({ targetPosition }, duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                this.group.position.x += 0.1;

                if (this.group.position.x >= targetPosition) {
                    this.group.position.x = targetPosition;

                }
            })
            .onComplete(() => {
                this.idle();
            })

            .start();
    }

    idle() {
        const duration = 1000;
        const amplitude = 0.01;
        const frequency = 2;
        this.groupTweenRotation = new TWEEN.Tween(this.group.rotation)
            .to(
                {
                    x: this.group.rotation.x + amplitude,
                    y: this.group.rotation.y - amplitude,
                },
                duration * 2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * frequency) * amplitude;
                this.group.rotation.x = this.group.rotation.x + angle * 2;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.groupTweenPosition = new TWEEN.Tween(this.group.position)
            .to(
                {
                    x: this.group.position.x - amplitude * 2,
                },
                duration * 1.3
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;

                if (time >= duration / 2) {
                    this.groupTweenPosition = new TWEEN.Tween(this.group.position.y)
                        .to(
                            {
                                y: this.group.position.y - amplitude
                            },
                            duration * 1.2
                        ).easing(TWEEN.Easing.Sinusoidal.InOut)
                }
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();
        const animate = () => {
            this.groupTweenPosition.update();
            this.groupTweenRotation.update();

            requestAnimationFrame(animate);
        };

        animate();
    }

    playAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

        this._animations[name].action.play();
        this._rightAnimations[name].action.play();

        if (!this._animations[name].currentTime) {
            this._animations[name].currentTime = 0;
        }

        this._animations[name].currentTime += 0.01;
        if (this._animations[name].currentTime >= this._animations[name].duration) {
            this._animations[name].currentTime = 0
        }

        this._animations[name].mixer.setTime(this._animations[name].currentTime);
        this._rightAnimations[name].mixer.setTime(-this._animations[name].currentTime);

    }

    smooth() {
        this.fingerprintSphere.material.opacity -= 0.01;
    }

    hide(object) {
        const target = -5;
        const tween = new TWEEN.Tween(object.position.y)
            .to({ target }, 200)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                object.position.y -= 3 / 10;
                object.position.x -= 5 / 100;
                if (object.position.y <= target) object.visible = false;
            })
            .onComplete(() => {
                object.visible = false;
            })
            .start();
    }

    stopAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

        if (this.groupTweenRotation && this.groupTweenPosition) {
            this.groupTweenPosition.end();
            this.groupTweenRotation.end();
            this.groupTweenPosition = null;
            this.groupTweenRotation = null;
            this.group.visible = false;
        }
    }

    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }

    placeMask(callback) {
        this.mask.visible = true;
        const targetpos = new Vector3(0, 0.01, 0);
        const targetrotation = new Vector3(0, 0, 0);
        this.mask.position.set(-1, 1, 1);
        this.mask.rotation.z += 0.3;
        this.mask.rotation.x = -Math.PI / 2;

        const tween = new TWEEN.Tween(this.mask.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)

            .delay(200)
            .start();
        const rotatetween = new TWEEN.Tween(this.mask.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)
            .onUpdate(() => {
                if (this.mask.rotation === targetrotation) {
                    callback();
                }
            })

            .start();
    }

    removeMask() {
        const targetpos = new Vector3(-4, 4, 10);
        const targetrotation = new Vector3(0, 0, 0);


        const tween = new TWEEN.Tween(this.mask.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)

            .start();

        const rotatetween = new TWEEN.Tween(this.mask.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(200)

            .start();
    }

    paintEmitter() {
        this.paintEmitted = [];

        for (let i = 0; i < 4; i++) {
            const planegeometry = new PlaneGeometry(1, 1, 10, 10);
            const material = new MeshPhysicalMaterial({ color: 0xffffff });
            const paint = new Mesh(planegeometry, material);
            paint.position.copy(this.canTip.position); // Copy the position of the paint can tip
            this.paintEmitted.push(paint);
        }
        this.add(this.paintEmitted);
    }

    emitPaint() {
        if (!this.paintEmitted) {
            console.error("Paint particles not initialized. Call paintEmitter() first.");
            return;
        }

        const sprayDuration = 200; // Adjust as needed
        const sprayDistance = 2;   // Adjust as needed

        for (let i = 0; i < this.paintEmitted.length; i++) {
            const paint = this.paintEmitted[i];
            const targetPosition = new Vector3(this.head.position.x, this.head.position.y, this.head.position.z + sprayDistance);

            const tween = new TWEEN.Tween(paint.position)
                .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, sprayDuration)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            tween.onComplete(() => {
                // Reset the position after emitting paint
                paint.position.copy(this.canTip.position);
            });
        }
    }
}

