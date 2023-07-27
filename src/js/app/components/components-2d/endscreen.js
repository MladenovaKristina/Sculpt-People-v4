import ConfigurableParams from '../../../data/configurable_params';
import { Black, TextField, Ease, Sprite, DisplayObject, Tween, Graphics, GraphicsLinearGradient } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';
import PlayButton from './play-button';

export default class Endscreen extends DisplayObject {
  constructor() {
    super();

    this.onPlayBtnClickEvent = 'onPlayBtnClickEvent';

    this._button = null;
    this._logo = null;
    this._layout = null;

    this.visible = false;


    this._playBtnText = ConfigurableParams.getData()["endcard"]["button_text"]["value"];
    this._textValue = ConfigurableParams.getData()["endcard"]["text"]["value"];
    this._textColor = Number(ConfigurableParams.getData()["endcard"]["text_color"]["value"].replace('#', '0x'));
  }

  onAdded() {
    this._bg = new Graphics();
    this._bg.visible = ConfigurableParams.getData()['endcard']['bg_type']['value'] === 'GRADIENT';
    this.add(this._bg);

    const logo = this._logo = new Sprite('endscreen_logo');
    logo.alignAnchor(0.5, 0.5);
    this.add(logo);

    const playBtn = this._playBtn = new PlayButton(this._playBtnText);
    this.add(playBtn);

    this._text = new TextField(
      this._textValue,
      'Arial',
      this._textColor,
      120
    );
    this._text.alignAnchor(0.5, 0.5);
    this._text.visible = ConfigurableParams.getData()['endcard']['show_text']['value'];
    this.add(this._text);
  }

  onResize(bb) {
    this._grad = new GraphicsLinearGradient(0, bb.top, 0, bb.height);
    this._grad.addColorStop(0, ConfigurableParams.getData()['endcard']['gradient_color_top']['value']);
    this._grad.addColorStop(1, ConfigurableParams.getData()['endcard']['gradient_color_bottom']['value']);

    this._bg.clear();
    this._bg.fillGradient(this._grad);
    this._bg.rect(bb.left, bb.top, bb.width, bb.height);
    this._bg.fill();

    this._text.x = Black.stage.centerX;
    this._text.y = Black.stage.centerY - Helpers.LP(350, 470);

    this._playBtn.x = Black.stage.centerX;
    this._playBtn.y = Black.stage.centerY + Helpers.LP(300, 450);
    this._playBtn.scaleX = 0.75;
    this._playBtn.scaleY = 0.75;

    this._logo.x = Black.stage.centerX;
    this._logo.y = Black.stage.centerY - Helpers.LP(50, 50);
    this._logo.scaleX = ConfigurableParams.getData()['endcard']['logo_scale']['value'] * Helpers.LP(1.5, 1.8);
    this._logo.scaleY = ConfigurableParams.getData()['endcard']['logo_scale']['value'] * Helpers.LP(1.5, 1.8);

    if (!ConfigurableParams.getData()['endcard']['show_text']['value']) {
      this._playBtn.y -= 100;
      this._logo.y -= 130;
    }

    const width = this._text.width / bb.width;
    if (width > 0.92) {
      this._text.scaleX = 1 / width * 0.9;
      this._text.scaleY = 1 / width * 0.9;
    }
  }

  onDown(x, y) {
    if (this.visible && this._playBtn.isDown(x, y)) {
      this.post(this.onPlayBtnClickEvent);
    }
  }

  show() {
    this.visible = true;

    const oldScale = this._text.scaleX;
    this._text.scaleX = 3;
    this._text.scaleY = 3;
    const textTween = new Tween({
      scaleX: oldScale,
      scaleY: oldScale
    }, 0.4, { ease: Ease.backOut });
    this._text.add(textTween);

    this._playBtn.show();
    this._logo.visible = true;

    document.getElementById("appContainer").style.filter = "blur(5px)";
    document.body.style.background = '#ffffff';
  }
}
