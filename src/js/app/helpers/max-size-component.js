import { Component } from "../../utils/black-engine.module";

export default class MaxSizeComponent extends Component {
  constructor(maxWidth, maxHeight) {
    super();
    this._maxWidth = maxWidth;
    this._maxHeight = maxHeight;
  }

  onAdded() {
    this.onChange();
  }

  onChange() {
    if (!this.gameObject.autoSize)
      return;

    if (this.gameObject.width > this._maxWidth || this.gameObject.height > this._maxHeight) {
      while (this.gameObject.width > this._maxWidth || this.gameObject.height > this._maxHeight) {
        this._onChangeSize(this.gameObject.size - 1);
        if (this.gameObject.size <= 0)
          break;
      }
    }
  }

  _onChangeSize(value) {
    this.gameObject.getAllStyles().forEach(x => x.size = value);
    this.gameObject.size = value;
  }

  get maxWidth() {
    return this._maxWidth;
  }

  get maxHeight() {
    return this._maxHeight;
  }

  set maxWidth(value) {
    if (this._maxWidth !== value) {
      this._maxWidth = value;
      this.onChange();
    }
  }

  set maxHeight(value) {
    if (this._maxHeight !== value) {
      this._maxHeight = value;
      this.onChange();
    }
  }
}