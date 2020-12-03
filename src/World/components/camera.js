import { PerspectiveCamera } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

function createCamera() {
    const camera = new PerspectiveCamera(
        6.743368360654265, //fov = Field Of View
        1.5276243093922652, // aspect ratio (dummy value)
        0.1, // near clipping plane
        110.5999984741211, // far clipping plane
    );

    camera.position.set(52, 21, 49);

    return camera;
}

export { createCamera };