import config from '../../../data/config';
import { GameObject, Sprite, Tween, Ease } from '../../../utils/black-engine.module';

export default class CheersText extends GameObject {
  constructor() {
    super();

    this._text = null;
    this._container = null;
  }

  onAdded() {
    this._container = new GameObject();
    this.add(this._container);

    this._text = new Sprite('cheers1');
    this._text.alignAnchor(0.5, 0.5);
    this._text.scaleX = 1;
    this._text.scaleY = 1;
    this._text.visible = false;
    this._container.add(this._text);
  }

  show(id, x, y) {
    this._text.visible = true;
    this._text.scaleX = 0;
    this._text.scaleY = 0;
    this._text.alpha = 1;
    this._text.y = 0;

    this._container.x = x;
    this._container.y = y;

    this._text.textureName = 'cheers' + (id + 1);
    this._text.alignAnchor(0.5, 0.5);

    const scaleTween = new Tween({
      scaleX: 1, scaleY: 1
    }, 0.5, { ease: Ease.backOut });
    this._text.add(scaleTween);

    const moveUpTween = new Tween({
      y: -250
    }, 0.7, { ease: Ease.sinusoidalOut, delay: 0.3 });
    this._text.add(moveUpTween);

    const fadeTween = new Tween({
      alpha: 0
    }, 0.3, { ease: Ease.sinusoidalOut, delay: 0.7 });
    this._text.add(fadeTween);

    fadeTween.on('complete', msg => {
      this._text.visible = false;
    });
  }
}
