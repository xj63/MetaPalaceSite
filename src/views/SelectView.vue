<template>
    <div class="flex min-h-screen dark:text-gray-200">
        <!-- 左侧区域 -->
        <div
            class="w-1/3 hidden lg:block bg-gray-100 dark:bg-gray-950 p-4 h-screen overflow-y-auto"
        >
            <ArtifactDetail :artifact="currentArtifact" />
        </div>

        <!-- 右侧区域 -->
        <div class="flex-1 p-4 h-screen overflow-y-auto dark:bg-gray-900">
            <wc-waterfall :gap="4" :cols="cols">
                <template v-for="artifact in artifacts" :key="artifact.id">
                    <ArtifactItem
                        :artifact="artifact"
                        @dragstart="onDragStart"
                        @click="viewArtifact"
                    />
                </template>
            </wc-waterfall>
            <UploadButton @upload="handleUpload" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useArtifactStore } from "../stores";
import ArtifactDetail from "@/components/ArtifactDetail.vue";
import ArtifactItem from "@/components/ArtifactItem.vue";
import UploadButton from "@/components/UploadButton.vue";
import { useRouter } from "vue-router";
import type { Artifact } from "../stores";
import "wc-waterfall";

const artifactStore = useArtifactStore();
const artifacts = computed(() => artifactStore.artifacts);
const currentArtifact = computed(() => artifactStore.currentArtifact);
const router = useRouter();

const cols = ref(3);

const updateCols = () => {
    if (window.innerWidth >= 1280) {
        cols.value = 4;
    } else if (window.innerWidth >= 768) {
        cols.value = 3;
    } else if (window.innerWidth >= 400) {
        cols.value = 2;
    } else {
        cols.value = 1;
    }
};

onMounted(() => {
    artifactStore.setCurrentArtifact(artifactStore.artifacts[0]);
    updateCols();
    window.addEventListener("resize", updateCols);
});

onUnmounted(() => {
    window.removeEventListener("resize", updateCols);
});

const onDragStart = (artifact: Artifact) => {
    artifactStore.setCurrentArtifact(artifact);
};

const viewArtifact = (artifact: Artifact) => {
    artifactStore.setCurrentArtifact(artifact);
    // 在移动端直接跳转到详情页面
    if (window.innerWidth < 1024) {
        router.push(`/detail/${artifact.id}`);
    }
};

const handleUpload = (imageUrl: string) => {
    const newArtifact = {
        id: Date.now().toString(),
        name: "新文物",
        imageUrl,
        description: "新上传的文物描述",
    };
    artifactStore.artifacts.push(newArtifact);
};
</script>
