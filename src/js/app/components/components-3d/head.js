import { call } from "file-loader";
import { Group, Cache, Sphere, NormalBlending, Raycaster, MeshPhysicalMaterial, Vector3, SphereGeometry, Mesh, CylinderGeometry } from "three";

export default class Head extends Group {
    constructor(clayMaterial, head, sphere, stand) {
        super();
        this.clayMaterial = clayMaterial;
        this.sphere = sphere;
        this.head = head;
        this.head.traverse((child) => { if (child.name == "base_head") console.log(child.name) });
        console.log(this.head)
        this.stand = stand;
        this.count = 0;
        this.states = 0;
        this.headParts = new Group();
        this._init();
    }

    _init() {
        this._initStick();
        this._createAimPoints();

        const radius = 1.2;

        // this.head.position.set(this.stand.position.x, this.stand.position.y - radius / 2, 0);
        this.head.visible = false;
        this.head.material = this.clayMaterial;
        this.add(this.head);
        let headMap;
        if (this.head.name === "h_harley") {
            headMap = Cache.get("harleyhead")
        } if (this.head.name === "h_bride") {
            headMap = Cache.get("arianagrandehead")
        } if (this.head.name === "h_rock") {
            headMap = Cache.get("rockhead")
        }
        if (this.head.name === "h_tuxedo") {
            headMap = Cache.get("mrbeanhead")
        }

        const headmaterial = new MeshPhysicalMaterial({ map: headMap, transparent: true, opacity: 0 })
        this.headWithMap = new Mesh(this.head.geometry, headmaterial);
        this.headWithMap.position.copy(this.head.position)
        this.headWithMap.rotation.copy(this.head.rotation)
        this.headWithMap.scale.copy(this.head.scale)
        // this.headWithMap.visible = false;
        this.add(this.headWithMap)

        // Create a new geometry based on the head's geometry
        this.originalGeometry = this.head.geometry.clone(); // Store the original geometry    
        this.halfSculptedHeadGeometry = this._halfsculptHead(this.head.geometry.clone());

        this.modifiedGeometry = this._modifyGeometry(this.halfSculptedHeadGeometry.clone());

        this.halfSculptedHead = new Mesh(this.modifiedGeometry, this.clayMaterial);
        this.halfSculptedHead.position.copy(this.head.position);
        this.halfSculptedHead.scale.copy(this.head.scale);
        this.halfSculptedHead.rotation.copy(this.head.rotation);

        this.add(this.halfSculptedHead);

        this.modifiedMesh = new Mesh(this.modifiedGeometry, this.clayMaterial);
        this.modifiedMesh.position.copy(this.head.position);
        this.modifiedMesh.scale.copy(this.head.scale);
        this.modifiedMesh.rotation.copy(this.head.rotation);

        this.add(this.modifiedMesh);

        this.halfSculptedHead.visible = false;
        this.modifiedMesh.visible = false;
    }

    _createAimPoints() {
        const aimPointsData = {
            rEye: new Vector3(this.stand.position.x - 0.037, 0.1, 0.13),
            lEye: new Vector3(this.stand.position.x + 0.034, 0.1, 0.13),
            nose: new Vector3(this.stand.position.x, 0.06, 0.16),//
            mouth: new Vector3(this.stand.position.x, 0.03, 0.14),
            // face: new Vector3(this.stand.position.x, 0, 0)
        };
        this.points = new Group();
        const geo = new SphereGeometry(0.03, 32, 32);

        for (let key in aimPointsData) {
            const p = aimPointsData[key];

            const point = new Mesh(geo);
            point.position.x = p.x;
            point.position.y = p.y;
            point.position.z = p.z;
            point.visible = false;

            this.points.add(point);
        }

        this.add(this.points);
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
        this.stick.rotation.set(0, 0, 0)
        this.stick.visible = false;
        this.add(this.stick);
        this.stick.scale.set(0.1, 0.1, 0.1)

    }

    headDone() {
        this.head.visible = true;
        this.modifiedMesh.visible = false;
        this.halfSculptedHead.visible = false;
    }

    onMove(x, y, callback) {

        this.graduallyRevertToOriginal();
        this.rotateStick(x, y, () => { callback() })
    }


    rotateStick(x, y, callback) {
        this.states++;

        this.stick.rotation.x = x / 1000;
        this.stick.rotation.y = y / 1000;
        this.stick.rotation.z = -Math.PI / 2 - x / 1000;
        if (this.states === 0 || this.states === 100 || this.states === 200 || this.states === 300) {
            this.count++;
            this.stick.position.copy(this.points.children[this.count].position);
            console.log(this.states)
        } if (this.states >= 400) callback();
    }



    graduallyTurnToSculpt(callback) {

        const incrementAmount = 0.1; // Adjust this value to control the speed of the transition
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

    graduallyTurnClayToSculpt(callback) {

        const incrementAmount = 0.01; // Adjust this value to control the speed of the transition
        const threshold = 0.001; // Adjust this value to set the threshold for "almost the same"
        let allPositionsAlmostSame = true;

        for (let i = 0; i < this.sphere.geometry.attributes.position.array.length; i += 3) {
            const diffX = this.head.geometry.attributes.position.array[i] - this.sphere.geometry.attributes.position.array[i];
            const diffY = this.head.geometry.attributes.position.array[i + 1] - this.sphere.geometry.attributes.position.array[i + 1];
            const diffZ = this.head.geometry.attributes.position.array[i + 2] - this.sphere.geometry.attributes.position.array[i + 2];

            this.sphere.geometry.attributes.position.array[i] += diffX * incrementAmount;
            this.sphere.geometry.attributes.position.array[i + 1] += diffY * incrementAmount;
            this.sphere.geometry.attributes.position.array[i + 2] += diffZ * incrementAmount;

            if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold || Math.abs(diffZ) > threshold) {
                allPositionsAlmostSame = false;
            }
        }

        this.sphere.geometry.attributes.position.needsUpdate = true;

        if (allPositionsAlmostSame && callback) {
            callback()
            object.visible = false;
            this.head.visible = true;
        }
    }



    graduallyRevertToOriginal(callback) {

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


        for (let i = 0; i < this.modifiedGeometry.attributes.position.array.length; i += 3) {
            const diffX = this.originalGeometry.attributes.position.array[i] - this.modifiedGeometry.attributes.position.array[i];
            const diffY = this.originalGeometry.attributes.position.array[i + 1] - this.modifiedGeometry.attributes.position.array[i + 1];
            const diffZ = this.originalGeometry.attributes.position.array[i + 2] - this.modifiedGeometry.attributes.position.array[i + 2];

            this.modifiedGeometry.attributes.position.array[i] += diffX * incrementAmount;
            this.modifiedGeometry.attributes.position.array[i + 1] += diffY * incrementAmount;
            this.modifiedGeometry.attributes.position.array[i + 2] += diffZ * incrementAmount;


            this.modifiedGeometry.attributes.position.needsUpdate = true;
        }

        // if (this.modifiedGeometry.attributes.position.array === this.originalGeometry.attributes.position.array) {
        //     callback()
        // }
    }

    putonTexture(callback) {
        // Ensure both materials are transparent
        this.headWithMap.material.transparent = true;
        this.head.material.transparent = true;

        // Adjust opacity values
        this.headWithMap.material.opacity += 0.005;
        this.head.material.opacity -= 0.0008;

        if (this.headWithMap.material.opacity >= 1 - 0.01) {
            this.headWithMap.material.transparent = false;
            this.head.material = this.headWithMap.material;
            this.headDone()
            callback();
        }
    }


    graduallyMorph(object, callback) {
        this.object = object;
        const incrementAmount = 0.01; // Adjust this value to control the speed of the transition
        const threshold = 0.001; // Adjust this value to set the threshold for "almost the same"
        let allPositionsAlmostSame = true;

        for (let i = 0; i < this.object.geometry.attributes.position.array.length; i += 3) {
            const diffX = this.modifiedGeometry.attributes.position.array[i] - this.object.geometry.attributes.position.array[i];
            const diffY = this.modifiedGeometry.attributes.position.array[i + 1] - this.object.geometry.attributes.position.array[i + 1];
            const diffZ = this.modifiedGeometry.attributes.position.array[i + 2] - this.object.geometry.attributes.position.array[i + 2];

            this.object.geometry.attributes.position.array[i] += diffX * incrementAmount;
            this.object.geometry.attributes.position.array[i + 1] += diffY * incrementAmount;
            this.object.geometry.attributes.position.array[i + 2] += diffZ * incrementAmount;

            if (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold || Math.abs(diffZ) > threshold) {
                allPositionsAlmostSame = false;

            }
        }

        this.object.geometry.attributes.position.needsUpdate = true;

        if (allPositionsAlmostSame && callback) {
            callback()
        }
    }

}