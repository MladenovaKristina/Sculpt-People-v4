import { Group, Cache, NormalBlending, MeshPhysicalMaterial, Mesh, MeshStandardMaterial } from "three";

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
        const scale = 10;
        this.head.scale.set(scale, scale, scale);
        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y - radius / 2, 0);

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