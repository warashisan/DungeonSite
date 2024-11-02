//作成者：わらしさん
//作成開始日：2024/10/14

// -- Initialize.js --

// Three.jsシーンの初期化
export function initializeScene(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 1.7, -10);
    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return {scene,camera,renderer};
}

