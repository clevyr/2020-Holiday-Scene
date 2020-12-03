import { Object3D } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

function createObject() {
    const object = new Object3D();

    return object;
}

export { createObject };