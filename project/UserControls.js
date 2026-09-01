import * as THREE from "three";
import { actions, camera, gardens, raycaster, renderer, scene } from "./main";


/**
 * Uses the raycaster to check which garden has been clicked then calls the appropriate function on it depending
 * on which action is currently active in the gui
 */
export function raycasterSelect(event){

    const coords = new THREE.Vector2(
        (event.clientX/renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY/renderer.domElement.clientHeight) * 2 - 1),
    )
    raycaster.setFromCamera(coords, camera);

    const intersected = raycaster.intersectObjects(scene.children, true);
    var selected = 0;
    if(intersected.length > 0 && intersected[0].object.name != "floor"){
        for(var i = 0; i<intersected.length; i++){
            if(intersected[i].object.name == "base"){
                selected = intersected[i].object;
            }
        }
        if(!selected){
            return;
        }
        var selectedGarden = gardens[selected.number];

        var actionResult;
        if(actions.Action == "Cut"){
            actionResult = selectedGarden.cut();
            if(actionResult){
                console.log("Crop removed successfully from garden: " + selected.number);
            }else{
                console.log("Nothing to cut")
            }
        }
        if(actions.Action == "Plant Flower"){
            actionResult = selectedGarden.plant("Flowers");
            if(actionResult){
                console.log("Flowers successfully planted in garden: " + selected.number);
            }else{
                console.log("Garden " + selected.number + " is already growing something else");
            }
        }
        if(actions.Action == "Plant Wheat"){
            actionResult = selectedGarden.plant("Wheat");
            if(actionResult){
                console.log("Wheat successfully planted in garden: " + selected.number);
            }else{
                console.log("Garden " + selected.number + " is already growing something else");
            }
        }
    }
}

export function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}