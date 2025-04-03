<template>
    <div
        class="relative min-h-screen bg-black"
        @touchend="handleTouchStart"
        @mousedown="handleTouchStart"
    >
        <div ref="canvasContainer" class="absolute inset-0"></div>
        <div
            v-if="loading"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white"
        >
            加载中...
        </div>
        <div
            class="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm text-white"
        >
            <h2 class="text-2xl font-bold">{{ artifact?.name }}</h2>
            <p>{{ artifact?.description }}</p>
        </div>

        <!-- AI 语音交互按钮 -->
        <div class="absolute bottom-4 right-4">
            <AIVoiceButton
                :name="artifact?.name || ''"
                :description="artifact?.description || ''"
                :rotateModel="rotateModel"
                ref="aiVoiceButton"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArtifactStore } from "@/stores";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import AIVoiceButton from "@/components/AIVoiceButton.vue"; // Import the AIVoiceButton component

const route = useRoute();
const router = useRouter();
const artifactStore = useArtifactStore();
const artifactId = route.params.id as string;
const artifact = computed(() =>
    artifactStore.artifacts.find((a) => a.id === artifactId),
);

const canvasContainer = ref<HTMLDivElement | null>(null);
const loading = ref(true);
const aiVoiceButton = ref<InstanceType<typeof AIVoiceButton> | null>(null);
let model: THREE.Group; // 定义 model 变量
let animationFrameId: number;
const currentRotation = ref(0); // 保存当前旋转角度

const rotateModel = () => {
    if (!model) return; // 如果 model 未定义，则直接返回

    let start = 0;
    const initialRotation = currentRotation.value; // 获取起始角度

    const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        model.rotation.y = initialRotation + (progress / 60000) * Math.PI * 2; // 60秒旋转一圈

        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
};

const stopRotateModel = () => {
    cancelAnimationFrame(animationFrameId);
    if (model) {
        currentRotation.value = model.rotation.y; // 保存当前旋转角度
    }
};

const handleTouchStart = () => {
    stopRotateModel();
};

onMounted(() => {
    let scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        controls: OrbitControls;

    const init = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.value?.appendChild(renderer.domElement);

        // 添加环境光和多个强光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        const lightPositions: [number, number, number][] = [
            [5, 5, 5],
            [-5, 5, 5],
            [5, -5, 5],
            [5, 5, -5],
            [-5, -5, 5],
            [-5, 5, -5],
            [5, -5, -5],
            [-5, -5, 5],
        ];
        lightPositions.forEach((pos) => {
            const light = new THREE.DirectionalLight(0xffffff, 2);
            light.position.set(...pos);
            scene.add(light);
        });

        // 加载模型
        const loader = new GLTFLoader();
        loader.load(
            `/resources/glb/${artifactId}.glb`,
            (gltf) => {
                model = gltf.scene; // 保存模型引用
                scene.add(model);
                loading.value = false;

                // 调整相机位置以适应模型
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const aspect = window.innerWidth / window.innerHeight;
                const margin = 1.2; // 边距系数，1.2 表示留出 20% 的边距

                const cameraZ =
                    Math.abs(maxDim / 2 / Math.tan(fov / 2)) * margin;

                // 根据屏幕的宽度和高度调整相机位置
                const fitHeightDistance = cameraZ / aspect;
                const fitWidthDistance = cameraZ;
                const distance = Math.max(fitHeightDistance, fitWidthDistance);

                camera.position.set(center.x, center.y, distance + center.z);
                camera.lookAt(center);

                const minZ = box.min.z;
                const cameraToFarEdge =
                    minZ < 0 ? -minZ + distance : distance - minZ;

                camera.far = cameraToFarEdge * 3;
                camera.updateProjectionMatrix();

                if (controls) {
                    controls.target = center;
                    controls.update();
                }

                animate();
                // 初始化currentRotation
                currentRotation.value = model.rotation.y;
            },
            undefined,
            () => {
                // 当加载失败时返回上一页面
                router.back();
            },
        );

        // 添加 OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // 启用阻尼效果
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 0.5;
        controls.maxDistance = 3;
        controls.maxPolarAngle = Math.PI / 2;

        // 监听窗口大小变化
        window.addEventListener("resize", onWindowResize);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();
    // 加载完成后才开始旋转
    onMounted(() => {
        if (model) {
            rotateModel();
        }
    });

    onUnmounted(() => {
        stopRotateModel();
        window.removeEventListener("resize", onWindowResize);
        if (canvasContainer.value) {
            canvasContainer.value.removeChild(renderer.domElement);
        }
    });
});
</script>
