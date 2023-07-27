import { AssetManager, GameObject } from '../../../utils/black-engine.module';
import hint_mickey from '../../../data/textures/hint_mickey.png';
import hint_simple from '../../../data/textures/hint_simple.png';
import hint_original from '../../../data/textures/hint_original.png';
import infinity_sign from '../../../data/textures/infinity_sign.png';
import btn_outline from '../../../data/textures/btn_outline.png';
import btn_color from '../../../data/textures/btn_color.png';
import btn_back from '../../../data/textures/btn_back.png';

import ConfigurableParams from '../../../data/configurable_params';

export default class AssetsLoader2D extends GameObject {
  constructor() {
    super();

    this.loaded = 'loaded';
  }

  onAdded() {
    this._loadAssets();
  }

  _loadAssets() {
    const assets = new AssetManager();

    assets.enqueueImage('hint_mickey', hint_mickey);
    assets.enqueueImage('hint_simple', hint_simple);
    assets.enqueueImage('hint_original', hint_original);
    assets.enqueueImage('infinity_sign', infinity_sign);

    assets.enqueueImage('btn_outline', btn_outline);
    assets.enqueueImage('btn_color', btn_color);
    assets.enqueueImage('btn_back', btn_back);

    assets.enqueueImage('logo', ConfigurableParams.getData()["logo_for_google"]["change_logo"]["value"]);
    assets.enqueueImage('endscreen_logo', ConfigurableParams.getData()["endcard"]["logo"]["value"]);
    assets.enqueueImage('ref_image', ConfigurableParams.getData()["reference_photo"]["ref_photo"]["value"]);

    assets.on('complete', () => this.post(this.loaded));
    assets.loadQueue();
  }
}
