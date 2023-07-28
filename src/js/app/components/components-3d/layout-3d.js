import * as THREE from "three";

import * as TWEEN from "@tweenjs/tween.js";

export default class Layout3D extends THREE.Object3D {
  constructor() {
    super();
    this._initBg();
    this._initAsset();
    this._initStand();
    this.headDecor = [];
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
  }

  _initClay() {
    const numberOfClay = 3;
    this.clay = new THREE.Group()
    this.add(this.clay);
    this.clay.position.set(0 - numberOfClay / 2, 0, 0)

    const offset = window.innerWidth / (numberOfClay + 2) / 100;
    const colors = [0xE4DFDA, 0xD4B483, 0x48A9A6]
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshPhysicalMaterial({ color: colors[i], side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(offset * i * 2, 0, 0)
      this.clay.add(plane);
    }
  }
  _initSculpt(clayMaterial) {
    const radius = 1;
    const geometry = new THREE.BoxGeometry(radius, radius, radius, 20, 20);
    this.sphere = new THREE.Mesh(geometry, clayMaterial)
    this.sphere.position.set(this.stand.position.x, this.stand.position.y + radius, 0)
    this.add(this.sphere);

    this.asset.traverse((child) => {
      if (child.name === "HEAD") {
        this.head = child;

        this.head.traverse((child) => {
          if (child.name != "HEAD") {
            child.visible = false;
            this.headDecor.push(child)
          }
        })
      }
    })
    console.log(this.headDecor)
    this.head.position.set(this.stand.position.x, this.stand.position.y + radius, 0)
    this.head.material = clayMaterial;
    this.head.scale.set(10, 10, 10)
    this.add(this.head)
    this.head.visible = false;
  }

  hideClay() {
    this.hide(this.clay);
  }
  hide(object) {
    const tween = new TWEEN.Tween(object.position) // Use the temporary object for tweening
      .to({ y: -10 }, 400)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        object.visible = false;
      })
      .delay(100)
      .start();

    this.animate();
  }
  animate() {
    TWEEN.update();
    requestAnimationFrame(() => this.animate());
  }
}