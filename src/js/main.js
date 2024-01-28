import "../scss/style.scss";

import * as THREE from 'three';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { gsap } from 'gsap';
import { ScrollTrigger} from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);
const hdr = new URL('./studio_small_07_4k.hdr', import.meta.url)

const txtLoader = new THREE.TextureLoader();
const displace = txtLoader.load('../src/js/DisplacementMap.png')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.querySelector("#bg"),
    powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;


camera.position.set(0, 0, 10)

const loader = new RGBELoader();
loader.load(hdr, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;


    scene.environment = texture;
    // scene.background = texture;
})

const geometry = new THREE.IcosahedronGeometry(1 , 500); 
const material = new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    // color: 0xff0000,
    displacementMap: displace,
    displacementScale: 3,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.position.z = 6;

// postprocessing 
let composer = new EffectComposer( renderer );
const renderScene = new RenderPass( scene, camera );

// postprocessing effect
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.1, 0.1 );
bloomPass.threshold = 0;
bloomPass.strength = 0.1;
bloomPass.radius = 2;

const params = {
    shape: 4,
    radius: 10,
    rotateR: Math.PI / 12,
    rotateB: Math.PI / 12 * 2,
    rotateG: Math.PI / 12 * 3,
    scatter: 0,
    blending: 1,
    blendingMode: 4,
    greyscale: false,
    disable: false
};
const halftonePass = new HalftonePass( window.innerWidth, window.innerHeight, params );

const outputPass = new OutputPass();

composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( halftonePass );
composer.addPass( outputPass ); 
// add composer.render() to animate fn

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.002;
    // sphere.rotation.z += 0.001;
    renderer.render(scene, camera);
    composer.render();

}



animate();

const tl = gsap.timeline();


tl.to(sphere.position, {
    scrollTrigger: {
        target: 'body',
        scrub: true
    },
    z: -15,
    y: 4,
    x: 5
});

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

