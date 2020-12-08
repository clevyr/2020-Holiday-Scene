import {  Raycaster, Vector2, Object3D, LoopOnce, AnimationMixer } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

const raycaster = new Raycaster();
const mouse = new Vector2(1,1);
let camera;
let objsToIntersect = [];
let lastObjSelected;
let actions;
let ufoAction,
    ufoBeamAction,
    phoneAction,
    coffeeCupAction,
    boxOneAction,
    boxTwoAction,
    saberOffAction,
    saberOnAction;
let mixers;
let animations;
let ufoIsPlaying;
let phoneIsPlaying;
let boxOneIsPlaying;
let boxTwoIsPlaying;
let saberOffIsPlaying;
let saberOnIsPlaying;

export class MouseEvents{
    constructor(_options){
        camera = _options.camera;
        actions = _options.actions;
        mixers = _options.mixers;
        animations = _options.animations;
        this.intersects = [];

        actions.forEach(_action => {
            if(_action.getClip().name === "MESH.UFOAction"){
                ufoAction = _action;
            }
            else if(_action.getClip().name === "UFOBeam"){
                ufoBeamAction = _action;
            }
            else if(_action.getClip().name === "MESH.PhoneAction"){
                phoneAction = _action;
            }
            else if(_action.getClip().name === "MESH.CoffeeCupAction"){
                coffeeCupAction = _action;
            }
            else if(_action.getClip().name === "MESH.BoxAction.002"){
                boxOneAction = _action;
            }
            else if(_action.getClip().name === "MESH.Box.001Action.001"){
                boxTwoAction = _action;
            }
            else if(_action.getClip().name === "SaberRetract"){
                saberOffAction = _action;
            }
            else if(_action.getClip().name === "SaberExtend"){
                saberOnAction = _action;
            }
        });

        this.container = new Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.container.tick = (delta) => {
            this.update();
        }
    }

    mousemove(event){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    update(){
        let selectedObject;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objsToIntersect);
        if(intersects.length !== 0){
            selectedObject = intersects[0].object;
            console.log(selectedObject.name + " selected");
            if(selectedObject.name.includes("CoffeeCup")){
                if(ufoAction.time === 0 && !ufoIsPlaying){
                    ufoIsPlaying = true;
                    ufoAction.stop();
                    ufoAction.play();
                    ufoBeamAction.stop();
                    ufoBeamAction.play();
                    coffeeCupAction.stop();
                    coffeeCupAction.play();
                }
                if(ufoAction.time === ufoAction.getClip().duration){
                    ufoIsPlaying = false;
                    ufoAction.time = 0;
                }
            }
            if(selectedObject.name.includes("Phone")){
                if(phoneAction.time === 0 && !phoneIsPlaying){
                    phoneIsPlaying = true;
                    phoneAction.stop();
                    phoneAction.play();
                }
                if(phoneAction.time === phoneAction.getClip().duration){
                    phoneIsPlaying = false;
                    phoneAction.time = 0;
                }
            }
            if(selectedObject.name === "MESHBox"){
                if(boxOneAction.time === 0 && !boxOneIsPlaying){
                    boxOneIsPlaying = true;
                    boxOneAction.stop();
                    boxOneAction.play();
                }
                if(boxOneAction.time === boxOneAction.getClip().duration){
                    boxOneIsPlaying = false;
                    boxOneAction.time = 0;
                }
            }
            if(selectedObject.name === "MESHBox001"){
                if(boxTwoAction.time === 0 && !boxTwoIsPlaying){
                    boxTwoIsPlaying = true;
                    boxTwoAction.stop();
                    boxTwoAction.play();
                }
                if(boxTwoAction.time === boxTwoAction.getClip().duration){
                    boxTwoIsPlaying = false;
                    boxTwoAction.time = 0;
                }
            }
            if(selectedObject.name === "Cylinder.015_0"){
                if(saberOffAction.time === 0 && !saberOffIsPlaying &&
                    saberOnAction.time === saberOnAction.getClip().duration){
                    saberOffIsPlaying = true;
                    saberOffAction.stop();
                    saberOffAction.play();
                    saberOnAction.time = 0;
                    console.log("Turning off");
                }
                if(saberOffAction.time === saberOffAction.getClip().duration){
                    saberOffIsPlaying = false;
                    saberOnAction.stop();
                    saberOnAction.play();
                    saberOffAction.time = 0;
                    console.log("Turning on");
                }
                
            }
        }
    }

    add(objToAdd){
        objsToIntersect.push(objToAdd);
    }

    returnAction(actionArray, actionName){
        actionArray.forEach(element => {
            if(element.getClip().name === actionName){
                console.log("Found " + element.getClip().name);
                return element;
            }
        });
    }
}