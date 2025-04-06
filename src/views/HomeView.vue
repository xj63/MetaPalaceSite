<script setup lang="ts">
import { useRouter } from "vue-router";
import BackgroundEffect from "@/components/BackgroundEffect.vue";

const router = useRouter();
const navigateToSelect = () => router.push("/select");
</script>

<template>
    <div
        @click="navigateToSelect"
        class="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-purple-700 dark:from-violet-800 dark:to-purple-900 cursor-pointer overflow-hidden"
    >
        <BackgroundEffect />

        <img
            src="/metapalace.jpg"
            alt="Transparent Overlay"
            class="absolute top-0 left-0 w-full h-full object-cover opacity-50 translate-y-1/6"
            style="pointer-events: none"
        />

        <div class="relative z-10 text-center space-y-8 -translate-y-28">
            <h1
                class="text-5xl md:text-7xl font-bold text-white tracking-wider"
            >
                MetaPalace
            </h1>

            <div class="space-y-4">
                <div class="h-px w-24 md:w-32 mx-auto bg-white/30" />
                <p class="text-lg md:text-xl text-white/90">
                    探索文物的数字世界
                </p>
            </div>
        </div>

        <p
            class="absolute bottom-12 text-white/70 text-sm md:text-base animate-bounce"
        >
            点击任意位置进入
        </p>
    </div>
</template>
