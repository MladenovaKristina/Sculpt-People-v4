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


        //=============================================
        // ELEMENTS
        //=============================================
        this._view = null;
        this._init(this.clayMaterial);

    }
    _init() {

        //=============================================
        // INIT OBJ
        //=============================================

        this.arm = THREE.Cache.get('arm').scene;
        this.arm.scale.set(15, 15, 15);
        this.arm.rotation.set(0.6, 4.5, 0);
        this.arm.traverse((child) => {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0xe5c59a, metalness: 0.2, reflectivity: 1 })

            if (child.name === "ref_position") {
                this.armposition = child;
                this.arm.position.x = -4.2 - this.armposition.position.x;
                this.arm.position.z = 7 + this.armposition.position.z;
                this.arm.position.y = -4 - this.armposition.position.y;
                this.armposition.visible = false;
            }
        })

        this.add(this.arm);

        const radius = 1;
        const geometry = new THREE.SphereGeometry(radius, 5, 5);
        const fingerprintTexture = THREE.Cache.get('fingerprint');


        this.customMaterial = new THREE.MeshPhongMaterial({
            map: fingerprintTexture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        this.sphere = new THREE.Mesh(geometry, this.clayMaterial)


        this.sphere.position.set(this.stand.position.x, this.stand.position.y + radius / 2, 0)
        this.add(this.sphere);


        this.fingerprintSphere = new THREE.Mesh(geometry, this.customMaterial);
        this.fingerprintSphere.position.set(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);

        this.add(this.fingerprintSphere);


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

        console.log(this.headDecor)
        this.head.position.set(this.stand.position.x, this.stand.position.y + radius, 0)
        this.head.material = this.clayMaterial;
        this.head.scale.set(10, 10, 10)
        this.add(this.head)
        this.head.visible = false;


        //=============================================
        // INIT ANIMATIONs
        //=============================================
        let animationsNames = ["sculpt"];
        const view = this.arm;
        for (let index = 0; index < animationsNames.length; index++) {

            let animName = animationsNames[index];

            let anim = Cache.get('arm').animations[index];
            this._animations[animName].duration = anim.duration;
            this._animations[animName].mixer = new AnimationMixer(view);
            this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);

        }

    }
    //==========================================================================================
    // PLAY ANIMATION
    //==========================================================================================
    playAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

        this._animations[name].action.play();

        if (!this._animations[name].currentTime) {
            this._animations[name].currentTime = 0;
        }

        this._animations[name].currentTime += 0.01;
        if (this._animations[name].currentTime >= this._animations[name].duration) {
            this._animations[name].currentTime = 0
        }


        this._animations[name].mixer.setTime(this._animations[name].currentTime);
    }

    smooth(x, y) {
        this.sphere.rotation.x -= x / 10000;
        this.sphere.rotation.y += y / 10000;
        this.fingerprintSphere.rotation.x = this.sphere.rotation.x;
        this.fingerprintSphere.rotation.y = this.sphere.rotation.y;

        this.customMaterial.opacity -= 0.01;
    }

    hide(object) {
        object.visible = false;
    }


    //==========================================================================================
    // STOP ANIMATION
    //==========================================================================================
    stopAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();
    }
    //==========================================================================================
    // CHANGE ANIMATION
    //==========================================================================================
    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }
}