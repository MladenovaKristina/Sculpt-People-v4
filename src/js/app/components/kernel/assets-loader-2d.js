import { AssetManager, GameObject } from '../../../utils/black-engine.module';
import hint_mickey from '../../../data/textures/hint_mickey.png';
import hint_simple from '../../../data/textures/hint_simple.png';
import hint_original from '../../../data/textures/hint_original.png';
import infinity_sign from '../../../data/textures/infinity_sign.png';
import btn_outline from '../../../data/textures/btn_outline.png';
import btn_color from '../../../data/textures/btn_color.png';
import btn_back from '../../../data/textures/btn_back.png';
import cheers1 from '../../../data/textures/cheers/cheers1';
import cheers2 from '../../../data/textures/cheers/cheers2';
import cheers3 from '../../../data/textures/cheers/cheers3';
import cheers4 from '../../../data/textures/cheers/cheers4';
import cheers5 from '../../../data/textures/cheers/cheers5';

import confetti0 from '../../../data/textures/cheers/confetti/confetti0.png';
import confetti1 from '../../../data/textures/cheers/confetti/confetti1.png';
import confetti2 from '../../../data/textures/cheers/confetti/confetti2.png';
import confetti3 from '../../../data/textures/cheers/confetti/confetti3.png';
import confetti4 from '../../../data/textures/cheers/confetti/confetti4.png';
import confetti5 from '../../../data/textures/cheers/confetti/confetti5.png';
import confetti6 from '../../../data/textures/cheers/confetti/confetti6.png';
import confetti7 from '../../../data/textures/cheers/confetti/confetti7.png';
import confetti8 from '../../../data/textures/cheers/confetti/confetti8.png';

import spray from '../../../data/textures/spray/Spray.png';
import sprayColorPart from '../../../data/textures/spray/SprayColorPart.png';
import spraySelected from '../../../data/textures/spray/SpraySelected.png';


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

    assets.enqueueImage('confetti0', confetti0);
    assets.enqueueImage('confetti1', confetti1);
    assets.enqueueImage('confetti2', confetti2);
    assets.enqueueImage('confetti3', confetti3);
    assets.enqueueImage('confetti4', confetti4);
    assets.enqueueImage('confetti5', confetti5);
    assets.enqueueImage('confetti6', confetti6);
    assets.enqueueImage('confetti7', confetti7);
    assets.enqueueImage('confetti8', confetti8);


    assets.enqueueImage('cheers1', cheers1.url);
    assets.enqueueImage('cheers2', cheers2.url);
    assets.enqueueImage('cheers3', cheers3.url);
    assets.enqueueImage('cheers4', cheers4.url);
    assets.enqueueImage('cheers5', cheers5.url);

    assets.enqueueImage('spray', spray);
    assets.enqueueImage('sprayColorPart', sprayColorPart);
    assets.enqueueImage('spraySelected', spraySelected);


    assets.enqueueImage('logo', ConfigurableParams.getData()["logo_for_google"]["change_logo"]["value"]);
    assets.enqueueImage('endscreen_logo', ConfigurableParams.getData()["endcard"]["logo"]["value"]);
    assets.enqueueImage('ref_image', ConfigurableParams.getData()["reference_photo"]["ref_photo"]["value"]);

    assets.on('complete', () => this.post(this.loaded));
    assets.loadQueue();
  }
}
