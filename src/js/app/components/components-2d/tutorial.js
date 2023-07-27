import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../utils/black-engine.module';
import UTween from '../../helpers/../../utils/utween';
import { TutorialHand } from './tutorial-hand';

export default class Tutorial extends DisplayObject {
  constructor() {
    super();

    this._sign = null;

    this.scaleX = 1;
    this.scaleY = 1;

    this.visible = false;
  }

  onAdded() {
    this._bg = new Graphics();
    this._bg.fillStyle(0x000000, 0.5);
    const w = 2000;
    const h = 350;
    this._bg.rect(-w / 2, -h / 2, w, h);
    this._bg.fill();
    this.add(this._bg);

    this._sign = new Sprite('infinity_sign');
    this._sign.alignAnchor(0.5, 0.5);
    this._sign.y = 0;
    this._sign.scaleX = 0.35;
    this._sign.scaleY = 0.35;
    this._sign.color = 0xffffff;
    this.add(this._sign);

    // this._sign.blendMode = 'mask';

    this._hand = new TutorialHand();
    this._hand.x = 10;
    this._hand.y = -30;
    this.add(this._hand);

    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'INFINITY ONLY') this._hand.visible = false;
  }

  show() {
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'NONE') return;

    console.log('show')
    this.visible = true;

    this._hand.start();

    this._makeStep();
  }

  _makeStep() {
    const scaleTw = new Tween({
      scaleX: [0.33, 0.45, 0.33, 0.4, 0.33, 0.35, 0.35],
      scaleY: [0.38, 0.28, 0.38, 0.3, 0.38, 0.35, 0.35],
    }, 2, { ease: Ease.sinusoidalOut, delay: 1 });
    this._sign.add(scaleTw);

    const handMove = { v: 1.6  };
    const handUpdateTween = new UTween(handMove, { v: 1.6 - Math.PI * 2  }, 1.5, { ease: Ease.sinusoidalInOut });
    handUpdateTween.on('update', msg => {
      this._hand.update(handMove.v);
    });

    this._hand.playHintRotation();

    const timer = new Timer(2.2, 1);
    this.add(timer);

    timer.on('tick', msg => {
      this._makeStep();
    });
  }

  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }
}

