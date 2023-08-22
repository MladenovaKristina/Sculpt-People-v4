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
    }
    init() {
        this._initAssets();
        this._initView();
    }

    _initTexture(clayMaterial) {
        this.clayMaterial = clayMaterial;
        this._asset.traverse((child) => {
            if (child.name === "ears" || child.name === "EARS" || child.name === "ear_l" || child.name === "ear_r") {
                child.material = clayMaterial;
            }
        })
        this.init()
    }



    pushtoHead(head) {
        for (let i = 0; i < this.accessories.length; i++) {

            const accessory = this.accessories[i];
            if (accessory.name == "glasses" || accessory.name == "moustache")
                accessory.position.z += 0.2;
            this.head.add(accessory)
        }
    }

    pushtoStand() {
        //         for (let i = 0; i < this.bodies3d.length; i++) {
        //             const child = this.bodies3d[i];
        //             const geometry = new PlaneGeometry(1, 1);
        //             const material = new MeshPhysicalMaterial({ color: 0xffff00, side: DoubleSide });
        //             const plane = new Mesh(geometry, material);
        //             plane.position.set(0, 0, 0);
        // 
        //             plane.name = child.name;
        //             this.bodies2d.push(plane);
        //             child.visible = false;
        //             this.head.add(child);
    }

    _initView() {
        this.group = new Group();
        this.add(this.group);

        this.arm = Cache.get("arm").scene;
        this.arm.scale.set(15, 15, 15);
        this.arm.rotation.set(0.7, 4.8, 0);
        this.arm.traverse((child) => {
            child.material = new MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })

            if (child.name === "ref_position") {
                this.armposition = child;
                this.arm.position.x = 1;
                this.arm.position.z = 6;
                this.arm.position.y = -4.5;
                this.armposition.visible = false;
            }
        });

        this.group.add(this.arm);

        this.rightArm = Cache.get('rightArm').scene;
        this.rightArm.scale.set(15, 15, 15);
        const scale = new Vector3(1, 1, -1)
        this.rightArm.scale.multiply(scale);

        this.rightArm.rotation.set(this.arm.rotation.x, this.arm.rotation.y - 0.3, this.arm.rotation.z);
        this.rightArm.traverse((child) => {
            child.material = new MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
            if (child.name === "ref_position") {
                child.visible = false;
            }
        })
        this.rightArm.position.set(-1.5, this.arm.position.y, this.arm.position.z)

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

        this.sphere = new Mesh(geometry, this.clayMaterial)

        this.sphere.position.set(this.stand.position.x, this.stand.position.y + radius / 2, 0)
        this.group.add(this.sphere);
        this.fingerprintSphere = new Mesh(geometry, this.customMaterial);
        this.fingerprintSphere.position.set(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);

        this.group.add(this.fingerprintSphere);


        //=============================================
        // INIT ANIMATIONs
        //=============================================
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
        const amplitude = 0.1;
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

    placeMask() {
        this.mask.visible = true;
        const targetpos = new Vector3(this.head.position.x, this.head.position.y, this.head.position.z + 0.3);
        const targetrotation = new Vector3(Math.PI / 2, 0, 0);
        this.mask.position.set(-7, 4, 4);
        this.mask.rotation.z += 0.3;
        const tween = new TWEEN.Tween(this.mask.position)
            .to({ x: targetpos.x, y: targetpos.y, z: targetpos.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(200)
            .start();
        const rotatetween = new TWEEN.Tween(this.mask.rotation)
            .to({ x: targetrotation.x, y: targetrotation.y, z: targetrotation.z }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .delay(800)
            .onComplete(() => {
                if (this.mask.rotation === targetrotation) callback()

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



}
