import "../scss/style.scss";

import noise from './noise.gif';

import * as THREE from 'three';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { gsap } from 'gsap';
import { ScrollTrigger} from 'gsap/ScrollTrigger';
import displaceMap from './DisplacementMap.png';



gsap.registerPlugin(ScrollTrigger);
const hdr = new URL('./studio_small_07_4k.hdr', import.meta.url)

const txtLoader = new THREE.TextureLoader();
const displace = txtLoader.load(displaceMap)

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

const preloader = document.querySelector("#loader");
const hide = document.querySelector("#hide");

const loader = new RGBELoader();
loader.load(hdr, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    
    scene.environment = texture;

    preloader.classList.add("hideMe");
    hide.style.visibility = "visible";
    setTimeout(() => {
        preloader.style.display = "none";
    }, 500)
    gsapAnim();
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


//sphere animation
const tl = gsap.timeline();

tl.to(sphere.position, {
    ease: "power1.inOut",
    z: -15,
    y: 4,
    x: 5
}).to(sphere.position, {
    ease: "power1.inOut",
    z: 0,
    y: 0,
    x: 0
}).to(sphere.position, {
    ease: "power1.inOut",
    z: 2,
    y: 3,
    x: 0
})

ScrollTrigger.create({
    animation: tl,
    target: "body",
    scrub: true,
    pin: true,
    anticipatePin: 1
})



window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



const scrollClick = document.querySelector("#scrollClick");

const scrollAbout = document.querySelector("#scroll1");
const scrollTech = document.querySelector("#scroll2");
const scrollFoot = document.querySelector("#scroll3");
const me = document.querySelector(".me");
let currentSect = 0;

scrollClick.addEventListener("click", () => {
    if(currentSect === 0) {
        scrollAbout.scrollIntoView({block: "center"});
    }

    if(currentSect === 1) {
        scrollTech.scrollIntoView({block: "center"});
    }

    if(currentSect === 2) {
        scrollFoot.scrollIntoView({block: "end"});
        
    }

});


//cursor func.
const cursor = document.querySelector("#cursor");

const toTop = document.querySelector("#toTop");
const githubPage = document.querySelector("#githubPage");


function scaleCursorUp() {
    cursor.style.width = "75px";
    cursor.style.height = "75px";
}

function scaleCursorDown() {
    cursor.style.width = "45px";
    cursor.style.height = "45px";
}

scrollClick.addEventListener("mouseover", scaleCursorUp)

scrollClick.addEventListener("mouseout", scaleCursorDown)

toTop.addEventListener("mouseover", scaleCursorUp)

toTop.addEventListener("mouseout", scaleCursorDown)

githubPage.addEventListener("mouseover", scaleCursorUp)

githubPage.addEventListener("mouseout", scaleCursorDown)


//scroll func.
toTop.addEventListener("click", () => {
    me.scrollIntoView({block: "center"});
})

window.addEventListener("scroll", () => {
    if(scrollAbout.getBoundingClientRect().top > -400 && scrollAbout.getBoundingClientRect().top < 400) {
        if(scrollClick.classList.contains("hideMe")){
            scrollClick.classList.remove("hideMe")
        }
        currentSect = 1;
    } else if (scrollTech.getBoundingClientRect().top > 0 && scrollTech.getBoundingClientRect().top < 400) {
        if(scrollClick.classList.contains("hideMe")){
            scrollClick.classList.remove("hideMe")
        }
        currentSect = 2;
    } else if (me.getBoundingClientRect().top > 0 && me.getBoundingClientRect().top < 400) {
        if(scrollClick.classList.contains("hideMe")){
            scrollClick.classList.remove("hideMe")
        }
        currentSect = 0;
    } else if (scrollFoot.getBoundingClientRect().top > 749) {
        if(scrollClick.classList.contains("hideMe")){
            scrollClick.classList.remove("hideMe")
        }
        currentSect = 3;
    }

    if(currentSect === 3) {
        scrollClick.classList.add("hideMe")
    }
});

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursor.style.left = `${posX}px`;
    cursor.style.top = `${posY}px`;
})

//gsap animation

const gsapAnim = function() {
    gsap.from("h1", {duration: 1,opacity: 0, y: 30, scrollTrigger:{
        trigger: ".me",
        toggleActions: "play reset play reset"
    }});
    gsap.from(".me", {delay: 0.3, duration: 1,opacity: 0, y: 30, scrollTrigger:{
        trigger: ".me",
        toggleActions: "play reset play reset"
    }});
    gsap.from(".about h2", {duration: 1,opacity: 0, y: 30, scrollTrigger:{
        trigger: ".about",
        toggleActions: "play reset play reset"
    }});
    gsap.from(".about p", {delay: 0.3, duration: 1,opacity: 0, y: 30, scrollTrigger:{
        trigger: ".about",
        toggleActions: "play reset play reset"
    }});
    gsap.from(".techBox", {duration: 1,opacity: 0, y: 30, scrollTrigger:{
        trigger: ".tech",
        toggleActions: "play reset play reset"
    }});
    gsap.from(".techList img", {duration: 1,opacity: 0, y: 30, stagger: 0.2, scrollTrigger:{
        trigger: ".tech",
        toggleActions: "play reset play reset"
    }});
    gsap.from("footer span ", {duration: 1,opacity: 0, y: 30, stagger: 0.2, scrollTrigger:{
        trigger: "footer",
        toggleActions: "play reset play reset"
    }});
}
  

