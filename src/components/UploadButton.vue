<template>
    <div
        class="upload-item flex items-center justify-center border-2 border-dashed border-gray-300 p-4 cursor-pointer"
    >
        <input
            type="file"
            @change="uploadArtifact"
            class="hidden"
            ref="fileInput"
        />
        <button
            @click="triggerFileInput"
            class="text-gray-500 dark:text-gray-300"
        >
            上传文物图片
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineEmits } from "vue";

const emits = defineEmits(["upload"]);

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const uploadArtifact = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                emits("upload", e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
};
</script>

<style scoped>
.upload-item {
    transition: background-color 0.2s;
}

.upload-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>
