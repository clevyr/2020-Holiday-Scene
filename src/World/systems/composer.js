import { EffectComposer } from 'https://unpkg.com/three@0.117.0/examples/jsm/postprocessing/EffectComposer.js';

function createComposer(renderer) {
    const composer = new EffectComposer( renderer );

    return composer;
}

export { createComposer };