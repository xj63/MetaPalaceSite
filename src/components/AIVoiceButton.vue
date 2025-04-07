<template>
    <button
        @click="handleClick"
        v-if="!nextAI"
        :disabled="isSpeaking"
        :class="[
            'relative',
            'bg-gradient-to-r',
            'from-blue-500',
            'to-purple-500',
            'text-white',
            'font-bold',
            'py-2',
            'px-4',
            'rounded-full',
            'shadow-lg',
            'hover:from-blue-700',
            'hover:to-purple-700',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-400',
            'transition-all',
            'duration-300',
            'transform',
            'hover:scale-110',
            isSpeaking ? 'opacity-75 cursor-not-allowed' : '',
        ]"
    >
        <span v-if="!isSpeaking">AI语音讲解</span>
        <span v-else>
            {{ statusText }}
            <span
                class="absolute -top-1 left-1/2 -translate-x-1/2 text-xs text-gray-200 animate-pulse"
            >
                ...
            </span>
        </span>

        <!-- TTS Player Component -->
        <TTSPlayer ref="ttsPlayer" @ended="onTTSEnded" />
    </button>
    <NextAI v-else :artifactName="name" :artifactDescription="description" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import TTSPlayer from "@/components/TTSPlayer.vue";
import NextAI from "@/components/NextAI.vue";
import { isApiReady } from "@/api";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rotateModel: {
        type: Function,
        required: true,
    },
});

const isSpeaking = ref(false);
const statusText = ref("正在讲解文物");
const ttsPlayer = ref<InstanceType<typeof TTSPlayer> | null>(null);
const nextAI = ref(false);

const handleClick = async () => {
    isSpeaking.value = true;
    statusText.value = "正在讲解文物";
    props.rotateModel();

    // Start playing the text using the TTSPlayer component
    if (ttsPlayer.value) {
        await ttsPlayer.value.playText(props.description);
    }
};

const onTTSEnded = async () => {
    isSpeaking.value = false;
    statusText.value = "等待语音输入";

    if (!nextAI.value && (await isApiReady())) {
        console.log("next AI");
        nextAI.value = true;
    }
};

defineExpose({
    ttsPlayer,
});
</script>
