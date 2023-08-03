import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, DisplayObject, TextField } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';

export default class TopText extends DisplayObject {
  constructor() {
    super();

    this._bg = null;
    this._text = null;

    this.visible = ConfigurableParams.getData()["top_text"]["show"]["value"];
  }

  onAdded() {
    this._bg = new Graphics();
    this._bg.alpha = Number(ConfigurableParams.getData()["top_text"]["top_title_bg_alpha"]["value"])
    this.add(this._bg);

    const textValue = ConfigurableParams.getData()["top_text"]["top_title_text"]["value"];
    const textColor = Number(ConfigurableParams.getData()["top_text"]["top_title_text_color"]["value"].replace('#', '0x'));
    const strokeColor = Number(ConfigurableParams.getData()["top_text"]["top_title_stroke_color"]["value"].replace('#', '0x'));
    const strokeThickness = Number(ConfigurableParams.getData()["top_text"]["top_title_stroke_thickness"]["value"]);

    this._textContainer = new DisplayObject();
    this.add(this._textContainer);

    this._text = new TextField(
      textValue,
      'Arial',
      textColor,
      80
    );
    this._text.weight = 750;
    this._text.strokeColor = strokeColor;
    this._text.strokeThickness = strokeThickness;
    this._text.alignAnchor(0.5, 0.5);
    this._textContainer.y = this._height / 2 + 10;
    this._textContainer.add(this._text);
  }

  onResize() {
    this._resizeBg();
    this._resizeText();
  }

  _resizeBg() {
    const bb = Black.stage.bounds;

    this._bg.clear();
    this._bg.beginPath();
    this._bg.fillStyle(Number(ConfigurableParams.getData()["top_text"]["top_title_bg_color"]["value"].replace('#', '0x')), 1);
    this._bg.rect(0, 0, bb.width + Helpers.LP(200, 0), this._height);
    this._bg.fill();
  }

  _resizeText() {
    const bb = Black.stage.bounds;

    this._text.scaleX = 1;
    this._text.scaleY = 1;

    const width = this._text.width / bb.width;
    if (width > 0.85) {
      this._text.scaleX = 1 / width * 0.82;
      this._text.scaleY = 1 / width * 0.82;
    }

    this._textContainer.x = bb.width / 2;
  }

  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.top - 160
    }, 0.3);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }

  get _height() {
    return 130;
  }
}

