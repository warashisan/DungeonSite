//�쐬�ҁF��炵����
//�쐬�J�n���F2024/10/14

// -- MainScript.js --

//�Q��
import { initializeScene } from './Initialize.js';
import { globalValiable } from '../Data/data.js';

//����������
const {scene, camera, renderer} = initializeScene();
//���[�_�[�̒ǉ�
const loader = new THREE.GLTFLoader();
// Raycaster�ƃ}�E�X�ʒu�̏�����
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//Main Class Valiable
let loadedObject;

// �Ɩ��̒ǉ�
const Firstlight = new THREE.DirectionalLight(0xffffff, 1);
Firstlight.position.set(20, 15, 1).normalize();
scene.add(Firstlight);
const Secondlight = new THREE.DirectionalLight(0xffffff, 4  );
Secondlight.position.set(0,10, -12).normalize();
scene.add(Secondlight);

// ���ʃW�I���g�����쐬���Ēn������\��
const groundGeometry = new THREE.PlaneGeometry(1000, 1000); 
const groundMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.1, 0.1, 0.1) });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2;
ground.position.y = 0; 
// �V�[���ɒn�����i�n�ʁj��ǉ�
scene.add(ground);
//�w�i�F�ǉ�
scene.background = new THREE.Color(0.5,1,1);
//�A�j���[�V�����~�L�T�[�̒�`
let mixer;

function main(){
    LoadModel();
    Animate();
    MoveCamera();
}

//���f���̃��[�h�֐�
function LoadModel(){
    loader.load(
        'https://warashisan.github.io/Resource/3dObject/ClickButton.glb',
        function (gltf) {
            loadedObject = gltf.scene;

            loadedObject.traverse((child) =>{
                if(child.isMesh){
                    child.material.color.set(0xffffff);
                }
            });

            scene.add(loadedObject);
        },
        undefined,
        function (error) {
            console.error('Error loading model:', error);
        }
    );
    loader.load('https://warashisan.github.io/Resource/gif/Ghost_1,0.glb', 
        function (gltf) {
            gltf.scene.position.z = 3;
            scene.add(gltf.scene);

            //�A�j���[�V�������܂܂�Ă���ꍇ�A�Đ�����
            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(gltf.scene);
                    gltf.animations.forEach((clip) => {
                        mixer.clipAction(clip).play();
                    });
            }
        }, 
        undefined, 
        function (error) {
            console.error(error);
        }
    );
}

// �}�E�X���[�u�C�x���g�����X�i�[�ɒǉ�
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onClick, false);

// �}�E�X���������Ƃ��̃C�x���g����
function onMouseMove(event) {
    // �}�E�X���W�𐳋K�� (-1����+1�͈̔�)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycaster�œ����蔻��
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(loadedObject, true);

    if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000); // �ԂɕύX
    } else if (loadedObject) {
        loadedObject.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(0xffffff); // ���̐F�ɖ߂�
            }
        });
    }
}

// �N���b�N�C�x���g����
let scaleFactor = 1.5; // �g��k���̔{��
function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(loadedObject, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.scale.x === 1) {
            obj.scale.set(scaleFactor, scaleFactor, scaleFactor); // �g��
            displayLog(globalValiable.status);
            globalValiable.status = 'running';
        } else {
            obj.scale.set(1, 1, 1); // ���̃T�C�Y�ɖ߂�
            displayLog(globalValiable.status);
            globalValiable.status = 'standing';
        }
    }
}

// �A�j���[�V�����֐��i�S�[�X�j
function Animate() {
    requestAnimationFrame(Animate);
    //�A�j���[�V�������܂܂�Ă���΍X�V
    if (mixer) {
        mixer.update(0.006);//�K�؂ȍX�V���x��ݒ�
    }
    renderer.render(scene, camera);
}

let count = 0;
//�J������������������
function MoveCamera(){
    if(count >= 1000)return;
    camera.position.y += 0.006;
    count++;
    renderer.render(scene,camera);
    requestAnimationFrame(MoveCamera);
}

//���O�̒ǉ�
function displayLog(message) {
    const logDiv = document.getElementById('log');
    const newLog = document.createElement('p'); // �V�������O�s��ǉ�
    newLog.textContent = message;
    logDiv.appendChild(newLog); // ���O�G���A�ɒǉ�

    // ���O�G���A�������ς��ɂȂ����玩���I�ɃX�N���[��
    logDiv.scrollTop = logDiv.scrollHeight;
}

window.onload = main;