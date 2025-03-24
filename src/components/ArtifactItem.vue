<template>
    <img
        v-if="artifact.imageUrl.length > 0"
        :src="artifact.imageUrl"
        alt="Artifact Image"
        class="w-full h-auto object-cover artifact-item"
        draggable="true"
        loading="lazy"
        @dragstart="onDragStart"
        @click="viewArtifact"
    />
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

<style scoped>
.artifact-item {
    cursor: pointer;
    transition: transform 0.2s;
}

.artifact-item:hover {
    transform: scale(1.02);
}
</style>
