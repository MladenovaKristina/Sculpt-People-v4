import { Group } from "three";


export default class Head extends Group {
    constructor(clayMaterial, head, stand) {
        super();
        this.clayMaterial = clayMaterial;

        this.head = head;
        this.stand = stand;


        this._view = null;
        this._init();
    }
    _init() {
        this.headParts = new Group();

        const scale = 10;
        this.head.scale.set(scale, scale, scale);
        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y - radius / 2, 0)

        this.head.parent.traverse((child) => {
            child.rotation.set(0, 0, 0)
        })

        this.head.material = this.clayMaterial;
        this.add(this.head)
        this.head.visible = false;
    }
}