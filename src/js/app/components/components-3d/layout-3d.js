import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class Layout3D extends THREE.Object3D {
  constructor() {
    super();
    this._initBg();
    this._initStand();
  }
  _initBg() {

    const backgroundGeometry = new THREE.PlaneGeometry(20, 25);
    const backgroundMaterial = new THREE.MeshPhongMaterial({ map: THREE.Cache.get("bg_image") });

    backgroundMaterial.side = THREE.DoubleSide;
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 0, -5);

    backgroundMesh.rotation.z = Math.PI;
    backgroundMesh.rotation.y = Math.PI;
    this.add(backgroundMesh);

  }
  _initStand() {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 10);
    const material = new THREE.MeshPhysicalMaterial({ color: 0xdadada, metalness: 1, reflectivity: 10 });
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = -2;
    cylinder.position.y = -2;
    this.add(cylinder)

    const geo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 30
    );
    const base = new THREE.Mesh(geo, material);

    base.position.x = -2;
    base.position.y = -4.5;
    this.add(base);
  }

  _initAsset() {
    this.asset = THREE.Cache.get('assets').scene;

    this.asset.position.x = 0;
    this.asset.position.y = -2;
    this.add(this.asset);
  }
}