import { InitialVelocity, GameObject, Emitter, FloatScatter, InitialScale, InitialLife, InitialTexture, Acceleration, RotationOverLife } from '../../../utils/black-engine.module';
import { Black } from '../../../utils/black-engine.module';

export default class Confetti extends GameObject {
    constructor() {
        super();
    }

    show() {
        const bb = Black.stage.bounds;
        const emitterCount = 10;
        const emitterDelay = 0;

        let currentDelay = 0;

        const colors = [
            "0xFF0000", // Red
            "0xFF7F00", // Orange
            "0xFFFF00", // Yellow
            "0x00FF00", // Green
            "0x0000FF", // Blue
            "0x4B0082", // Indigo
            "0x9400D3"  // Violet
        ];

        for (let i = 0; i < emitterCount; i++) {
            // Create an emitter
            const emitter = new Emitter();
            // Zero all default values since we dont need any particles at the start
            emitter.emitCount = new FloatScatter(2);
            emitter.emitDelay = new FloatScatter(currentDelay);
            emitter.emitInterval = new FloatScatter(0);
            emitter.emitDuration = new FloatScatter(0.1);
            emitter.emitNumRepeats = new FloatScatter(1);

            // Pick a texture for emitting
            const textures = Black.assets.getTextures("confetti*");
            emitter.textures = textures;

            const randomNumber = Math.floor(Math.random() * (colors.length - 1)); // Generates a random number between 0 (inclusive) and 6 (inclusive)

            emitter.color = parseInt(colors[randomNumber]);
            emitter.x = Black.stage.bounds.width / 2;
            emitter.y = Black.stage.bounds.height / 8.5;

            let c = new GameObject();
            c.scaleX = c.scaleY = 1;
            this.addChild(c);

            emitter.add(
                new InitialScale(0.5, 0.9),

                new InitialLife(1),

                new InitialVelocity(-bb.width, -bb.height, bb.width, bb.height),

                new InitialTexture(0),

                new Acceleration(0, 1000, 0, 1000),

                new RotationOverLife(0, Math.PI / 2)
            );

            this.addChild(emitter);

            emitter.space = c;
            emitter.scaleX = emitter.scaleY = 0;
            emitter.rotation = Math.PI;

            currentDelay += emitterDelay;
        }
    }
}
