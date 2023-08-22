import { InitialVelocity, GameObject, Emitter, FloatScatter, InitialScale, InitialLife, InitialTexture, Acceleration, RotationOverLife } from '../../../utils/black-engine.module';
import { Black } from '../../../utils/black-engine.module';

export default class Confetti extends GameObject {
    constructor() {
        super();
    }

    show() {
        const emitterCount = 20;
        const emitterDelay = 0; // 1 second delay between each emitter
        let currentDelay = 0.5;

        for (let i = 0; i < emitterCount; i++) {
            // Create an emitter
            const emitter = new Emitter();
            // Zero all default values since we dont need any particles at the start
            emitter.emitCount = new FloatScatter(1);
            emitter.emitDelay = new FloatScatter(currentDelay);
            emitter.emitInterval = new FloatScatter(0);
            emitter.emitDuration = new FloatScatter(0.1);
            emitter.emitNumRepeats = new FloatScatter(1);

            // Pick a texture for emitting
            const textures = Black.assets.getTextures("confetti*");
            emitter.textures = textures;

            emitter.x = Black.stage.bounds.width / 2;
            emitter.y = Black.stage.bounds.height / 8.5;

            let c = new GameObject();
            c.scaleX = c.scaleY = 2;
            this.addChild(c);

            emitter.add(
                // Set a random scale between 0.05 and 0.3
                new InitialScale(2, 2),

                // No one lives forever
                new InitialLife(1),

                // Initialize every particle with a random velocity inside a box
                new InitialVelocity(-900, -900, 900, 900),

                // Pick a random texture
                new InitialTexture(0, textures.length - 1),

                // Let particles fall down
                new Acceleration(0, 1000, 0, 1000),

                // Add some rotation over life
                new RotationOverLife(-Math.PI, Math.PI * 2)
            );

            this.addChild(emitter);

            emitter.space = c;
            emitter.scaleX = emitter.scaleY = 0.1;
            emitter.rotation = 3.14 / 4;

            currentDelay += emitterDelay;
        }
    }
}
