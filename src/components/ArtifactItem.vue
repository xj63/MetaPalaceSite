<template>
    <img
        :src="artifact.imageUrl"
        alt="Artifact Image"
        class="w-full h-auto object-cover artifact-item"
        draggable="true"
        @dragstart="onDragStart"
        @click="viewArtifact"
    />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

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
    transform: scale(1.05);
}
</style>
