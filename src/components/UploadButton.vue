<template>
    <div class="space-y-6 p-8">
        <FileUpload
            class="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800"
        >
            <FileUploadGrid />
        </FileUpload>
    </div>
</template>

<script setup lang="ts">
import { FileUpload, FileUploadGrid } from "./ui/file-upload";
</script>
