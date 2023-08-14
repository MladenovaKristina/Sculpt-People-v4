import { Group, Cache, Mesh, MeshPhysicalMaterial, PlaneGeometry, DoubleSide, SphereGeometry, Vector3, NormalBlending, AnimationMixer } from 'three';
import TWEEN from '@tweenjs/tween.js';
import ConfigurableParams from '../../../data/configurable_params';

export default class Models3D extends Group {
    constructor(stand) {
        super();
        this.asset = Cache.get('assets').scene;
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
        this.asset.traverse((child) => {
            if (child.name === "ears" || child.name === "EARS" || child.name === "ear_l" || child.name === "ear_r") {
                child.material = clayMaterial;
            }
        })
        this.init()
    }

    _initAssets() {
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

        this.asset.traverse((child) => {

            const mapping = characterMappings[selectedCharacter];
            if (mapping && child.name === mapping.bodyName) {
                this.body = child;
            }
            if (mapping && child.name === mapping.headName) {
                this.head = child;

                this.head.traverse((child) => {
                    child.visible = false;
                    let childName = child.name.toLowerCase();
                    if (!childName.includes("h_")) {

                        if (childName.includes("ear") || childName.includes("eye")) {
                            const child_l = child.clone();
                            child_l.name += "_l";
                            const child_r = child.clone();
                            child_r.name += "_r";
                            child_r.scale.multiply(this.flipX);
                            child_r.position.multiply(this.flipX);

                            this.head.add(child_l)
                            this.head.add(child_r)

                            this.headParts.push(child_l);
                            this.headParts.push(child_r);
                        } else
                            this.headParts.push(child);
                    }
                })

                this.head.children = this.headParts;


            }

            if (child.name.includes("b_")) {

                this.bodies3d.push(child)
            }


            if (child.name == "glasses" ||
                child.name == "veil" ||
                child.name == "spiderman" ||
                child.name == "moustache") {
                child.visible = false;
                this.accessories.push(child)
            }
        });
    }

    pushtoHead(head) {
        for (let i = 0; i < this.accessories.length; i++) {

            const accessory = this.accessories[i];

            this.head.add(accessory)
        }
    }

    pushtoStand() {
        for (let i = 0; i < this.bodies3d.length; i++) {
            const child = this.bodies3d[i];
            const geometry = new PlaneGeometry(1, 1);
            const material = new MeshPhysicalMaterial({ color: 0xffff00, side: DoubleSide });
            const plane = new Mesh(geometry, material);
            plane.position.set(0, 0, 0);

            plane.name = child.name;
            this.bodies2d.push(plane);
            child.visible = false;
            this.head.add(child);
        }
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
                this.arm.position.x = -1;
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
        this.rightArm.position.set(-3.5, this.arm.position.y, this.arm.position.z)

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

    smooth(x, y, sculptFactor) {
        // this.sphere.rotation.x -= x / 10000;
        // this.sphere.rotation.y += y / 10000;
        // this.fingerprintSphere.rotation.x = this.sphere.rotation.x;
        // this.fingerprintSphere.rotation.y = this.sphere.rotation.y;

        // Calculate the new scale based on sculptFactor
        const scaleAmountX = 1 - sculptFactor * 0.1; // Adjust the factor for oval effect
        const scaleAmountY = 1 + sculptFactor * 0.3; // Adjust the factor for oval effect

        this.sphere.scale.set(scaleAmountX, scaleAmountY, 1);
        this.fingerprintSphere.scale.copy(this.sphere.scale);

        this.customMaterial.opacity -= sculptFactor / 100;
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
}


