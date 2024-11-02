//�쐬�ҁF��炵����
//�쐬�J�n���F2024/10/14

// -- Initialize.js --

// Three.js�V�[���̏�����
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

