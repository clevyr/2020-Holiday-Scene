import { 
    WebGLRenderer, 
    sRGBEncoding, 
    LinearToneMapping,
    ReinhardToneMapping, 
    CineonToneMapping,
    ACESFilmicToneMapping,
    BasicShadowMap, 
    PCFShadowMap, 
    PCFSoftShadowMap, 
    VSMShadowMap } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });

    renderer.toneMapping = ReinhardToneMapping;
    renderer.outputEncoding = sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.Type = PCFSoftShadowMap;

    return renderer;
}

export { createRenderer };