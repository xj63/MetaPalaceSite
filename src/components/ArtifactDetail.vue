<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">文物展示</h2>
            <button
                v-if="artifact"
                @click="navigateToDetail"
                class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-indigo-700 transition duration-300 ease-in-out"
            >
                查看 3D 模型
            </button>
        </div>
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
import { useRouter } from "vue-router";

const props = defineProps({
    artifact: {
        type: Object as () => Record<string, any> | null,
        default: null,
    },
});

const router = useRouter();

const navigateToDetail = () => {
    router.push(`/detail/${props.artifact?.id}`);
};
</script>
