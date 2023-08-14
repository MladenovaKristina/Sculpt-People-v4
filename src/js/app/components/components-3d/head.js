import { call } from "file-loader";
import { Group, Cache, NormalBlending, MeshPhysicalMaterial, Mesh, CylinderGeometry } from "three";

export default class Head extends Group {
    constructor(clayMaterial, head, stand) {
        super();
        this.clayMaterial = clayMaterial;

        this.head = head;
        this.stand = stand;

        this.headParts = new Group();
        this._init();
    }

    _init() {
        this._initStick();
        const scale = 10;
        this.head.scale.set(scale, scale, scale);
        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y - radius / 2, 0);
        this.head.visible = false;
        this.head.material = this.clayMaterial;
        this.add(this.head);

        // Create a new geometry based on the head's geometry
        this.modifiedGeometry = this._modifyGeometry(this.head.geometry.clone());
        this.originalGeometry = this.head.geometry.clone(); // Store the original geometry

        this.customMaterial = new MeshPhysicalMaterial({
            map: Cache.get('fingerprint'),
            color: this.clayMaterial.color,
            blending: NormalBlending,
            transparent: true,
            opacity: 1
        });

        this.modifiedMesh = new Mesh(this.modifiedGeometry, this.customMaterial);
        this.modifiedMesh.position.copy(this.head.position);
        this.modifiedMesh.scale.copy(this.head.scale);
        this.modifiedMesh.rotation.copy(this.head.rotation);

        this.add(this.modifiedMesh);
        this.modifiedMesh.visible = false;
    }

    _modifyGeometry(originalGeometry) {
        const modifiedGeometry = originalGeometry.clone();

        const vertices = modifiedGeometry.attributes.position.array;
        const vertexCount = vertices.length / 3;

        for (let i = 0; i < vertexCount; i++) {
            const vertexIndex = i * 3;
            const y = vertices[vertexIndex + 1];
            const z = vertices[vertexIndex + 2];

            const bulgeAmount = Math.sin(y * Math.PI) * 0.2;
            vertices[vertexIndex + 2] = z + bulgeAmount;
        }

        modifiedGeometry.attributes.position.needsUpdate = true;

        return modifiedGeometry;
    }
    _initStick() {
        const geom = new CylinderGeometry(0.05, 0.13, 5, 10, 10);
        const mat = new MeshPhysicalMaterial({ color: 0x964B00 });
        this.stick = new Mesh(geom, mat);
        this.stick.position.copy(this.stand.position);
        this.stick.visible = false;
        this.add(this.stick);
    }

    headDone() {
        this.head.visible = true;
        this.modifiedMesh.visible = false;
    }

    onMove(x, y, callback) {
        console.log(x, y,)
        if (callback) callback();
    }

    graduallyRevertToOriginal(callback) {
        const incrementAmount = 0.01; // Adjust this value to control the speed of the transition
        const threshold = 0.001; // Adjust this value to set the threshold for "almost the same"

        let allPositionsAlmostSame = true;

        for (let i = 0; i < this.modifiedGeometry.attributes.position.array.length; i += 3) {
            const diffX = this.originalGeometry.attributes.position.array[i] - this.modifiedGeometry.attributes.position.array[i];
            const diffY = this.originalGeometry.attributes.position.array[i + 1] - this.modifiedGeometry.attributes.position.array[i + 1];
            const diffZ = this.originalGeometry.attributes.position.array[i + 2] - this.modifiedGeometry.attributes.position.array[i + 2];

            this.modifiedGeometry.attributes.position.array[i] += diffX * incrementAmount;
            this.modifiedGeometry.attributes.position.array[i + 1] += diffY * incrementAmount;
            this.modifiedGeometry.attributes.position.array[i + 2] += diffZ * incrementAmount;

            if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold || Math.abs(diffZ) > threshold) {
                allPositionsAlmostSame = false;
            }
        }

        this.modifiedGeometry.attributes.position.needsUpdate = true;

        if (allPositionsAlmostSame && callback) {
            callback()
        }


    }
}