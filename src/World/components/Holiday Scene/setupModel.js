import { AnimationMixer, LoopOnce, NumberKeyframeTrack, VectorKeyframeTrack, AnimationClip } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

function setupModel(data) {
    const mixers = [];
    const actions = [];
    const animations = data.animations;

    const model = data.scene;

    let ufoClip = null, 
        ufoBeamClip = null,
        phoneClip = null, 
        coffeeCupClip = null, 
        lightSaberOffClip = null,
        lightSaberOnClip = null,
        boxOneClip = null, 
        boxTwoClip = null;

    const ufoBeamTimes = [0, 4.167, 4.5083, 7.225, 7.167, 8.125]; // INPUT CORRECT TIMES
    const ufoBeamValues = [0, 0, 0.7, 0.7, 0, 0];
    const ufoBeamOpacityKF = new NumberKeyframeTrack('.material.opacity', ufoBeamTimes, ufoBeamValues);
    ufoBeamClip = new AnimationClip('UFOBeam', -1, [ufoBeamOpacityKF]);

    const lightSaberOffTimes = [0, 0.5];
    const lightSaberOffValues = [1, 1, 1, 1, 0, 1];
    const lightSaberOffKF = new VectorKeyframeTrack('.scale', lightSaberOffTimes, lightSaberOffValues);
    lightSaberOffClip = new AnimationClip("SaberRetract", -1, [lightSaberOffKF]);

    const lightSaberOnTimes = [0, 0.5];
    const lightSaberOnValues = [1, 0, 1, 1, 1, 1];
    const lightSaberOnKF = new VectorKeyframeTrack('.scale', lightSaberOnTimes, lightSaberOnValues);
    lightSaberOnClip = new AnimationClip("SaberExtend", -1, [lightSaberOnKF]);

    data.animations.forEach((anim) => {
        if (anim.name === "MESH.UFOAction") {
            ufoClip = anim;
        } else if (anim.name === 'MESH.PhoneAction') {
            phoneClip = anim;
        } else if (anim.name === "MESH.CoffeeCupAction") {
            coffeeCupClip = anim;
        } else if (anim.name === "MESH.BoxAction.002") {
            boxOneClip = anim;
        } else if (anim.name === "MESH.Box.001Action.001") {
            boxTwoClip = anim;
        }
    });

    let ufo = null,
        ufoBeam = null,
        phone = null,
        coffeeCup = null,
        lightSaber = null,
        boxOne = null,
        boxTwo = null;

    model.traverse( function( node ) {
        if (node.name === "MESHUFO") {
            ufo = node;
        }
        else if(node.name === "MESHBeam2"){
            ufoBeam = node;
        }
        else if(node.name === "MESHCoffeeCup"){
            coffeeCup = node;
        }
        else if (node.name === "MESHLightsaberBladeBloomMe") {
            lightSaber = node;
            lightSaber.scale.set(1,0,1);
        }
        else if (node.name === "MESHBox") {
            boxOne = node;
        }
        else if (node.name === "MESHBox001") {
            boxTwo = node;
        }
        else if (node.name === "MESHPhone") {
            phone = node;
        }
    });

    const ufoMixer = new AnimationMixer(ufo);
    const ufoAction = ufoMixer.clipAction(ufoClip);
    ufoAction.setLoop(LoopOnce);
    actions.push(ufoAction);
    // action.play();
    mixers.push(ufoMixer);

    ufoBeam.material.transparent = true;
    ufoBeam.material.needsUpdate = true;
    const ufoBeamMixer = new AnimationMixer(ufoBeam);
    const ufoBeamAction = ufoBeamMixer.clipAction(ufoBeamClip);
    ufoBeamAction.setLoop(LoopOnce);
    actions.push(ufoBeamAction);
    mixers.push(ufoBeamMixer);

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

    const lightSaberOffAction = lightSaberMixer.clipAction(lightSaberOffClip);
    lightSaberOffAction.setLoop(LoopOnce);
    lightSaberOffAction.clampWhenFinished = true;
    lightSaberOffAction.time = lightSaberOffAction.getClip().duration;
    actions.push(lightSaberOffAction);
    // lightSaberAction.play();

    const lightSaberOnAction = lightSaberMixer.clipAction(lightSaberOnClip);
    lightSaberOnAction.setLoop(LoopOnce);
    lightSaberOnAction.clampWhenFinished = true;
    actions.push(lightSaberOnAction);
    // lightSaberAction.play();
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