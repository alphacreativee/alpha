import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger.js";
import * as dat from "https://cdn.skypack.dev/dat.gui";

gsap.registerPlugin(ScrollTrigger);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("chess-3d").appendChild(renderer.domElement);

// Scene and light
const scene = new THREE.Scene();
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
// Thêm một đèn DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// GLTF loader
let chess;
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
loader.setDRACOLoader(dracoLoader);

// Mảng chứa các vị trí target theo section
const arrPositionModel = [
  {
    id: "section-specialize",
    position: { x: 0, y: 0.5, z: 20 },
    rotation: { x: 0, y: 0.56, z: 0 },
    scale: { x: 1.5, y: 1.5, z: 1.5 },
  },
  // Thêm section khác tại đây nếu cần
];

// Tải mô hình
loader.load(
  "./assets/images/use/chess_queen.glb",
  function (gltf) {
    chess = gltf.scene;
    chess.position.set(0, 0, 15);
    chess.scale.set(0.5, 0.5, 0.5);
    scene.add(chess);

    // Tạo GUI
    const gui = new dat.GUI();
    const positionFolder = gui.addFolder("Position");
    positionFolder.add(chess.position, "x", -100, 100).name("X");
    positionFolder.add(chess.position, "y", -100, 100).name("Y");
    positionFolder.add(chess.position, "z", -100, 100).name("Z");
    positionFolder.open();

    const rotationFolder = gui.addFolder("Rotation");
    rotationFolder
      .add(chess.rotation, "x", -Math.PI, Math.PI)
      .name("X")
      .step(0.01);
    rotationFolder
      .add(chess.rotation, "y", -Math.PI, Math.PI)
      .name("Y")
      .step(0.01);
    rotationFolder
      .add(chess.rotation, "z", -Math.PI, Math.PI)
      .name("Z")
      .step(0.01);
    rotationFolder.open();

    const scaleFolder = gui.addFolder("Scale");
    scaleFolder.add(chess.scale, "x", 0.1, 3).name("X").step(0.01);
    scaleFolder.add(chess.scale, "y", 0.1, 3).name("Y").step(0.01);
    scaleFolder.add(chess.scale, "z", 0.1, 3).name("Z").step(0.01);
    scaleFolder.open();

    // ScrollTrigger animation
    arrPositionModel.forEach((item) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: `#${item.id}`,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        })
        .to(chess.position, {
          x: item.position.x,
          y: item.position.y,
          z: item.position.z,
          ease: "power2.out",
        })
        .to(
          chess.rotation,
          {
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z,
            ease: "power2.out",
          },
          0
        )
        .to(
          chess.scale,
          {
            x: item.scale.x,
            y: item.scale.y,
            z: item.scale.z,
            ease: "power2.out",
          },
          0
        );
    });

    // Tùy chọn: Xoay nhẹ mô hình khi scroll
    ScrollTrigger.create({
      trigger: "#section-specialize",
      start: "top bottom",
      end: "bottom top",
      markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const targetScale = 0.5 + progress * 0.85;
        const targetRotation = progress * Math.PI * 2;

        gsap.to(chess.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.1,
          overwrite: true,
          transformOrigin: "bottom",
        });

        gsap.to(chess.rotation, {
          y: targetRotation,
          duration: 0.1,
          overwrite: true,
        });
      },
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Lỗi tải mô hình GLTF:", error);
  }
);

// Render loop
const reRender3d = () => {
  requestAnimationFrame(reRender3d);
  renderer.render(scene, camera);
};
reRender3d();

// Responsive resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
