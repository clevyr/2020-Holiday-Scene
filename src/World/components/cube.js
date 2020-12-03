import { 
    BoxBufferGeometry, 
    MathUtils, 
    Mesh, 
    MeshStandardMaterial,
    TextureLoader,
} from 'https://unpkg.com/three@0.117.0/build/three.module.js';

function createMaterial() {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(
        '/assets/textures/uv-test-bw.png',
    );

    const material = new MeshStandardMaterial({map: texture});

    return material;
}

function createCube() {
    const geometry = new BoxBufferGeometry(1, 1, 1);
    const material = createMaterial();
    const cube = new Mesh(geometry, material);

    // cube.rotation.set(-0.5, -0.1, 0.8);
    cube.position.set(5,1,0)
    cube.castShadow = true;
    cube.receiveShadow = true;

    const radiansPerSecond = MathUtils.degToRad(30);

    cube.tick = (delta) => {
        cube.rotation.z += radiansPerSecond * delta;
        cube.rotation.x += radiansPerSecond * delta;
        cube.rotation.y += radiansPerSecond * delta;
    }

    return cube;
}

export { createCube };