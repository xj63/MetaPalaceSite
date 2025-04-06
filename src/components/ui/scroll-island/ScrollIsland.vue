<template>
    <MotionConfig
        :transition="{
            duration: 0.7,
            type: 'spring',
            bounce: 0.5,
        }"
    >
        <Transition name="fade">
            <div
                v-show="isVisible"
                :class="
                    cn(
                        'fixed left-1/2 top-12 z-[999] -translate-x-1/2 bg-primary/90 backdrop-blur-lg border-radius',
                        $props.class,
                    )
                "
                @click="() => (open = !open)"
            >
                <motion.div
                    id="motion-id"
                    layout
                    :initial="{
                        height: props.height,
                        width: 0,
                    }"
                    :animate="{
                        height: open && isSlotAvailable ? 'auto' : props.height,
                        width: open && isSlotAvailable ? 320 : 260,
                    }"
                    class="bg-natural-900 relative cursor-pointer overflow-hidden text-secondary"
                >
                    <header
                        class="gray- flex h-11 cursor-pointer items-center gap-2 px-4"
                    >
                        <AnimatedCircularProgressBar
                            :value="scrollPercentage * 100"
                            :min="0"
                            :max="100"
                            :circle-stroke-width="10"
                            class="w-6"
                            :show-percentage="false"
                            :duration="0.3"
                            :gauge-secondary-color="
                                isDark ? '#6b728055' : '#6b728099'
                            "
                            :gauge-primary-color="isDark ? 'black' : 'white'"
                        />
                        <h1 class="grow text-center font-bold">{{ title }}</h1>
                        <NumberFlow
                            :value="scrollPercentage"
                            :format="{
                                style: 'percent',
                            }"
                            locales="en-US"
                        />
                    </header>
                    <motion.div
                        v-if="isSlotAvailable"
                        class="mb-2 flex h-full max-h-60 flex-col gap-1 overflow-y-auto px-4 text-sm"
                    >
                        <slot />
                    </motion.div>
                </motion.div>
            </div>
        </Transition>
    </MotionConfig>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/vue";
import { useColorMode } from "@vueuse/core";
import { motion, MotionConfig } from "motion-v";
import { computed, onMounted, onUnmounted, ref, useSlots, nextTick } from "vue";
import { AnimatedCircularProgressBar } from "../animated-circular-progressbar";

interface Props {
    class?: string;
    title?: string;
    height?: number;
    debounceDelay?: number; // 添加 debounceDelay prop
}

const props = withDefaults(defineProps<Props>(), {
    class: "",
    title: "Progress",
    height: 44,
    debounceDelay: 3000, // 默认延迟 3s
});

const open = ref(false);
const slots = useSlots();

const scrollPercentage = ref(1);
const isVisible = ref(false); // 控制组件显示/隐藏
const isDark = ref(false);
const isSlotAvailable = computed(() => !!slots.default);
const borderRadius = computed(() => `${props.height / 2}px`);

let timeoutId: number | null = null;

const showIsland = () => {
    isVisible.value = true;
};

const hideIsland = () => {
    isVisible.value = false;
};

// 防抖函数
const debouncedHideIsland = () => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        hideIsland();
    }, props.debounceDelay);
};

function handleScroll() {
    showIsland();
    updatePageScroll();
    debouncedHideIsland();
}

onMounted(() => {
    isDark.value = useColorMode().value == "dark";

    const home = document.getElementById("home");
    if (home) {
        home.addEventListener("scroll", handleScroll);
        updatePageScroll();
        nextTick(() => {
            debouncedHideIsland(); // 初始隐藏
        });
    }
});

function updatePageScroll() {
    const home = document.getElementById("home");
    if (home) {
        scrollPercentage.value =
            home.scrollTop / (home.scrollHeight - window.innerHeight);
    }
}

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
});
</script>

<style scoped>
.border-radius {
    border-radius: v-bind(borderRadius);
}
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
