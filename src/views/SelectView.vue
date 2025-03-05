<template>
    <div class="flex min-h-screen">
        <!-- 左侧区域 -->
        <div class="w-1/3 hidden lg:block bg-gray-100 p-4">
            <ArtifactDetail :artifact="currentArtifact" />
        </div>

        <!-- 右侧区域 -->
        <div class="flex-1 p-4 h-screen overflow-y-auto">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ArtifactItem
                    v-for="artifact in artifacts"
                    :key="artifact.id"
                    :artifact="artifact"
                    @dragstart="onDragStart"
                    @click="viewArtifact"
                />
                <UploadButton @upload="handleUpload" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useArtifactStore } from "../stores";
import ArtifactDetail from "@/components/ArtifactDetail.vue";
import ArtifactItem from "@/components/ArtifactItem.vue";
import UploadButton from "@/components/UploadButton.vue";
import { useRouter } from "vue-router";
import type { Artifact } from "../stores";

const artifactStore = useArtifactStore();
const artifacts = computed(() => artifactStore.artifacts);
const currentArtifact = computed(() => artifactStore.currentArtifact);
const router = useRouter();

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
