<template>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- 主背景动画 -->
        <div
            class="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 animate-pulse"
        />

        <!-- 光晕效果 -->
        <div class="absolute inset-0">
            <div
                class="absolute -top-1/4 -left-1/4 w-2/3 h-2/3 bg-violet-400/20 rounded-full blur-3xl animate-blob"
            />
            <div
                class="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-purple-400/20 rounded-full blur-3xl animate-blob delay-2000"
            />
        </div>

        <!-- 星星效果 -->
        <div
            v-for="i in 30"
            :key="i"
            class="absolute w-1 h-1 bg-white/60 rounded-full animate-twinkle"
            :style="{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
            }"
        />
    </div>
</template>

<style scoped>
@keyframes blob {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    50% {
        transform: translate(20px, 20px) scale(1.1);
    }
}

.animate-blob {
    animation: blob 7s infinite ease-in-out;
}

.delay-2000 {
    animation-delay: 2s;
}

@keyframes twinkle {
    0%,
    100% {
        opacity: 0.6;
    }
    50% {
        opacity: 1;
    }
}

.animate-twinkle {
    animation: twinkle 3s infinite ease-in-out;
}
</style>
