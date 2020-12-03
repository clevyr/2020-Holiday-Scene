import { AnimationMixer, LoopOnce } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

function setupModel(data) {
    const mixers = [];
    const actions = [];
    const animations = data.animations;

    const model = data.scene;
    const ufoClip = data.animations[0];
    const phoneClip = data.animations[1];
    const coffeeCupClip = data.animations[2];
    const lightSaberClip = data.animations[3];
    const boxOneClip = data.animations[4];
    const boxTwoClip = data.animations[5];
    // const camera = data.cameras[0];

    const ufo = data.scene.children[7];
    const phone = data.scene.children[8];
    const coffeeCup = data.scene.children[9];
    const lightSaber = data.scene.children[11].children[2];
    const boxOne = data.scene.children[27];
    const boxTwo = data.scene.children[28];

    const ufoMixer = new AnimationMixer(ufo);
    const ufoAction = ufoMixer.clipAction(ufoClip);
    ufoAction.setLoop(LoopOnce);
    actions.push(ufoAction);
    // action.play();
    mixers.push(ufoMixer);

    const phoneMixer = new AnimationMixer(phone);
    const phoneAction = phoneMixer.clipAction(phoneClip);
    phoneAction.setLoop(LoopOnce);
    actions.push(phoneAction);
    // phoneAction.play();
    mixers.push(phoneMixer);

    const coffeeCupMixer = new AnimationMixer(coffeeCup);
    const coffeeCupAction = coffeeCupMixer.clipAction(coffeeCupClip);
    coffeeCupAction.setLoop(LoopOnce);
    actions.push(coffeeCupAction);
    // coffeeCupAction.play();
    mixers.push(coffeeCupMixer);

    const lightSaberMixer = new AnimationMixer(lightSaber);
    const lightSaberAction = lightSaberMixer.clipAction(lightSaberClip);
    lightSaberAction.play();
    mixers.push(lightSaberMixer);

    const boxOneMixer = new AnimationMixer(boxOne);
    const boxOneAction = boxOneMixer.clipAction(boxOneClip);
    boxOneAction.setLoop(LoopOnce);
    actions.push(boxOneAction);
    mixers.push(boxOneMixer);

    const boxTwoMixer = new AnimationMixer(boxTwo);
    const boxTwoAction = boxTwoMixer.clipAction(boxTwoClip);
    boxTwoAction.setLoop(LoopOnce);
    actions.push(boxTwoAction);
    mixers.push(boxTwoMixer);

    console.log(actions);

    model.tick = (delta) => {
        for(let i = 0; i < mixers.length; i++){
            mixers[i].update(delta);
        }
        //  mixer.update(delta);
    };

    return { model, mixers, actions, animations };
}

export { setupModel };