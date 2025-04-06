<template>
    <div
        class="group overflow-hidden"
        draggable="true"
        @dragstart="onDragStart"
        @click="viewArtifact"
    >
        <img
            v-if="artifact.imageUrl.length > 0"
            :src="artifact.imageUrl"
            alt="Artifact Image"
            class="w-full h-auto object-cover group-hover:scale-125 duration-200"
            loading="lazy"
        />
        <div
            class="absolute bottom-0 left-0 w-full bg-white/40 dark:bg-black/40 backdrop-blur-md p-4 text-sm text-gray-800 dark:text-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-in-out select-none"
        >
            {{ artifact.description }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    artifact: {
        type: Object,
        required: true,
    },
});

const emits = defineEmits(["dragstart", "click"]);

const onDragStart = () => {
    emits("dragstart", props.artifact);
};

const viewArtifact = () => {
    emits("click", props.artifact);
};
</script>
