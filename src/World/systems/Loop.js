import { Clock } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

const clock = new Clock();

class Loop {
    constructor(camera, scene, renderer, composer, bloomComposer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.composer = composer;
        this.bloomComposer = bloomComposer;
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();

            // this.renderer.render(this.scene, this.camera);
            this.camera.layers.set(1);
            this.bloomComposer.render();
            this.camera.layers.set(0);
            this.composer.render();
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();

        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}

export { Loop }