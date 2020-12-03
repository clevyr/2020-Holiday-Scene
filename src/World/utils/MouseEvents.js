import {  Raycaster, Vector2, Object3D, LoopOnce, AnimationMixer } from 'https://unpkg.com/three@0.117.0/build/three.module.js';

const raycaster = new Raycaster();
const mouse = new Vector2(1,1);
let camera;
let objsToIntersect = [];
let lastObjSelected;
let actions;
let mixers;
let animations;
let ufoIsPlaying;
let phoneIsPlaying;
let boxOneIsPlaying;
let boxTwoIsPlaying;

export class MouseEvents{
    constructor(_options){
        camera = _options.camera;
        actions = _options.actions;
        mixers = _options.mixers;
        animations = _options.animations;
        this.intersects = [];

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
                if(actions[0].time === 0 && !ufoIsPlaying){
                    ufoIsPlaying = true;
                    actions[0].stop();
                    actions[0].play();
                    actions[2].stop();
                    actions[2].play();
                }
                if(actions[0].time === actions[0].getClip().duration){
                    ufoIsPlaying = false;
                    actions[0].time = 0;
                }
            }
            if(selectedObject.name.includes("Phone")){
                if(actions[1].time === 0 && !phoneIsPlaying){
                    phoneIsPlaying = true;
                    actions[1].stop();
                    actions[1].play();
                }
                if(actions[1].time === actions[1].getClip().duration){
                    phoneIsPlaying = false;
                    actions[1].time = 0;
                }
            }
            if(selectedObject.name === "MESHBox"){
                if(actions[3].time === 0 && !boxOneIsPlaying){
                    boxOneIsPlaying = true;
                    actions[3].stop();
                    actions[3].play();
                }
                if(actions[3].time === actions[3].getClip().duration){
                    boxOneIsPlaying = false;
                    actions[3].time = 0;
                }
            }
            if(selectedObject.name === "MESHBox001"){
                if(actions[4].time === 0 && !boxTwoIsPlaying){
                    boxTwoIsPlaying = true;
                    actions[4].stop();
                    actions[4].play();
                }
                if(actions[4].time === actions[4].getClip().duration){
                    boxTwoIsPlaying = false;
                    actions[4].time = 0;
                }
            }
        }
    }

    add(objToAdd){
        objsToIntersect.push(objToAdd);
    }
}