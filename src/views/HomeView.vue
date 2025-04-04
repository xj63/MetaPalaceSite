<script setup lang="ts">
import { useRouter } from "vue-router";
import HomeOne from "@/components/HomeOne.vue";

const router = useRouter();
const navigateToSelect = () => router.push("/select");
</script>

<template>
    <div class="h-screen overflow-y-scroll">
        <HomeOne></HomeOne>
    </div>
</template>
