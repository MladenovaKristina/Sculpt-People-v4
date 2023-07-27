import { Component } from "../../utils/black-engine.module";

export default class MaxWidthComponent extends Component {
  constructor(maxWidth) {
    super();
    this._maxWidth = maxWidth;
  }

  onAdded() {
    this.onChange();
  }

  onChange() {   
    if (!this.gameObject.autoSize)
      return;

    if (this.gameObject.width > this._maxWidth) {
      while (this.gameObject.width > this._maxWidth) {
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

  set maxWidth(value) {
    if (this._maxWidth !== value){
      this._maxWidth = value;
      this.onChange();
    }
  }
}