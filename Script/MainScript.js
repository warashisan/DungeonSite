//作成者：わらしさん
//作成開始日：2024/10/14

// -- MainScript.js --

//参照
import { initializeScene } from './Initialize.js';
import { globalValiable } from '../Data/data.js';

//初期化処理
const {scene, camera, renderer} = initializeScene();
//ローダーの追加
const loader = new THREE.GLTFLoader();
// Raycasterとマウス位置の初期化
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//Main Class Valiable
let loadedObject;

// 照明の追加
const Firstlight = new THREE.DirectionalLight(0xffffff, 1);
Firstlight.position.set(20, 15, 1).normalize();
scene.add(Firstlight);
const Secondlight = new THREE.DirectionalLight(0xffffff, 4  );
Secondlight.position.set(0,10, -12).normalize();
scene.add(Secondlight);

// 平面ジオメトリを作成して地平線を表現
const groundGeometry = new THREE.PlaneGeometry(1000, 1000); 
const groundMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.1, 0.1, 0.1) });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2;
ground.position.y = 0; 
// シーンに地平線（地面）を追加
scene.add(ground);
//背景色追加
scene.background = new THREE.Color(0.5,1,1);
//アニメーションミキサーの定義
let mixer;

function main(){
    LoadModel();
    Animate();
    MoveCamera();
}

//モデルのロード関数
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

            //アニメーションが含まれている場合、再生する
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

// マウスムーブイベントをリスナーに追加
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onClick, false);

// マウスが動いたときのイベント処理
function onMouseMove(event) {
    // マウス座標を正規化 (-1から+1の範囲)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycasterで当たり判定
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(loadedObject, true);

    if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000); // 赤に変更
    } else if (loadedObject) {
        loadedObject.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(0xffffff); // 元の色に戻す
            }
        });
    }
}

// クリックイベント処理
let scaleFactor = 1.5; // 拡大縮小の倍率
function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(loadedObject, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.scale.x === 1) {
            obj.scale.set(scaleFactor, scaleFactor, scaleFactor); // 拡大
            displayLog(globalValiable.status);
            globalValiable.status = 'running';
        } else {
            obj.scale.set(1, 1, 1); // 元のサイズに戻す
            displayLog(globalValiable.status);
            globalValiable.status = 'standing';
        }
    }
}

// アニメーション関数（ゴース）
function Animate() {
    requestAnimationFrame(Animate);
    //アニメーションが含まれていれば更新
    if (mixer) {
        mixer.update(0.006);//適切な更新速度を設定
    }
    renderer.render(scene, camera);
}

let count = 0;
//カメラを少しずつ動かす
function MoveCamera(){
    if(count >= 1000)return;
    camera.position.y += 0.006;
    count++;
    renderer.render(scene,camera);
    requestAnimationFrame(MoveCamera);
}

//ログの追加
function displayLog(message) {
    const logDiv = document.getElementById('log');
    const newLog = document.createElement('p'); // 新しいログ行を追加
    newLog.textContent = message;
    logDiv.appendChild(newLog); // ログエリアに追加

    // ログエリアがいっぱいになったら自動的にスクロール
    logDiv.scrollTop = logDiv.scrollHeight;
}

window.onload = main;