import ConfigurableParams from '../../../data/configurable_params';
import { Sprite, DisplayObject, } from '../../../utils/black-engine.module';

export default class ReferencePhoto extends DisplayObject {
  constructor() {
    super();

    this._bg = null;
    this._text = null;

    this.visible = ConfigurableParams.getData()["reference_photo"]["ref_photo_enabled"]["value"];
  }

  onAdded() {
    const imageScale = Number(ConfigurableParams.getData()["reference_photo"]["scale"]["value"]);
    const imageRotation = Number(ConfigurableParams.getData()["reference_photo"]["rotation"]["value"]);

    this._view = new Sprite('ref_image');
    this._view.alignAnchor(0.5, 0.5);
    this.add(this._view);

    this._view.rotation = imageRotation / 180 * Math.PI;
    this._view.scaleX = imageScale;
    this._view.scaleY = imageScale;
    this._view.x = this._view.width * 0.5;
    this._view.y = this._view.height * 0.5;
  }
}

