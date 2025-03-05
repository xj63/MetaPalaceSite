<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">文物展示</h2>
        <div v-if="artifact" class="artifact-detail">
            <img
                :src="artifact.imageUrl"
                alt="Artifact Image"
                class="w-full h-auto mb-4"
            />
            <h3 class="text-xl font-semibold">{{ artifact.name }}</h3>
            <p>{{ artifact.description }}</p>
        </div>
        <div v-else class="text-gray-500">拖拽文物到此处查看详情</div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
    artifact: {
        type: Object,
        default: null,
    },
});
</script>
