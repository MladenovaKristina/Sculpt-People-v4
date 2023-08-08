import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, DisplayObject, TextField, Ease } from '../../../utils/black-engine.module';
import { TutorialHand } from './tutorial-hand';

export default class SelectHint extends DisplayObject {
  constructor(position) {
    super();
    this.position = position;
    this.scaleX = 1;
    this.scaleY = 1;

    this.visible = false;
  }

  onAdded() {

    const textValue = 'Choose your clay';

    this._text = new TextField(
      textValue,
      'Arial',
      0xffffff,
      80
    );
    this._text.weight = 750;
    this._text.strokeColor = 0x000000;
    this._text.strokeThickness = 10;
    this._text.alignAnchor(0.5, 0.5);
    this._text.y = Black.stage.centerY - Black.stage.height / 1.5;
    this._text.x = Black.stage.centerX;

    this.add(this._text);



    this._hand = new TutorialHand();

    this.startX = 50 + Black.stage.bounds.width / 5;
    this.offset = Black.stage.bounds.width / 5;

    this._hand.x = this.startX;
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
    const slidetween = new Tween({
      x: [this.startX, this.startX + this.offset * 3 - 100, this.startX]
    }, 2, { ease: Ease.linear, delay: 0.5, loop: Infinity });
    this._hand.add(slidetween);

  }

  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }
}

