import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import { PlaneGeometry } from "three";

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
    this.stand = new THREE.Group();
    this.stand.position.x = -2;
    this.add(this.stand)

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 10);
    const material = new THREE.MeshPhysicalMaterial({ color: 0xdadada, metalness: 1, reflectivity: 10 });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = -2;

    this.stand.add(cylinder)

    const geo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 30
    );
    const base = new THREE.Mesh(geo, material);
    base.position.y = -4.5;
    this.stand.add(base);
  }

  _initAsset() {
    this.asset = THREE.Cache.get('assets').scene;

    this.asset.position.x = 0;
    this.asset.position.y = -2;
    this.add(this.asset);
  }

  _initClay() {
    const numberOfClay = 3;
    this.clay = new THREE.Group()
    this.add(this.clay);
    this.clay.position.set(0 - numberOfClay / 2, 0, 0)

    const offset = window.innerWidth / (numberOfClay + 2) / 100;
    const colors = [0xffffff, 0x666666, 0x000000]
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ color: colors[i], side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(offset * i * 2, 0, 0)
      this.clay.add(plane);
    }
  }
}