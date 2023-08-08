import TWEEN from "@tweenjs/tween.js";
import { Object3D, PlaneGeometry, MeshPhysicalMaterial, Mesh, CylinderGeometry, Cache, DoubleSide, Group } from 'three';
import { Black } from "../../../utils/black-engine.module";
import Head from '../components-3d/head'
import Models3D from "./3d-models";
import ConfigurableParams from "../../../data/configurable_params";

export default class Layout3D extends Object3D {
  constructor(camera) {
    super(); this._camera = camera;
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

    const geo = new PlaneGeometry(8, 1);
    const mat = new MeshPhysicalMaterial({ transparent: true, opacity: 0.9, color: 0x000000 });
    this.bg = new Mesh(geo, mat);
    this.bg.visible = false;

    this.add(this.bg);
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
    this.positionInDock = [];

    let scale, dockelements;
    if (bodyPart === "head") {
      dockelements = this.model3d.headDecor;
      scale = this._camera.position.z / 2;

    } else if (bodyPart === "body") {
      dockelements = this.model3d.headDecor;
      scale = 0.3;
      this.model3d.bodies[0].visible = true;
      this.model3d.bodies[0].position.copy(this.stand.position)

    } else if (bodyPart === "accessories") {
      dockelements = this.model3d.accessories;
      scale = this._camera.position.z / 2;
      console.log(dockelements)
    }

    const width = 8;

    this.bg.position.set(-width / 4, this._camera.position.y - 2.75, this._camera.position.z / 2 - 3);
    this.bg.visible = true;
    this.dock = new Group();
    this.dock.position.set(-width / 4, this._camera.position.y - 2, this._camera.position.z / 2 - 1);
    this.add(this.dock);

    const numberOfElements = dockelements.length;
    const rowStartPosition = -1.5 + (1 / numberOfElements);

    const distanceBetweenElements = (width / 2) / (numberOfElements + 2); // Adjust this for spacing.
    for (let i = 0; i < dockelements.length; i++) {
      const element = dockelements[i].clone();
      element.visible = true;
      element.scale.set(scale, scale, scale);
      element.rotation.x += 1;
      let elementName = element.name.toLowerCase();
      if (elementName.includes("_r")) {
        element.scale.multiply(this.model3d.flipX)
      }
      if (element.name === "hair") {
        element.scale.set(scale / 2, scale / 2, scale / 2);
        element.rotation.x += 1;
        element.rotation.y += Math.PI / 2;
      }

      const pos = rowStartPosition + (distanceBetweenElements * i);
      element.position.set(pos, 0, 0);
      this.positionInDock.push(pos);
      this.dock.add(element)
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
    const tween = new TWEEN.Tween(object.position)
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