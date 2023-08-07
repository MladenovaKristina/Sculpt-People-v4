import { Group } from "three";
import Models3D from "./3d-models";


export default class Head extends Group {
    constructor(clayMaterial, head, stand) {
        super();
        this.clayMaterial = clayMaterial;

        this.head = head;
        this.stand = stand;

        console.log("this.head:", this.head);
        console.log("this.clayMaterial:", this.clayMaterial);
        console.log("this.stand:", this.stand);

        this._view = null;
        this._init();
    }
    _init() {
        this.headDecor = new Group();

        const scale = 15;
        console.log(this.head)
        this.head.scale.set(scale, scale, scale);


        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y - radius / 2, 0)
        this.head.material = this.clayMaterial;
        this.add(this.head)
        this.head.visible = false;

    }
}