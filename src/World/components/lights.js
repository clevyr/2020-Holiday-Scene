import { 
    AmbientLight,
    PointLight,
    DirectionalLight,
    HemisphereLight,
    RectAreaLight,
} from 'https://unpkg.com/three@0.117.0/build/three.module.js';
import { RectAreaLightHelper } from 'https://unpkg.com/three@0.117.0/examples/jsm/helpers/RectAreaLightHelper.js';

function createLights() {
    const ambientLight = new AmbientLight('white', 6);

    const topPointLight = new PointLight('white', 20);
    topPointLight.castShadow = true;
    topPointLight.shadow.bias = -0.0001;
    topPointLight.shadow.mapSize.width = 512 * 2;
    topPointLight.shadow.mapSize.height = 512 * 2;
    topPointLight.shadow.radius = 16;
    const pointLight = new PointLight('white', 20);
    // pointLight.castShadow = true;
    // pointLight.shadow.bias = -0.0001;
    // pointLight.shadow.mapSize.width = 1024 * 2;
    // pointLight.shadow.mapSize.height = 1024 * 2;
    // pointLight.shadow.radius = 8;

    const mainLight = new DirectionalLight('white', 12); // (color, intensity)
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.mapSize.width = 512 * 4;
    mainLight.shadow.mapSize.height = 512 * 4;
    mainLight.shadow.radius = 16;

    const backAreaLight = new RectAreaLight('white', 4, 4, 4);
    const backRectAreaLightHelper = new RectAreaLightHelper(backAreaLight);
    backAreaLight.add(backRectAreaLightHelper);

    const areaLight = new RectAreaLight('white', 8, 7, 7);
    const rectAreaLightHelper = new RectAreaLightHelper(areaLight);
    areaLight.add(rectAreaLightHelper);

    topPointLight.position.set(0, 8, 0);
    pointLight.position.set(8.5, 6, -1.5);

    mainLight.position.set(4, 2, 0);

    backAreaLight.position.set(8.5, 6, -1.5);
    backAreaLight.rotation.set(0, 0, 0);
    backAreaLight.lookAt(0, 4.6, 0);

    areaLight.position.set(0, 8, 0);
    areaLight.rotation.set(-90, 0, 0);

    return { ambientLight, topPointLight, pointLight, mainLight, backAreaLight, areaLight };
}

export { createLights };