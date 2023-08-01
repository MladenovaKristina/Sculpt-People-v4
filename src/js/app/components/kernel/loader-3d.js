import { TextureLoader, Cache } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import assets from '../../../data/textures/3d/fourCharacters_assets.glb';
import bg_image from '../../../data/textures/bg_image.png';
import arm from '../../../data/textures/3d/hand_Sculpting.glb';

import fingerprint from '../../../data/textures/3d/fingerprints.png';

export default class Loader3D {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.GLBLoader = new GLTFLoader();

    this._count = 0;
  }

  load() {
    const objects = [
      { name: 'assets', asset: assets },
      { name: 'arm', asset: arm },
      { name: 'rightArm', asset: arm }


    ];
    const textures = [
      { name: 'bg_image', asset: bg_image },
      { name: 'fingerprint', asset: fingerprint }

    ];

    this._count = objects.length + textures.length;

    return new Promise((resolve, reject) => {
      if (this._count === 0)
        resolve(null);

      objects.forEach((obj, i) => {
        this.GLBLoader.load(obj.asset, (object3d) => {
          Cache.add(obj.name, object3d);
          this._count--;

          if (this._count === 0)
            resolve(null);
        });
      });

      textures.forEach((txt) => {
        const textureMain = this.textureLoader.load(txt.asset);
        textureMain.flipY = false;
        Cache.add(txt.name, textureMain);

        this._count--;

        if (this._count === 0)
          resolve(null);
      });
    });
  }
}