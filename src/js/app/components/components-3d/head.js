import TWEEN from "@tweenjs/tween.js";
import { Group, Cache, AnimationMixer, MeshPhysicalMaterial, Vector3, SphereGeometry, NormalBlending, Mesh } from "three";


export default class Head extends Group {
    constructor(clayMaterial, asset, stand) {
        super();
        this.clayMaterial = clayMaterial;
        this.head = asset;
        this.stand = stand;
        this.headDecor = new Group();


        this._view = null;
        this._init();
    }
    _init() {
        const scale = 0.4;
        this.head.scale.set(scale, scale, scale);
        for (let i = 0; i < this.head.children.length; i++) {
            this.headDecor.add(this.head.children[i])
        }
        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y + radius, 0)
        this.head.material = this.clayMaterial;
        this.add(this.head)
        this.head.visible = false;

    }
}