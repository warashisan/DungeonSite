//作成者：わらしさん
//作成開始日：2024/10/14

// -- MainScript.js --

//参照
import { initializeScene } from './Initialize.js';

//初期化処理
const {scene, camera, renderer } = initializeScene();

// 照明の追加
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(20, 15, 1).normalize();
scene.add(light);

// 平面ジオメトリを作成して地平線を表現
const groundGeometry = new THREE.PlaneGeometry(1000, 1000); 
const groundMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.1, 0.1, 0.1) });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2;
ground.position.y = 0; 

//アニメーションミキサーの定義
let mixer

// シーンに地平線（地面）を追加
scene.add(ground);

//背景色追加
scene.background = new THREE.Color(0.5,1,1);

// GLTFモデルのロード
const loader = new THREE.GLTFLoader();
loader.load('https://warashisan.github.io/data/gif/Ghost_1,0.glb', 
    function (gltf) {
        scene.add(gltf.scene);

        //アニメーションが含まれている場合、再生する
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

// アニメーション関数
function animate() {
    requestAnimationFrame(animate);
    //アニメーションが含まれていれば更新
    if (mixer) {
        mixer.update(0.006);//適切な更新速度を設定
    }
    renderer.render(scene, camera);
}