import * as THREE from "three";
import { scene } from "./main";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";


function degToRad(d){
    return(d * Math.PI/180);
}

export class Garden{

    constructor(id, coords){
        this.id = id;
        this.status = 0;
        this.growing = "None";


        //Group that will hold all the meshes that make up the garden
        const patch = new THREE.Group();
        this.patch = patch;

        //Base for the patch of dirt where the plants will grow from
        const baseGeometry = new THREE.BoxGeometry(3, 0.5, 3);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x5c1e09 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.name = "base";
        base.number = id;
        base.position.y = -2;
        base.position.x += coords.x;
        base.position.z += coords.z;
        base.castShadow = true;
        base.receiveShadow = true;
        this.patch.add(base);

        scene.add(patch);
        this.buildGarden();
    }

    /**
     * Creates the little blocks to make the patch look like it has been tilled  
     */
    buildGarden(){
        const baseGeometry = new THREE.BoxGeometry(0.60, 0.60, 0.60);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8f3d22 });
        var base = this.patch.getObjectByName("base");

        for(var i = 0; i<3; i++){
            this.patch.add(makeTill((i*4 + 1), baseGeometry, baseMaterial,
                 (base.position.x - 1) + i, base.position.y, base.position.z - 0.75));
            this.patch.add(makeTill((i*4 + 2), baseGeometry, baseMaterial,
                 (base.position.x - 1) + i, base.position.y, base.position.z - 0.25));
            this.patch.add(makeTill((i*4 + 3), baseGeometry, baseMaterial,
                 (base.position.x - 1) + i, base.position.y, base.position.z + 0.25));
            this.patch.add(makeTill((i*4 + 4), baseGeometry, baseMaterial,
                 (base.position.x - 1) + i, base.position.y, base.position.z + 0.75));
        }
        function randomRotate(){
            return (degToRad(Math.floor(Math.random() * (360 + 1))));
        }
        function makeTill(id, geometry, material, x, y, z){
            const mesh = new THREE.Mesh(geometry, material.clone());
            mesh.name = "t" + id;
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
            mesh.rotation.x = randomRotate();
            mesh.rotation.y = randomRotate();
            mesh.rotation.z = randomRotate();
            return(mesh);
        }
    }

    /**
     * Adds a plant to the garden
     * @param {String} planting string representing the type of crop that will be planted (either Wheat or Flowers)
     * @returns true or false depending on wether the crop is added successfully/unsuccessfully
     */
    plant(planting){
        if(this.growing != "None"){
            return(false);
        }
        if(planting == "Wheat"){
            if(this.growing == "Flowers"){
                return(false);
            }
            this.growing = "Wheat";
            const dracoLoader = new DRACOLoader();
            const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
            var base = this.patch.getObjectByName("base");
            if(!this.crop){
                this.crop = new THREE.Group();
                this.crop.number = this.patch.getObjectByName("base").number;
            }
            for(var i = 0; i<3; i++){
                for(var j = 0; j<3; j++){
                    addWheat(loader, i, j, this.crop);
                }
            }
            scene.add(this.crop)
            return(true);
        }
        if(planting == "Flowers"){
            if(this.growing == "Wheat"){
                return(false);
            }
            this.growing = "Flowers";
            const dracoLoader = new DRACOLoader();
            const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
            var base = this.patch.getObjectByName("base");
            if(!this.crop){
                this.crop = new THREE.Group();
                this.crop.number = this.patch.getObjectByName("base").number;
            }
            addFlower(loader, 1, base.position.x + 0.7, base.position.z, this.crop);
            addFlower(loader, 2, base.position.x - 0.7, base.position.z + 0.7, this.crop);
            addFlower(loader, 3, base.position.x - 0.7, base.position.z - 0.7, this.crop);

            scene.add(this.crop);
            return(true);
        }

        function addWheat(loader, c1, c2, crop){
            loader.load("./models/Grass.glb", (gltf) => {
                    const wheat = gltf.scene.children[0];

                    wheat.name = "wheat" + (c1*3 + c2 + 1);
                    wheat.rotation.y = randomRotate();
                    wheat.position.y = base.position.y;
                    wheat.position.x = base.position.x + 1;
                    wheat.position.z = base.position.z + 1;

                    var sign = Math.random() < 0.5 ? -1 : 1;
                    var randomFactor = Math.floor(Math.random() * 2 + 1) * 0.1 * sign;
                    switch(c1%3){
                        case(0):
                            switch(c2%3){
                                case(0):
                                    wheat.position.z = (wheat.position.z) + randomFactor;
                                    break;
                                case(1):
                                    wheat.position.z = (wheat.position.z - 1) + randomFactor;
                                    break;
                                case(2):
                                    wheat.position.z = (wheat.position.z - 2) + randomFactor;
                                    break;
                            }
                            wheat.position.x = wheat.position.x + randomFactor;
                            break;
                        case(1):
                            switch(c2%3){
                                case(0):
                                    wheat.position.z = (wheat.position.z) + randomFactor;
                                    break;
                                case(1):
                                    wheat.position.z = (wheat.position.z - 1) + randomFactor;
                                    break;
                                case(2):
                                    wheat.position.z = (wheat.position.z - 2) + randomFactor;
                                    break;
                            }
                            wheat.position.x = (wheat.position.x - 1) + randomFactor;
                            break;
                        case(2):
                            switch(c2%3){
                                case(0):
                                    wheat.position.z = (wheat.position.z) + randomFactor;
                                    break;
                                case(1):
                                    wheat.position.z = (wheat.position.z - 1) + randomFactor;
                                    break;
                                case(2):
                                    wheat.position.z = (wheat.position.z - 2) + randomFactor;
                                    break;
                            }
                            wheat.position.x = (wheat.position.x - 2) + randomFactor;
                            break;
                    }
                    wheat.morphTargetInfluences[0] = 1;
                    crop.add(wheat);
                });
        }
        function addFlower(loader, num, x, z, crop){
            var sign = Math.random() < 0.5 ? -1 : 1;
            var randomFactor = Math.floor(Math.random() * 2 + 1) * 0.1 * sign;
            loader.load("./models/FlowerBottom.glb", (gltf) => {
                const flower = gltf.scene.children[0];

                flower.name = "Bud" + num;
                flower.position.y = base.position.y;
                flower.position.x = x + randomFactor;
                flower.position.z = z + randomFactor;

                flower.morphTargetInfluences[0] = 1;

                crop.add(flower);
            });
            loader.load("./models/FlowerTop.glb", (gltf) => {
                const flower = gltf.scene.children[0];

                flower.name = "Petals" + num;
                flower.position.y = base.position.y+0.5;
                flower.position.x = x + 0.08 + randomFactor;
                flower.position.z = z + randomFactor;

                flower.scale.set(0.01, 0.01, 0.01);
                crop.add(flower);
            });
        }

        function randomRotate(){
            return (degToRad(Math.floor(Math.random() * (360 + 1))));
        }
    }
    
    /**
     * Removes the plant currently growing in the garden
     * @returns True or false depending on wether the crop is removed successfully/unsuccessfully
     */
    cut(){
        if(this.growing == "None"){
            return(false);
        }
        scene.remove(this.crop);
        this.crop = new THREE.Group();
        this.crop.number = this.patch.getObjectByName("base").number;
        this.growing = "None"
        return(true);
    }

    /**
     *  Grows the plant in the garden by modifying it's properties until it reaches the final stage
     */
    grow(){
        if(this.growing == "None"){
            return(false);
        }
        if(this.growing == "Wheat"){
            for(const c of this.crop.children){
                if(c.position.y < -0.52){
                    c.position.y += 0.005;
                }else{
                    if(c.morphTargetInfluences[0] > 0){
                        if(c.morphTargetInfluences[0] < 0.9){
                            c.material.color.setHex(0x517b10);
                        }
                        if(c.morphTargetInfluences[0] < 0.8){
                            c.material.color.setHex(0x598412);
                        }
                        if(c.morphTargetInfluences[0] < 0.7){
                            c.material.color.setHex(0x689316);
                        }
                        if(c.morphTargetInfluences[0] < 0.6){
                            c.material.color.setHex(0x7da61b);
                        }
                        if(c.morphTargetInfluences[0] < 0.5){
                            c.material.color.setHex(0x95ba1f);
                        }
                        if(c.morphTargetInfluences[0] < 0.4){
                            c.material.color.setHex(0xaecc20);
                        }
                        if(c.morphTargetInfluences[0] < 0.3){
                            c.material.color.setHex(0xc7da1d);
                        }
                        if(c.morphTargetInfluences[0] < 0.2){
                            c.material.color.setHex(0xdde516);
                        }
                        if(c.morphTargetInfluences[0] < 0.1){
                            c.material.color.setHex(0xf1ec0a);
                        }
                        c.morphTargetInfluences[0] -= 0.005;
                    }
                }

            }
            return(true);
        }
        if(this.growing == "Flowers"){
            var reBud = new RegExp(/Bud*/);
            var rePet = new RegExp(/Petals*/);
            for(const c of this.crop.children){
                if(c.position.y < -0.95 && reBud.test(c.name)){
                    c.position.y += 0.005;
                }else{
                    if(c.position.y < -0.40 && rePet.test(c.name)){
                        c.position.y += 0.005;
                    }else{
                        if(rePet.test(c.name)){
                            if(c.scale.x < 0.13){
                                c.scale.set(c.scale.x + 0.001, c.scale.y + 0.001, c.scale.z + 0.001);
                            }
                        }
                    }  
                    if(reBud.test(c.name)){
                        if(c.morphTargetInfluences[0] > 0){
                            c.morphTargetInfluences[0] -= 0.005;
                        }
                    }
                }
            }
            return(true);
        }
    }

}

/**
 * Loads some fences as scene decoration
 */
export function setupDecorations(){
    const dracoLoader = new DRACOLoader();
    const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
    loader.load("./models/Fence.glb", (gltf) => {
        const fence = gltf.scene.children[0];
        fence.position.x = 6;
        fence.position.y = -0.80;
        fence.position.z = 4;
        fence.rotation.z = degToRad(90);
        scene.add(fence);
    });
    loader.load("./models/Fence.glb", (gltf) => {
        const fence = gltf.scene.children[0];
        fence.position.x = 6;
        fence.position.y = -0.80;
        fence.position.z = 1;
        fence.rotation.z = degToRad(90);
        scene.add(fence);
    });
    loader.load("./models/Fence.glb", (gltf) => {
        const fence = gltf.scene.children[0];
        fence.position.x = -0;
        fence.position.y = -0.80;
        fence.position.z = -6;
        fence.rotation.z = degToRad(180);
        scene.add(fence);
    });
    loader.load("./models/Fence.glb", (gltf) => {
        const fence = gltf.scene.children[0];
        fence.position.x = -3;
        fence.position.y = -0.80;
        fence.position.z = -6;
        fence.rotation.z = degToRad(180);
        scene.add(fence);
    });
    loader.load("./models/FenceAngle.glb", (gltf) => {
        const fence = gltf.scene.children[0];
        fence.position.x = -4.5;
        fence.position.y = -0.80;
        fence.position.z = 6;
        fence.rotation.z = degToRad(0);
        scene.add(fence);
    });
}


