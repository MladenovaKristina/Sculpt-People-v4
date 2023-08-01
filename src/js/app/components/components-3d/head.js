import TWEEN from "@tweenjs/tween.js";
import { Group, Cache, AnimationMixer, MeshStandardMaterial, DoubleSide } from "three";
import * as THREE from 'three';
import { BlendMode, MessageDispatcher } from "../../../utils/black-engine.module";


export default class Head extends Group {
    constructor(clayMaterial, asset, stand) {
        super();
        this.clayMaterial = clayMaterial;
        this.asset = asset;
        this.stand = stand;
        this.headDecor = [];

        //=============================================
        // EVENTS
        //=============================================
        // this.messageDispatcher = new MessageDispatcher();
        // this.events = {
        //     someEvent: "someEvent",
        // };

        //=============================================
        // PROPERTIES
        //=============================================

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


        //=============================================
        // ELEMENTS
        //=============================================
        this._view = null;
        this._init(this.clayMaterial);

    }
    _init() {
        this.visible = false;
        this.group = new THREE.Group();
        this.add(this.group);

        this.arm = THREE.Cache.get('arm').scene;
        this.arm.scale.set(15, 15, 15);
        this.arm.rotation.set(0.7, 4.8, 0);
        this.arm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })

            if (child.name === "ref_position") {
                this.armposition = child;
                this.arm.position.x = -1;
                this.arm.position.z = 6;
                this.arm.position.y = -4.5;
                this.armposition.visible = false;
            }
        })

        this.group.add(this.arm);

        this.rightArm = THREE.Cache.get('rightArm').scene;
        this.rightArm.scale.set(15, 15, 15);
        const scale = new THREE.Vector3(1, 1, -1)
        this.rightArm.scale.multiply(scale);

        this.rightArm.rotation.set(this.arm.rotation.x, this.arm.rotation.y - 0.3, this.arm.rotation.z);
        this.rightArm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })
            if (child.name === "ref_position") {
                child.visible = false;
            }
        })
        this.rightArm.position.set(-3.5, this.arm.position.y, this.arm.position.z)
        console.log(this.rightArm.position)

        this.group.add(this.rightArm);


        const radius = 1.2;
        const geometry = new THREE.SphereGeometry(radius, 5, 10);
        const fingerprintTexture = THREE.Cache.get('fingerprint');


        this.customMaterial = new THREE.MeshPhongMaterial({
            map: fingerprintTexture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        this.sphere = new THREE.Mesh(geometry, this.clayMaterial)


        this.sphere.position.set(this.stand.position.x, this.stand.position.y + radius / 2, 0)
        this.group.add(this.sphere);


        this.fingerprintSphere = new THREE.Mesh(geometry, this.customMaterial);
        this.fingerprintSphere.position.set(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);

        this.group.add(this.fingerprintSphere);


        this.asset.traverse((child) => {
            if (child.name === "HEAD") {
                this.head = child;

                this.head.traverse((child) => {
                    if (child.name != "HEAD") {
                        child.visible = false;
                        this.headDecor.push(child)
                    }
                })
            }
        })

        this.head.position.set(this.stand.position.x, this.stand.position.y + radius, 0)
        this.head.material = this.clayMaterial;
        this.head.scale.set(10, 10, 10);
        this.add(this.head)
        this.head.visible = false;


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

        this.show();
    }
    show() {
        const targetPosition = 0;

        this.visible = true;
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

    smooth(x, y, sculptFactor) {
        this.sphere.rotation.x -= x / 10000;
        this.sphere.rotation.y += y / 10000;
        this.fingerprintSphere.rotation.x = this.sphere.rotation.x;
        this.fingerprintSphere.rotation.y = this.sphere.rotation.y;

        this.customMaterial.opacity -= sculptFactor / 100;
    }

    hide(object) {
        const target = -5;
        const tween = new TWEEN.Tween(object.position.y)
            .to({ target }, 200)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                object.position.y -= 1 / 10;
                object.position.x -= 3 / 100;
                if (object.position.y <= target) object.visible = false;
            })
            .start();

        if (this.groupTweenRotation.isPlaying && this.groupTweenPosition.isPlaying) {
            this.groupTweenPosition.end();
            this.groupTweenRotation.end();
            this.groupTweenPosition = null;
            this.groupTweenRotation = null;
            this.group.visible = false;
        }
    }



    stopAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();
    }

    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }
}