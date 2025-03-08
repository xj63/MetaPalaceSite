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
import { ref } from "vue";
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
const audioChunks = ref<Float32Array[]>([]); // Store Float32Array
const audioPlayer = ref<HTMLAudioElement | null>(null);
const ttsPlayer = ref<InstanceType<typeof TTSPlayer> | null>(null);
let audioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let stream: MediaStream | null = null;

const toggleRecord = async () => {
    if (isProcessing.value) return; // Prevent multiple clicks during processing

    if (!isRecording.value) {
        startRecording();
    } else {
        await stopRecording(); // Await the stopRecording function
    }
};

const startRecording = async () => {
    isRecording.value = true;
    audioChunks.value = [];
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1); // bufferSize, inchannel, outchannel

        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.onaudioprocess = function (event) {
            if (!isRecording.value) return;

            const data = event.inputBuffer.getChannelData(0); // Float32Array
            audioChunks.value.push(new Float32Array(data));
        };
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("无法访问麦克风，请检查权限设置。");
        isRecording.value = false; // Ensure recording is stopped on error
        isProcessing.value = false;
        cleanup(); // Cleanup resources on error
    }
};

const stopRecording = async () => {
    isRecording.value = false;
    isProcessing.value = true;

    if (scriptProcessor) {
        scriptProcessor.disconnect();
    }

    if (audioContext) {
        await audioContext.close();
    }

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }

    try {
        const wavBlob = writeWav(
            audioChunks.value,
            audioContext?.sampleRate || 44100,
        ); // Use a default sample rate if audioContext is null
        const audioFile = new File([wavBlob], "user_audio.wav", {
            type: "audio/wav",
        });

        const aiResponse = await aichat(audioFile, props.artifactName);
        console.log("AI Response:", aiResponse);
        if (ttsPlayer.value) {
            await ttsPlayer.value.playText(aiResponse);
        }
    } catch (error) {
        console.error("Error during AI chat:", error);
        alert("与AI通信时发生错误，请重试。");
    } finally {
        cleanup();
    }
};

const onTTSEnded = () => {
    console.log("TTS playback ended");
    isProcessing.value = false;
};

const cleanup = () => {
    audioChunks.value = [];
    audioContext = null;
    scriptProcessor = null;
    stream = null;
};

// Function to convert Float32Array to Int16Array (required for WAV)
function floatTo16BitPCM(
    output: DataView,
    offset: number,
    input: Float32Array,
) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
}

// Function to create WAV file
function writeWav(samplesArray: Float32Array[], sampleRate: number): Blob {
    const numChannels = 1;
    const bytesPerSample = 2; // 16-bit PCM
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;

    const samples = convertFloat32Array(samplesArray); // Merge the array of Float32Arrays

    const dataLength = samples.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const dataView = new DataView(buffer);

    /* RIFF identifier */
    writeString(dataView, 0, "RIFF");
    /* RIFF chunk length */
    dataView.setUint32(4, 36 + dataLength, true);
    /* RIFF type format */
    writeString(dataView, 8, "WAVE");
    /* format chunk identifier */
    writeString(dataView, 12, "fmt ");
    /* format chunk length */
    dataView.setUint32(16, 16, true);
    /* sample format (raw) */
    dataView.setUint16(20, 1, true);
    /* channel count */
    dataView.setUint16(22, numChannels, true);
    /* sample rate */
    dataView.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    dataView.setUint32(28, byteRate, true);
    /* block align (channel count * bytes per sample) */
    dataView.setUint16(32, blockAlign, true);
    /* bits per sample */
    dataView.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(dataView, 36, "data");
    /* data chunk length */
    dataView.setUint32(40, dataLength, true);

    floatTo16BitPCM(dataView, 44, samples); // Pass the merged Float32Array

    return new Blob([dataView], { type: "audio/wav" });
}

function convertFloat32Array(list: Float32Array[]): Float32Array {
    let len = 0;
    for (let i = 0; i < list.length; i++) {
        len += list[i].length;
    }
    const merged = new Float32Array(len);
    let offset = 0;
    for (let i = 0; i < list.length; i++) {
        merged.set(list[i], offset);
        offset += list[i].length;
    }
    return merged;
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
</script>
