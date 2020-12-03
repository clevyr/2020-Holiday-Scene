import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createCube } from './components/cube.js';
import { createObject } from './components/object.js';
import { loadHolidayScene } from './components/Holiday Scene/HolidayScene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { createComposer } from './systems/composer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { Shadows } from './components/Shadows.js';
import { MouseEvents } from './utils/MouseEvents.js';

import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@0.117.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { SSAOPass } from 'https://unpkg.com/three@0.117.0/examples/jsm/postprocessing/SSAOPass.js';
import { RenderPass } from 'https://unpkg.com/three@0.117.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.117.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.117.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'https://unpkg.com/three@0.117.0/examples/jsm/libs/dat.gui.module.js';
import { Vector2, ShaderMaterial, Layers } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

// These variables are module-scoped: we cannot access
// them from outside the module
let camera;
let bloomCamera;
let controls;
let renderer;
let composer;
let scene;
let loop;
let shadows;
let mouseEvents;

const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new Layers();
bloomLayer.set(BLOOM_SCENE);

const bloomParams = {
    exposure: 1,
    bloomStrength: 2.5,
    bloomThreshold: 0,
    bloomRadius: 0
};

class World {
    constructor(container) {
        camera = createCamera();
        bloomCamera = camera.clone();
        scene = createScene();
        renderer = createRenderer();
        composer = createComposer(renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        const cube = createCube();
        RectAreaLightUniformsLib.init();

        const { ambientLight, topPointLight, pointLight, mainLight, backAreaLight, areaLight } = createLights();

        scene.add(ambientLight, topPointLight, backAreaLight, areaLight, mainLight);

        const resizer = new Resizer(container, camera, renderer, composer);
    }

    async init() {
        shadows = new Shadows({renderer: renderer, camera: camera})

        const holidaySceneData = await loadHolidayScene();
        const holidayScene = holidaySceneData.holidayScene;
        const actions = holidaySceneData.actions;
        const mixers = holidaySceneData.mixers;
        const animations = holidaySceneData.animations;
        mouseEvents = new MouseEvents({camera, actions, mixers, animations});
        renderer.domElement.addEventListener("mousemove", mouseEvents.mousemove, true);
        window.holiday = holidayScene;

        holidayScene.traverse( function( node ) {

            if ( node.isMesh ) { 
                node.castShadow = true; 
                node.receiveShadow = true; 
                if(node.material.map) node.material.map.anisotropy = 16; 
            }

            if(node.name === "MESHUFO"){
                node.castShadow = false; 
            }

            if(node.name === "MESHCoffeeCup"){
                node.castShadow = false; 
            }

            if(node.name === "MESHSky"){
                node.castShadow = false;
            }

            if(node.name === "MESHSnow-NormalMap001"){
                node.castShadow = false;
            }

            if(node.name.includes("Bulb")){
                node.layers.enable(BLOOM_SCENE);
            }

            if(node.name === "LIGHTTop"){
                node.castShadow = false; 
                node.receiveShadow = false; 
            }

            if(node.name === "LIGHTFill"){
                node.castShadow = false; 
                node.receiveShadow = false; 
            }

            if(node.name === "LIGHTBack"){
                node.castShadow = false; 
                node.receiveShadow = false; 
            }

            if(node.name === "CAMCam2-WideViewRes001"){
                node.castShadow = false; 
                node.receiveShadow = false; 
            }

            if(node.name === "MESHType"){
                node.castShadow = false; 
                node.receiveShadow = false; 
            }
    
        } );

        // UFO
        shadows.add(holidayScene.children[7], { sizeX: 1, sizeZ: 1, offsetY: 0.25, alpha: 1 });
        // Coffee Cup
        shadows.add(holidayScene.children[8], { sizeX: 1, sizeZ: 1, offsetY: 0.25, alpha: 0.1 });
        // Tree
        shadows.add(holidayScene.children[4].children[0], { sizeX: 1.5, sizeZ: 1.5, offsetY: 0.25, alpha: 1 });

        const shadowObject = createObject();
        shadowObject.add(shadows.container);
        console.log(shadowObject);

        mouseEvents.add(holidayScene.children[8]);
        mouseEvents.add(holidayScene.children[9]);
        mouseEvents.add(holidayScene.children[11].children[0]);
        mouseEvents.add(holidayScene.children[27]);
        mouseEvents.add(holidayScene.children[28]);

        const mouseEventsObject = createObject();
        mouseEventsObject.add(mouseEvents.container);

        scene.add(shadowObject, holidayScene);

        const renderScene = new RenderPass( scene, camera );

        // const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        // bloomPass.threshold = bloomParams.bloomThreshold;
        // bloomPass.strength = bloomParams.bloomStrength;
        // bloomPass.radius = bloomParams.bloomRadius;

        // // composer = new EffectComposer( renderer );
        // composer.addPass( renderScene );
        // composer.addPass( bloomPass );

        // START HERE
        const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = bloomParams.bloomThreshold;
        bloomPass.strength = bloomParams.bloomStrength;
        bloomPass.radius = bloomParams.bloomRadius;

        const bloomComposer = createComposer( renderer );
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass( renderScene );
        bloomComposer.addPass( bloomPass );

        const finalPass = new ShaderPass(
            new ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: document.getElementById( 'vertexshader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
                defines: {}
            } ), "baseTexture"
        );
        finalPass.needsSwap = true;

        const finalComposer = createComposer( renderer );
        finalComposer.addPass( renderScene );
        finalComposer.addPass( finalPass );

        // const width = window.innerWidth;
        // const height = window.innerHeight;

        // composer = new EffectComposer( renderer );

        // const ssaoPass = new SSAOPass( scene, camera, width, height );
        // ssaoPass.kernelRadius = 16;
        // composer.addPass( ssaoPass );

        // Init gui
        // const gui = new GUI();

        // gui.add( ssaoPass, 'output', {
        //     'Default': SSAOPass.OUTPUT.Default,
        //     'SSAO Only': SSAOPass.OUTPUT.SSAO,
        //     'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
        //     'Beauty': SSAOPass.OUTPUT.Beauty,
        //     'Depth': SSAOPass.OUTPUT.Depth,
        //     'Normal': SSAOPass.OUTPUT.Normal
        // } ).onChange( function ( value ) {

        //     ssaoPass.output = parseInt( value );

        // } );
        // gui.add( ssaoPass, 'kernelRadius' ).min( 0 ).max( 32 );
        // gui.add( ssaoPass, 'minDistance' ).min( 0.001 ).max( 0.02 );
        // gui.add( ssaoPass, 'maxDistance' ).min( 0.01 ).max( 0.3 );

        loop = new Loop(camera, scene, renderer, finalComposer, bloomComposer);
        loop.updatables.push(controls, holidayScene, shadowObject.children[0], mouseEventsObject.children[0]);
    }

    render() {
        renderer.render(scene, camera);
        // composer.render();
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };