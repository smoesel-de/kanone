import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons";

const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 25, 5, 25 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 3, 0 );
controls.enablePan = false;
controls.enableDamping = true;
controls.minPolarAngle = 1; // radians
controls.maxPolarAngle = Math.PI / 1.9; // radians
controls.update();

const size = 20;
const divisions = 20;

const helper = new THREE.GridHelper( size, divisions );
// scene.add( helper );

setupLights();
loadModel();
renderer.setAnimationLoop( animate );

let send = false;

function animate() {
    controls.update();

    if (send) {
        max.position.x += 0.15;
        max.position.y = getY(max.position.x);
        max.rotateX(0.005);
        controls.target.set(max.position.x, max.position.y, max.position.z);

        if (max.position.x  > 35) {
            send = false;
        }
    }

    // scene.rotation.y += 0.001;
    renderer.render( scene, camera );
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight( 0xffb300, 2 ); // soft white light
    scene.add( ambientLight );
    const directionalLight = new THREE.DirectionalLight( 0xffeca8, 3);
    directionalLight.castShadow = true;
    directionalLight.position.set( 5, 5, 5 );
    scene.add( directionalLight );
    directionalLight.target.updateMatrixWorld(true);

    const spotLight1 = new THREE.SpotLight( 0xffb300, 150 );
    spotLight1.position.set( 6, 3, 3.5 );
    spotLight1.castShadow = true;
    spotLight1.angle = 5;
    spotLight1.target.position.set(6, 0, 3.5);
    spotLight1.penumbra = 0.8;
    scene.add( spotLight1 );
    spotLight1.target.updateMatrixWorld(true);

    const spotLight2 = new THREE.SpotLight( 0xffb300, 150 );
    spotLight2.position.set( 6, 3, -3.5 );
    spotLight2.castShadow = true;
    spotLight2.angle = 5;
    spotLight2.target.position.set(6, 0, -4.5);
    spotLight2.penumbra = 0.8;
    scene.add( spotLight2 );
    spotLight2.target.updateMatrixWorld(true);
}

let max;

function loadModel() {
// Load a glTF resource
    loader.load(
        // resource URL
        '/models/kanone.glb',
        // called when the resource is loaded
        function ( gltf ) {

            const model = gltf.scene;
            model.position.set( -32.5, -1.2, 0 );
            model.rotateZ(Math.PI / 180 * 20);
            console.log(model.children);

            scene.add( model );

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );


    loader.load(
        // resource URL
        '/models/max/scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {

            max = gltf.scene;
            max.position.set( -30, getY(-30), 0 );
            max.rotateY(Math.PI / 180 * 90);
            max.rotateX(Math.PI / 180 * (90-31.5));
            console.log(max.children);
            max.scale.set( 0.15, 0.15, 0.15 );
            controls.target.set(max.position.x, max.position.y, max.position.z);

            scene.add( max );

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

document.querySelector('.button').addEventListener('click', function () {
    if (document.querySelector('.button').classList.contains('disabled')) {
        return;
    }
    document.querySelector('.button').classList.add('disabled');

    send = true;

    // setTimeout(function () {
    //     document.querySelector('.button').classList.remove('disabled');
    //     document.querySelector('.button').innerHTML = 'Send';
    // }, 3000)
})

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function getY(x) {
    return (-0.0097)*Math.pow(x, 2)+10;
}