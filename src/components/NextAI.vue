<template>
    <button
        @click="toggleRecord"
        :disabled="isProcessing"
        :class="[
            'relative',
            'bg-gradient-to-r',
            'from-green-500',
            'to-teal-500',
            'text-white',
            'font-bold',
            'py-2',
            'px-4',
            'rounded-full',
            'shadow-lg',
            'hover:from-green-700',
            'hover:to-teal-700',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-green-400',
            'transition-all',
            'duration-300',
            'transform',
            'hover:scale-110',
            isProcessing ? 'opacity-75 cursor-not-allowed' : '',
        ]"
    >
        <span v-if="!isRecording && !isProcessing">与AI对话</span>
        <span v-else-if="isRecording">
            正在录音
            <span
                class="absolute -top-1 left-1/2 -translate-x-1/2 text-xs text-gray-200 animate-pulse"
            >
                ...
            </span>
        </span>
        <span v-else-if="isProcessing">
            AI思考中
            <span
                class="absolute -top-1 left-1/2 -translate-x-1/2 text-xs text-gray-200 animate-pulse"
            >
                ...
            </span>
        </span>
        <span v-else>请再次按下结束录音</span>
    </button>

    <audio ref="audioPlayer" />
    <TTSPlayer ref="ttsPlayer" @ended="onTTSEnded" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { aichat } from "@/api";
import TTSPlayer from "@/components/TTSPlayer.vue";

const props = defineProps({
    artifactName: {
        type: String,
        required: true,
    },
    artifactDescription: {
        type: String,
        required: true,
    },
});

const isRecording = ref(false);
const isProcessing = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<BlobPart[]>([]);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const ttsPlayer = ref<InstanceType<typeof TTSPlayer> | null>(null);

const toggleRecord = async () => {
    if (!mediaRecorder.value) return;

    if (!isRecording.value) {
        startRecording();
    } else {
        stopRecording();
        isProcessing.value = true;
        isRecording.value = true;
    }
    isRecording.value = !isRecording.value;
};

const startRecording = async () => {
    audioChunks.value = [];
    if (mediaRecorder.value) {
        mediaRecorder.value.start();
    }
};

const stopRecording = () => {
    if (mediaRecorder.value) {
        mediaRecorder.value.stop();
    }
};

const onTTSEnded = () => {
    console.log("TTS playback ended");
    isProcessing.value = false;
};

onMounted(async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        mediaRecorder.value = new MediaRecorder(stream, {
            mimeType: "audio/webm",
        });

        mediaRecorder.value.ondataavailable = (event) => {
            audioChunks.value.push(event.data);
        };

        mediaRecorder.value.onstop = async () => {
            const audioBlob = new Blob(audioChunks.value, {
                type: "audio/webm",
            });
            const audioFile = new File([audioBlob], "user_audio.webm", {
                type: "audio/webm",
            });

            try {
                const aiResponse = await aichat(audioFile, props.artifactName);
                console.log("AI Response:", aiResponse);
                if (ttsPlayer.value) {
                    await ttsPlayer.value.playText(aiResponse);
                }
            } catch (error) {
                console.error("Error during AI chat:", error);
                alert("与AI通信时发生错误，请重试。");
            } finally {
                audioChunks.value = [];
            }
        };
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("无法访问麦克风，请检查权限设置。");
    }
});
</script>
