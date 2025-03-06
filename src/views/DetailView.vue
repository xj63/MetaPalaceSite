<template>
    <div class="relative min-h-screen bg-black">
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useArtifactStore } from "@/stores";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const route = useRoute();
const artifactStore = useArtifactStore();
const artifactId = route.params.id as string;
const artifact = computed(() =>
    artifactStore.artifacts.find((a) => a.id === artifactId),
);

const canvasContainer = ref<HTMLDivElement | null>(null);
const loading = ref(true);

onMounted(() => {
    let scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        model: THREE.Group,
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

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // 添加多个强光源
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight2.position.set(-5, 5, 5);
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight3.position.set(5, -5, 5);
        scene.add(directionalLight3);

        const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight4.position.set(5, 5, -5);
        scene.add(directionalLight4);

        const directionalLight5 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight5.position.set(-5, -5, 5);
        scene.add(directionalLight5);

        const directionalLight6 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight6.position.set(-5, 5, -5);
        scene.add(directionalLight6);

        const directionalLight7 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight7.position.set(5, -5, -5);
        scene.add(directionalLight7);

        const directionalLight8 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight8.position.set(-5, -5, -5);
        scene.add(directionalLight8);

        // 加载模型
        const loader = new GLTFLoader();
        loader.load(
            `https://assets.metapalace.xj63.fun/glb/${artifactId}.glb`,
            (gltf) => {
                model = gltf.scene;
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
            },
        );

        // 添加 OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // 启用阻尼效果
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.minDistance = 0.5;
        controls.maxDistance = 20;
        controls.maxPolarAngle = Math.PI / 2;

        // 监听窗口大小变化
        window.addEventListener("resize", onWindowResize, false);
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

    onUnmounted(() => {
        window.removeEventListener("resize", onWindowResize);
        if (canvasContainer.value) {
            canvasContainer.value.removeChild(renderer.domElement);
        }
    });
});
</script>
