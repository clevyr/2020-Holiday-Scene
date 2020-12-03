import { GLTFLoader } from 'https://unpkg.com/three@0.117.0/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './setupModel.js';

async function loadHolidayScene() {
    const loader = new GLTFLoader();

    const [holidaySceneData] = await Promise.all([
        loader.loadAsync('./assets/models/Holiday-Scene/ChristmasScene-2-ReducedElements.gltf'),
    ]);

    console.log('Holiday Scene Data: ', holidaySceneData);

    const holidaySceneSetup = setupModel(holidaySceneData);
    const holidayScene = holidaySceneSetup.model;
    const mixers = holidaySceneSetup.mixers;
    const actions = holidaySceneSetup.actions;
    const animations = holidaySceneSetup.animations;
    // holidayScene.position.set(0, 0, 0);
    // holidayScene.scale.set(1, 1, 1);

    return { 
        holidayScene, mixers, actions, animations
    };
}

export { loadHolidayScene };