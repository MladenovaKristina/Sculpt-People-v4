import { call } from "file-loader";
import { Group, Cache, Sphere, NormalBlending, Raycaster, MeshPhysicalMaterial, Vector3, SphereGeometry, Mesh, CylinderGeometry } from "three";

export default class Head extends Group {
    constructor(clayMaterial, head, stand) {
        super();
        this.clayMaterial = clayMaterial;

        this.head = head;
        this.stand = stand;
        this.count = 0;
        this.states = 0;
        this.headParts = new Group();
        this._init();
    }

    _init() {
        this._initStick();
        this._createAimPoints();
        const scale = 10;
        this.head.scale.set(scale, scale, scale);
        const radius = 1.2;

        this.head.position.set(this.stand.position.x, this.stand.position.y - radius / 2, 0);
        this.head.visible = false;
        this.head.material = this.clayMaterial;
        this.add(this.head);

        // Create a new geometry based on the head's geometry
        this.originalGeometry = this.head.geometry.clone(); // Store the original geometry    
        this.halfSculptedHeadGeometry = this._halfsculptHead(this.head.geometry.clone());

        this.modifiedGeometry = this._modifyGeometry(this.halfSculptedHeadGeometry.clone());

        this.customMaterial = new MeshPhysicalMaterial({
            map: Cache.get('fingerprint'),
            color: this.clayMaterial.color,
            blending: NormalBlending,
            transparent: true,
            opacity: 1
        });

        this.halfSculptedHead = new Mesh(this.modifiedGeometry, this.customMaterial);
        this.halfSculptedHead.position.copy(this.head.position);
        this.halfSculptedHead.scale.copy(this.head.scale);
        this.halfSculptedHead.rotation.copy(this.head.rotation);

        this.add(this.halfSculptedHead);

        this.modifiedMesh = new Mesh(this.modifiedGeometry, this.customMaterial);
        this.modifiedMesh.position.copy(this.head.position);
        this.modifiedMesh.scale.copy(this.head.scale);
        this.modifiedMesh.rotation.copy(this.head.rotation);

        this.add(this.modifiedMesh);

        this.halfSculptedHead.visible = false;
        this.modifiedMesh.visible = false;
    }

    _createAimPoints() {
        const aimPointsData = {
            rEye: new Vector3(this.stand.position.x - 0.37, 0.3, 1.3),
            lEye: new Vector3(this.stand.position.x + 0.34, 0.3, 1.3),
            nose: new Vector3(this.stand.position.x, 0, 1.6),
            mouth: new Vector3(this.stand.position.x, -0.4, 1.35),
            face: new Vector3(this.stand.position.x, 0.7, 1.3)
        };
        this.points = new Group();
        const geo = new SphereGeometry(0.3, 32, 32);

        for (let key in aimPointsData) {
            const p = aimPointsData[key];

            const point = new Mesh(geo);
            point.position.x = p.x;
            point.position.y = p.y;
            point.position.z = p.z;
            point.visible = false;
            this.points.add(point)
        }
        this.add(this.points)

        this._aimPoints = aimPointsData;

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

    _halfsculptHead(originalGeometry, amplitude = 0.007, frequency = 2.0) {
        const halfSculptedHeadGeometry = originalGeometry.clone();

        const vertices = halfSculptedHeadGeometry.attributes.position.array;
        const vertexCount = vertices.length / 3;

        for (let i = 0; i < vertexCount; i++) {
            const xOffset = (Math.random() - 0.3) * amplitude;
            const yOffset = (Math.random() - 0.3) * amplitude;
            const zOffset = (Math.random() - 0.3) * amplitude;

            vertices[i * 3] += xOffset;
            vertices[i * 3 + 1] += yOffset;
            vertices[i * 3 + 2] += zOffset;
        }

        halfSculptedHeadGeometry.attributes.position.needsUpdate = true;

        return halfSculptedHeadGeometry;
    }


    _initStick() {
        const height = 7;
        const geom = new CylinderGeometry(0.05, 0.13, height, 10, 10);
        const mat = new MeshPhysicalMaterial({ color: 0x964B00 });
        this.stick = new Mesh(geom, mat);
        this.stick.geometry.translate(0, -height / 2, 0)
        this.stick.position.copy(this.stand.position);
        this.stick.rotation.set(0, 0, 0)
        this.stick.visible = false;
        this.add(this.stick);
    }

    headDone() {
        this.head.visible = true;
        this.halfSculptedHead.visible = false;
    }

    onMove(x, y, callback) {
        this.graduallyRevertToOriginal()
        this.rotateStick(x, y, () => {
            if (callback) callback();
        })
    }

    rotateStick(x, y, callback) {
        this.states += 0.01;
        this.stick.rotation.x = Math.PI / 2 - x / 100;
        this.stick.rotation.y = Math.PI / 2 - y / 100;
        this.stick.rotation.z = Math.PI / 2 - x / 1000;
        this.stick.position.copy(this.points.children[this.count].position);

        if (this.states >= 2.0) {
            this.states -= 2.0;
            if (this.count < this.points.children.length - 1) {
                this.stick.position.copy(this.points.children[this.count].position);
                this.count++;
            }

            else {
                if (callback) {
                    callback();
                }
            }
        }
    }



    graduallyTurnToSculpt(callback) {
        const incrementAmount = 0.01; // Adjust this value to control the speed of the transition
        const threshold = 0.001; // Adjust this value to set the threshold for "almost the same"
        let allPositionsAlmostSame = true;

        for (let i = 0; i < this.modifiedGeometry.attributes.position.array.length; i += 3) {
            const diffX = this.halfSculptedHeadGeometry.attributes.position.array[i] - this.modifiedGeometry.attributes.position.array[i];
            const diffY = this.halfSculptedHeadGeometry.attributes.position.array[i + 1] - this.modifiedGeometry.attributes.position.array[i + 1];
            const diffZ = this.halfSculptedHeadGeometry.attributes.position.array[i + 2] - this.modifiedGeometry.attributes.position.array[i + 2];

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

    graduallyRevertToOriginal(callback) {
        console.log("graduallyRevertToOriginal");

        const incrementAmount = 0.01; // Adjust this value to control the speed of the transition
        let threshold = 0.001; // Initial threshold value

        // Cast a ray from the aim point towards the modified geometry
        const aimPoint = this.points.children[this.count].position.clone();
        const raycaster = new Raycaster(aimPoint, aimPoint.clone().normalize());
        const intersects = raycaster.intersectObject(this.modifiedMesh);

        // Adjust the threshold based on intersection result
        if (intersects.length > 0) {
            threshold = 0.0001; // Smaller threshold when intersecting
        } else {
            threshold = 0.01; // Larger threshold when not intersecting
        }

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
            callback();
        }
    }



}