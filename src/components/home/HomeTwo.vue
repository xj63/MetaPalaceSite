<template>
    <div class="flex flex-col items-center justify-center">
        <ParticleImage
            class="w-screen"
            image-src="/metapalace.jpg"
            :responsive-width="true"
        />
    </div>
</template>

<script setup lang="ts">
import { ParticleImage } from "@/components/ui/particle-image";
</script>
