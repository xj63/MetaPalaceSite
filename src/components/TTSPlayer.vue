<template>
    <audio ref="audioPlayer" @ended="onAudioEnded" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    voice: {
        type: String,
        default: "zh-CN-YunyangNeural",
    },
    autoplay: {
        type: Boolean,
        default: false, // 初始不自动播放
    },
});

const audioPlayer = ref<HTMLAudioElement | null>(null);
const emit = defineEmits(["ended"]);

const playAudio = async () => {
    if (!props.text) {
        console.warn("No text to play.");
        return;
    }

    try {
        const response = await axios.post(
            "https://tts.xj63.fun/v1/audio/speech",
            {
                input: props.text,
                voice: props.voice,
            },
            {
                responseType: "blob", // Important: Request a Blob
            },
        );

        const audioBlob = new Blob([response.data], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioPlayer.value) {
            audioPlayer.value.src = audioUrl;
            try {
                await audioPlayer.value.play();
            } catch (error) {
                console.error("Playback failed:", error);
            }
        }
    } catch (error) {
        console.error("TTS Error:", error);
    }
};

const onAudioEnded = () => {
    emit("ended");
};

// 暴露 playAudio 方法
defineExpose({
    playAudio,
});

onMounted(() => {
    if (props.autoplay) {
        playAudio();
    }
});

watch(
    () => props.text,
    () => {
        if (props.autoplay) {
            playAudio();
        }
    },
);
</script>
