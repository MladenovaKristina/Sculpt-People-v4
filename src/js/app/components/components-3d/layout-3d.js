import * as THREE from "three";
import { Black } from "../../../utils/black-engine.module";
import * as TWEEN from "@tweenjs/tween.js";
import Head from "./head";

export default class Layout3D extends THREE.Object3D {
  constructor() {
    super();
    this.positionInDock = [];
    this._initBg();
    this._initAsset();
    this._initStand();
  }
  _initBg() {
    const backgroundGeometry = new THREE.PlaneGeometry(35, 35);
    const backgroundMaterial = new THREE.MeshPhongMaterial({ map: THREE.Cache.get("bg_image") });

    backgroundMaterial.side = THREE.DoubleSide;
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 0, -15);

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


    this.asset.traverse((child) => {
      if (child.name === "Armature") {
        this.body = child;

      }
    })
  }

  _initClay() {
    const numberOfClay = 3;
    this.clay = new THREE.Group()
    this.add(this.clay);
    this.clay.position.set(0 - numberOfClay / numberOfClay, 0, 0)

    const offset = Black.stage.bounds.width / 2 / (numberOfClay + 2) / 100;
    const colors = [0xE4DFDA, 0xD4B483, 0x48A9A6]
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(0.5, 0.5);
      const material = new THREE.MeshPhysicalMaterial({ color: colors[i], side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(offset * i, 0, 4)
      this.clay.add(plane);
    }
  }

  _initDock(bodyPart) {
    let dockelements;
    if (bodyPart === "head") {
      dockelements = this._sculpt.head
    } else {
      dockelements = this.body;
      this.add(dockelements)
    }
    const width = 8;
    const geo = new THREE.PlaneGeometry(width, 1, 20, 20)
    const mat = new THREE.MeshBasicMaterial({ color: 0x834333, transparent: true, opacity: 1 });
    this.bg = new THREE.Mesh(geo, mat);
    this.bg.position.set(-width / 4, -3.5, 2);
    this.add(this.bg)

    this.dock = new THREE.Group();
    this.dock.position.set(-width / 4, -3.5, 2);
    this.add(this.dock);

    const numberOfElements = dockelements.children.length;
    const distanceBetweenElements = 1; // Adjust this value as needed for the spacing between elements in the dock.
    const rowStartPosition = 0 - numberOfElements / 2;

    for (let i = 1; i < numberOfElements; i++) {
      const element = dockelements.children[i].clone();
      if (bodyPart === "head") element.scale.set(2, 2, 2)
      else element.scale.set(1, 1, 1)

      let pos = rowStartPosition + (distanceBetweenElements * i);
      element.position.set(pos, 1.8, 4)
      this.positionInDock.push(pos);
      element.visible = true;
      this.dock.add(element);
    }

    console.log(this.dock.children[0].position);
  }

  _initSculpt(clayMaterial) {
    this._sculpt = new Head(clayMaterial, this.asset, this.stand);
    this.add(this._sculpt)
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