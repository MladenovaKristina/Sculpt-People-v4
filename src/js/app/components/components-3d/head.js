import TWEEN from "@tweenjs/tween.js";
import { Group, Cache, AnimationMixer, MeshPhysicalMaterial, Vector3, SphereGeometry, NormalBlending, Mesh } from "three";


export default class Head extends Group {
    constructor(clayMaterial, asset, stand) {
        super();
        this.clayMaterial = clayMaterial;
        this.head = asset;
        this.stand = stand;
        this.headDecor = [];


        this._view = null;
        this._init(this.clayMaterial);

    }
    _init() {
        this.head.traverse((child) => {

            child.visible = false;
            this.headDecor.push(child)

        })
        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y + radius, 0)
        this.head.material = this.clayMaterial;
        this.head.scale.set(10, 10, 10);
        this.add(this.head)
        this.head.visible = false;

    }
}