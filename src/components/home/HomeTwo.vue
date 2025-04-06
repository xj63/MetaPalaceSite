<template>
    <div class="relative flex flex-col items-center justify-center h-screen">
        <ParticleImage
            class="w-screen"
            image-src="/metapalace.jpg"
            :responsive-width="true"
        />
        <div class="absolute bottom-8 mx-auto w-2/3">
            <TextRevealCard class="max-w-full">
                <template #revealText>
                    <p
                        class="bg-[#323238] bg-clip-text py-4 text-sm font-bold text-transparent md:py-10 md:text-[3rem] sm:py-6 sm:text-3xl text-center"
                    >
                        死脑子快想写啥
                    </p>
                </template>
                <template #text>
                    <p
                        :style="{
                            textShadow: '4px 4px 15px rgba(0,0,0,0.5)',
                        }"
                        class="bg-gradient-to-b from-white to-neutral-300 bg-clip-text py-4 text-sm font-bold text-white md:py-10 md:text-[3rem] sm:py-6 sm:text-3xl text-center"
                    >
                        怎么还要写第二句话
                    </p>
                </template>
            </TextRevealCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ParticleImage } from "@/components/ui/particle-image";
import { TextRevealCard } from "../ui/text-reveal-card";
</script>
