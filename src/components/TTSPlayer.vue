<template>
    <audio ref="audioPlayer" @ended="onAudioEnded" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const audioPlayer = ref<HTMLAudioElement | null>(null);
const emit = defineEmits(["ended"]);

const playText = async (
    text: string,
    voice: string = "zh-CN-YunyangNeural",
) => {
    if (!text) {
        console.warn("No text to play.");
        onAudioEnded();
        return;
    }

    try {
        const response = await axios.post(
            "https://tts.xj63.fun/v1/audio/speech",
            {
                input: text,
                voice: voice,
            },
            {
                responseType: "blob",
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

defineExpose({
    playText,
});
</script>
