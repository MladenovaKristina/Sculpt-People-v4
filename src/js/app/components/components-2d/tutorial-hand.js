import ConfigurableParams from '../../../data/configurable_params';
import { Tween, DisplayObject, Sprite } from '../../../utils/black-engine.module';

export class TutorialHand extends DisplayObject {
  constructor() {
    super();

    this.animate = false;
    this._view = null;

    this._distX = 150;
    this._distY = 60;
    this._xdt = -4.682145855324444;
    this._ydt = 9.364291710648889;
    this._interpolation = 0;
  }

  onAdded() {
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'MICKEY') {
      this._view = new Sprite('hint_mickey');
      this._view.scaleX = 1;
      this._view.scaleY = 1;
      this._view.alignAnchor(0.15, -0.1);
      this._view.rotation = -0.3;
      this.add(this._view);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'SIMPLE') {
      this._view = new Sprite('hint_simple');
      this._view.scaleX = 1;
      this._view.scaleY = 1;
      this._view.alignAnchor(0.4, -0.1);
      this._view.rotation = -0.3;
      this.add(this._view);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'ORIGINAL') {
      this._view = new Sprite('hint_original');
      this._view.scaleX = 0.5;
      this._view.scaleY = 0.5;
      this._view.alignAnchor(0.5, -0.2);
      this._view.rotation = -0.3;
      this.add(this._view);
    }
  }

  start() {
    if (!this.visible) return;
    // center hand ~(0;0) at start

    this.animate = true;

    const interpolationTw = new Tween({ _interpolation: 1 }, 0.6);
    this.add(interpolationTw);
  }

  stop() {
    this.animate = false;
  }

  playHintRotation() {
    if (!this.visible) return;

    const rotTween = new Tween({
      rotation: [0, 0.3, 0, -0.3]
    }, 1.5);
    this._view.add(rotTween);
  }

  update(value) {
    if (!this.animate || !this.visible) return;

    this._xdt = value;
    this._ydt = -value * 2;

    this._view.x = Math.cos(this._xdt) * this._distX;
    this._view.y = Math.sin(this._ydt) * this._distY;
  }
}
