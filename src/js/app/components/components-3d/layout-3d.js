import TWEEN from "@tweenjs/tween.js";
import { Object3D, PlaneGeometry, MeshPhysicalMaterial, Mesh, CylinderGeometry, Cache, DoubleSide, Group } from 'three';
import { Black } from "../../../utils/black-engine.module";
import Head from '../components-3d/head'
import Models3D from "./3d-models";
import ConfigurableParams from "../../../data/configurable_params";
export default class Layout3D extends Object3D {
  constructor() {
    super();
    this.positionInDock = [];
    this._init();

  }
  _init() {
    this._initBg();
    this._initStand();
    this._initAsset();
  }

  _initBg() {
    const backgroundGeometry = new PlaneGeometry(35, 35);
    const backgroundMaterial = new MeshPhysicalMaterial({ map: Cache.get("bg_image") });

    backgroundMaterial.side = DoubleSide;
    const backgroundMesh = new Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.position.set(0, 0, -15);

    backgroundMesh.rotation.z = Math.PI;
    backgroundMesh.rotation.y = Math.PI;
    this.add(backgroundMesh);
  }

  _initStand() {
    this.stand = new Group();
    this.stand.position.x = -2;
    this.add(this.stand)

    const geometry = new CylinderGeometry(0.1, 0.1, 5, 10);
    const material = new MeshPhysicalMaterial({ color: 0xdadada, metalness: 1, reflectivity: 10 });
    const cylinder = new Mesh(geometry, material);
    cylinder.position.y = -2;

    this.stand.add(cylinder)

    const geo = new CylinderGeometry(1.5, 1.5, 0.1, 30
    );
    const base = new Mesh(geo, material);
    base.position.y = -4.5;

    this.stand.add(base);
  }

  _initAsset() {
    this.model3d = new Models3D(this.stand);
    this.add(this.model3d)
  }

  _initClay() {
    const numberOfClay = 3;
    this.clay = new Group()
    this.add(this.clay);
    this.clay.position.set(0 - numberOfClay / numberOfClay, 0)

    const offset = Black.stage.bounds.width / 2 / (numberOfClay + 2) / 100;
    const colors = [ConfigurableParams.getData()['clay']['clay1']['value'],
    ConfigurableParams.getData()['clay']['clay2']['value'],
    ConfigurableParams.getData()['clay']['clay3']['value']]

    for (let i = 0; i < 3; i++) {
      const geometry = new PlaneGeometry(0.5, 0.5);
      const material = new MeshPhysicalMaterial({ color: colors[i], side: DoubleSide });
      const plane = new Mesh(geometry, material);
      plane.position.set(offset * i, 0, 4)
      this.clay.add(plane);
    }
  }

  _initDock(bodyPart) {
    let dockelements;
    if (bodyPart === "head") {
      dockelements = this._sculpt.head
    } else {
      dockelements = this.model3d.body;
      this.add(dockelements)
    }
    const width = 8;
    const geo = new PlaneGeometry(width, 1, 20, 20)
    const mat = new MeshPhysicalMaterial({ color: 0x834333, transparent: true, opacity: 1 });
    this.bg = new Mesh(geo, mat);
    this.bg.position.set(-width / 4, -3.5, 2);
    this.add(this.bg)

    this.dock = new Group();
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

  }

  _initSculpt(clayMaterial) {
    this.model3d._initTexture(clayMaterial);
    this._sculpt = new Head(clayMaterial, this.model3d.head, this.stand);
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