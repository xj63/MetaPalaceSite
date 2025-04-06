<template>
    <div class="relative w-full overflow-hidden rounded-lg bg-black/[0.96]">
        <div
            class="absolute flex w-full flex-col items-center justify-center gap-2 p-8 text-center font-heading text-white"
        >
            <span class="text-4xl font-semibold"> 世界模型 </span>
            <span class="font-sans font-light"> 这里吹点牛 </span>
        </div>
        <div class="flex">
            <Spline :scene="sceneUrl" class="mt-24 size-full" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Spline } from "@/components/ui/spline";
const sceneUrl = "/scene.splinecode";
</script>
