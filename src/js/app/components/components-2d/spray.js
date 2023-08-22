import config from '../../../data/config';
import { GameObject, Sprite, Graphics, Black, Tween, Ease } from '../../../utils/black-engine.module';

export default class SprayCan extends GameObject {
    constructor() {
        super();
        this._text = null;
        this._container = null;
        this.numberOfCans = 4;
        this.init();
    }

    init() {
        const height = 150;
        const bb = Black.stage.bounds;

        if (this._bg) this._bg.clear();
        this._bg = new Graphics();
        this._bg.beginPath();
        this._bg.fillStyle(0x000000, 0.9);
        this._bg.rect(bb.left, bb.height / 2 + height, bb.width, height);
        this._bg.fill();
        this.add(this._bg);

        const totalWidth = this._bg.width || bb.width;
        const startY = (bb.height / 2 + height) + height / 8;

        const colors = [0x00ff00, 0xff0000, 0x0000ff, 0x0f0f0f, 0x000000];

        for (let i = 0; i < this.numberOfCans; i++) {
            const can = new Graphics();

            const canSelect = new Sprite('spraySelected');
            const canOutline = new Sprite('spray');
            const canColor = new Sprite('sprayColorPart');
            canColor.color = colors[i];
            can.addChild(canSelect);
            can.addChild(canOutline);
            can.addChild(canColor);

            can.height = height * 0.8;
            can.width = height * 0.8 * (can.width / can.height);
            const spacing = totalWidth / (this.numberOfCans + 2);

            can.x = spacing + (spacing * i)
            can.y = startY;
            this._bg.add(can);
        }
    }


    hide() {
        const hideTween = new Tween({
            y: Black.stage.bounds.bottom + 250
        }, 0.2);

        this.add(hideTween);

        hideTween.on('complete', msg => this.visible = false);
    }
    show() { }
}
