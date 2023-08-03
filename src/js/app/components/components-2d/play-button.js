import ConfigurableParams from '../../../data/configurable_params';
import { GameObject, Tween, Ease, Sprite, DisplayObject, TextField } from '../../../utils/black-engine.module';

export default class PlayButton extends DisplayObject {
  constructor(text) {
    super();

    this._text = text;
    this._container = null;
    this._view = null;

    this._backColor = ConfigurableParams.getData()["play_button"]["btn_color_dark"]["value"];
    this._mainColor = ConfigurableParams.getData()["play_button"]["btn_color_main"]["value"];
  }

  onAdded() {
    this._container = new GameObject();
    this.add(this._container);

    this._outline = new Sprite('btn_outline');
    this._outline.alignAnchor(0.5, 0.5);
    this._container.add(this._outline);
    this._container.scaleX = 2;
    this._container.scaleY = 2;

    this._back = new Sprite('btn_back');
    this._back.color = this._backColor;
    this._back.alignAnchor(0.5, 0.5);
    this._container.add(this._back);

    this._color = new Sprite('btn_color');
    this._color.color = this._mainColor;
    this._color.alignAnchor(0.5, 0.5);
    this._container.add(this._color);

    this._btnText = new TextField(this._text, 'Arial', 0xffffff, 120);
    this._btnText.y = -2;
    this._btnText.weight = 800;
    this._btnText.alignAnchor(0.5, 0.5);
    this._container.add(this._btnText);

    const width = this._btnText.width / this._color.width;
    if (width > 0.85) {
      this._btnText.scaleX = 1 / width * 0.82;
      this._btnText.scaleY = 1 / width * 0.82;
    }
  }

  isDown(x1, y1) {
    const x2 = this.x, y2 = this.y;
    const w = this.width, h = this.height;

    return ((x1 > x2 - w / 2) && (x1 < x2 + w / 2) && (y1 > y2 - h / 2) && (y1 < y2 + h / 2));
  }

  show() {
    this.visible = true;

    const buttonPulse = new Tween({
      scaleX: [1.2, 1], scaleY: [1.2, 1]
    }, 1.4, { loop: true, ease: Ease.sinusoidalOut });
    this._container.add(buttonPulse);
  }
}
