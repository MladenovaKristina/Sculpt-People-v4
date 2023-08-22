import { Black, DisplayObject, Sprite, Graphics } from '../../../utils/black-engine.module';
import { Tween, Easing } from '@tweenjs/tween.js';
import model from '../../../data/model';
import Helpers from '../../helpers/helpers';
import PlayButton from './play-button';
import Endscreen from './endscreen';
import ConfigurableParams from '../../../data/configurable_params';
import TopText from './top-text';
import Tutorial from './tutorial';
import ReferencePhoto from './ref-photo';
import SelectHint from './select-hint';
import CheersText from './cheers-text';
import Confetti from './confetti';
import { call } from 'file-loader';
import SprayCan from './spray';
// works as a main class in 2D playables
export default class Layout2D extends DisplayObject {
  constructor() {
    super();

    this.onPlayBtnClickEvent = 'onPlayBtnClickEvent';
    this.onActionClickEvent = 'onActionClickEvent';

    this._platform = model.platform;
    this._downloadBtn = null;
    this._logoGoogle = null;
    this._endScreen = null;

    this._isStaticStoreMode = false;
  }

  onAdded() {
    this._tutorial = new Tutorial();
    this.add(this._tutorial);

    this._tutorial.x = Black.stage.centerX;
    this._tutorial.y = Black.stage.centerY + 200;

    this._topText = new TopText();
    this.add(this._topText);

    this._refPhoto = new ReferencePhoto();
    this.add(this._refPhoto);

    this._selectHint = new SelectHint();
    this.add(this._selectHint);

    this._createEndscreen();

    this._createLogo();
    this._createDownloadBtn();
    this._initCheers();
    this._initConfetti();

    this.onResize();
    Black.stage.on('resize', this.onResize, this);
  }

  onResize() {
    const bb = Black.stage.bounds;

    this._topText.onResize();
    this._topText.x = bb.left;
    this._topText.y = bb.top + Number(ConfigurableParams.getData()["top_text"]["top_title_offset"]["value"]);

    this._refPhoto.x = bb.left + Number(ConfigurableParams.getData()["reference_photo"]["offset"]["x"]);
    this._refPhoto.y = bb.top + Number(ConfigurableParams.getData()["reference_photo"]["offset"]["y"]);
    if (this._topText.visible)
      this._refPhoto.y = this._topText.y + this._topText.height + Number(ConfigurableParams.getData()["reference_photo"]["offset"]["y"]);

    this._selectHint.x = bb.left;
    this._selectHint.y = Black.stage.centerY;

    this._endScreen.onResize(bb);

    if (this._logoGoogle) {
      this._logoGoogle.scaleX = 0.9;
      this._logoGoogle.scaleY = 0.9;

      this._logoGoogle.x = bb.right - 240;
      this._logoGoogle.y = bb.top + 15;
    }

    if (this._downloadBtn) {
      this._downloadBtn.scaleX = 0.6;
      this._downloadBtn.scaleY = 0.6;

      this._downloadBtn.x = Helpers.LP(bb.right - 170, Black.stage.centerX);
      this._downloadBtn.y = bb.bottom - 85;
    }
  }

  _createEndscreen() {
    const endscreen = this._endScreen = new Endscreen();
    this.add(endscreen);

    endscreen.on(endscreen.onPlayBtnClickEvent, msg => {
      this.post(this.onPlayBtnClickEvent);
    });
  }

  _createLogo() {
    if (model.platform === "google_landscape" || model.platform === "google_portrait") {
      const logo = this._logoGoogle = new Sprite('logo');
      logo.alignAnchor(0, 0);
      this.add(logo);
    }
  }

  _createDownloadBtn() {
    if (model.platform === "mintegral" || ConfigurableParams.isNeedShowPN()) {
      const downloadBtn = this._downloadBtn = new PlayButton(ConfigurableParams.getData()["play_button"]["play_now_text"]["value"]);
      downloadBtn.visible = true;
      this.add(downloadBtn);
    }
  }

  startHint() {
    this._tutorial.show();
  }
  _showOval() {
    const bb = Black.stage;
    if (this.ovalTarget) this.ovalTarget.clear();
    this.ovalTarget = new Graphics();
    this.ovalTarget.beginPath();
    this.ovalTarget.lineStyle(10, 0xf0f0f0);
    const width = bb.height * 0.4;
    const height = bb.height * 0.5;
    this.ovalTarget.roundedRect(bb.centerX - width / 2, bb.centerY - height / 1.5, width, height, 200);
    this.ovalTarget.stroke();
    this.ovalTarget.visible = true;
    this.add(this.ovalTarget);
  }
  _hideOval(callback) {
    const bb = Black.stage;

    this.ovalTarget.clear();
    this.ovalTarget.beginPath();
    this.ovalTarget.lineStyle(10, 0x00ff00);
    const width = bb.height * 0.4;
    const height = bb.height * 0.5;
    this.ovalTarget.roundedRect(bb.centerX - width / 2, bb.centerY - height / 1.5, width, height, 200);
    this.ovalTarget.stroke();

    setTimeout(() => {
      this.ovalTarget.clear();
      this.ovalTarget.beginPath();
      this.ovalTarget.lineStyle(10, 0xffffff);
      const width = bb.height * 0.4;
      const height = bb.height * 0.5;
      this.ovalTarget.roundedRect(bb.centerX - width / 2, bb.centerY - height / 1.5, width, height, 200);
      this.ovalTarget.stroke();
    }, 200)

    setTimeout(() => {
      this.ovalTarget.visible = false;
      this.ovalTarget.clear();
      this.ovalTarget = null;
      callback()
    }, 600)



  }
  _initDockBG(object, callback) {
    this.initObjectInDock(object);
    callback()
  }
  initObjectInDock(object) {
    this._objectsInDock = new SprayCan(this._bg)
    this.add(this._objectsInDock)
  }
  _startClayHint() {
    this._selectHint.show();
  }
  _hideClayHint() {
    this._selectHint.hide();
  }
  _initCheers() {
    this._cheers = new CheersText();
    this.add(this._cheers)
  }
  _initConfetti() {
    this._confetti = new Confetti();
    this.add(this._confetti)
  }

  hide(object, callback) {
    //     console.log("hiding", object)
    //     const hideTween = new Tween({
    //       y: Black.stage.bounds.bottom + 250
    //     }, 0.2);
    // 
    //     object.add(hideTween);
    object.visible = false;
    if (callback) callback()

  }

  onDown(x, y) {
    const defaultPos = { x: x, y: y };
    const blackPos = Black.stage.worldTransformationInverted.transformVector(defaultPos);

    const ifDownloadButtonClicked = this._ifDownloadButtonClicked(blackPos.x, blackPos.y);
    if (ifDownloadButtonClicked) return true;

    this._endScreen.onDown(blackPos.x, blackPos.y);
  }

  selectSpray(x, y, callback) {
    console.log(x, y, "spray")
    if (callback) callback();
  }

  onMove(x, y) {
    const defaultPos = { x: x, y: y };
    const blackPos = Black.stage.worldTransformationInverted.transformVector(defaultPos);
  }

  onUp() {
  }

  enableStoreMode() {
    if (this._isStaticStoreMode) return;
    this._isStaticStoreMode = true;

    if (this._downloadBtn) this._downloadBtn.visible = false;
    if (this._logoGoogle) this._logoGoogle.visible = false;
    this._topText.visible = false;
    this._tutorial.visible = false;
    this._refPhoto.visible = false;

    this._endScreen.show();
  }

  _ifDownloadButtonClicked(x, y) {
    if (!this._isStaticStoreMode && this._downloadBtn) {
      const isButtonClick = this._downloadBtn.isDown(x, y);
      if (isButtonClick) {
        this.post(this.onPlayBtnClickEvent);
        return true;
      }
    }

    return false;
  }
}
