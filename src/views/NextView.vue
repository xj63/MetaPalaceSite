<script setup lang="ts">
import HomeOne from "@/components/home/HomeOne.vue";
import HomeTwo from "@/components/home/HomeTwo.vue";
import HomeThree from "@/components/home/HomeThree.vue";
import { ScrollIsland } from "@/components/ui/scroll-island";
</script>

<template>
    <div id="home" class="h-screen overflow-y-scroll snap-y">
        <ScrollIsland title="Meta Palace">
            <div class="my-3 flex flex-col gap-2">
                <a href="#one"># One</a>
                <a href="#two"># Two</a>
                <a href="#three"># Three</a>
            </div>
        </ScrollIsland>
        <div class="snap-start h-screen" id="one">
            <HomeOne></HomeOne>
        </div>
        <div class="snap-start h-screen" id="two">
            <HomeTwo></HomeTwo>
        </div>
        <div class="snap-start h-screen" id="three">
            <HomeThree></HomeThree>
        </div>
    </div>
</template>
