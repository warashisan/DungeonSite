//�쐬�ҁF��炵����
//�쐬�J�n���F2024/10/14

// -- MainScript.js --

//�Q��
import { initializeScene } from './Initialize.js';

//����������
const {scene, camera, renderer } = initializeScene();

// �Ɩ��̒ǉ�
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(20, 15, 1).normalize();
scene.add(light);

// ���ʃW�I���g�����쐬���Ēn������\��
const groundGeometry = new THREE.PlaneGeometry(1000, 1000); 
const groundMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.1, 0.1, 0.1) });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2;
ground.position.y = 0; 

//�A�j���[�V�����~�L�T�[�̒�`
let mixer

// �V�[���ɒn�����i�n�ʁj��ǉ�
scene.add(ground);

//�w�i�F�ǉ�
scene.background = new THREE.Color(0.5,1,1);

// GLTF���f���̃��[�h
const loader = new THREE.GLTFLoader();
loader.load('https://warashisan.github.io/data/gif/Ghost_1,0.glb', 
    function (gltf) {
        scene.add(gltf.scene);

        //�A�j���[�V�������܂܂�Ă���ꍇ�A�Đ�����
        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
        }
        animate();
    }, 
    undefined, 
    function (error) {
        console.error(error);
    }
);

// �A�j���[�V�����֐�
function animate() {
    requestAnimationFrame(animate);
    //�A�j���[�V�������܂܂�Ă���΍X�V
    if (mixer) {
        mixer.update(0.006);//�K�؂ȍX�V���x��ݒ�
    }
    renderer.render(scene, camera);
}