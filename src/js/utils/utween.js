import { Tween, GameObject, Black } from "./black-engine.module";

const shadowObjectsPool = [];
export default class UTween extends Tween {
  constructor(target, values, duration = 0.250, properties = null, plugins = null) {
    super(values, duration, properties, plugins);

    this._target = target;
    this._shadowObject = this._getShadowObject(); //the object on which the tween component will be added
    this._updateShadowObject(); //set all the parameters of the shadow object. Start values are taken from the target
    this._shadowObject.addComponent(this);
  }

  /* jshint ignore:start */
  set(values) {
    super.set(values);
    this._updateShadowObject();
  }
  /* jshint ignore:end */

  to(values = {}, duration = 0.250) {
    super.to(values, duration);
    this._updateShadowObject();
    return this;
  }

  stop() {
    super.stop();
    this._shadowObject = null;
  }

  reset() {
    super.reset();

    this._shadowObject.removeFromParent();
    shadowObjectsPool.push(this._shadowObject);

    this._shadowObject = this._getShadowObject(); //the object on which the tween component will be added
    this._updateShadowObject(); //set all the parameters of the shadow object. Start values are taken from the target
    this._shadowObject.addComponent(this);
  }

  onUpdate() {
    super.onUpdate();

    if (!this._shadowObject) return;

    for (const key in this.mValues) {
      if (this.mValues.hasOwnProperty(key)) {

        this._target[key] = this._shadowObject[key];
      }
    }
  }

  _getShadowObject() {
    const stage = Black.engine.stage;
    const shadowRoot = stage.uTweenRoot = (stage.uTweenRoot || new GameObject());
    const shadowObject = shadowObjectsPool.pop() || new GameObject();

    if (shadowRoot.parent === null) {
      stage.addChild(shadowRoot);
    }

    shadowObject.watchComponents = true; //marks the object as watchable for ComponentWatcherSystem.
    shadowObject.once('componentRemoved', (msg, component) => (component === this) && this._onComplete());
    return shadowRoot.addChild(shadowObject);
  }

  _onComplete() {
    this._shadowObject.removeFromParent();
    shadowObjectsPool.push(this._shadowObject);
  }

  _updateShadowObject() {
    for (const key of Object.keys(this.mValues)) {
      this._shadowObject[key] = this._target[key];
    }
  }
}