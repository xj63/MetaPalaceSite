<template>
    <div class="h-screen bg-red-300">
        <div class="flex pt-10">
            <p
                class="mx-auto bg-gray-800/30 text-gray-200 p-4 rounded-lg shadow-lg backdrop-blur-md text-6xl"
            >
                MetaPalace
            </p>
        </div>
        <div
            class="flex items-center justify-center h-full text-white font-bold bg-cover bg-center"
            style="background-image: url(&quot;/metapalace2.jpg&quot;)"
        ></div>
    </div>
</template>

<style scoped>
div.relative {
    /* 注意，这里指定了选择器为 div.relative，以确保只应用于该容器 */
    transform: translateY(20px); /* 向下偏移 20px，根据需要调整 */
}
</style>
