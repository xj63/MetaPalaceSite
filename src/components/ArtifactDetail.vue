<template>
    <CardContainer @click="navigateToDetail" class="cursor-pointer">
        <CardBody
            class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]"
        >
            <CardItem
                :translate-z="50"
                class="text-xl font-bold text-neutral-600 dark:text-white"
            >
                {{ artifact ? artifact.name : "拖拽文物到此处查看详情" }}
            </CardItem>
            <CardItem
                as="p"
                translate-z="60"
                class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
            >
                {{ artifact?.description }}
            </CardItem>
            <CardItem :translate-z="100" class="mt-4 w-full">
                <img
                    :src="artifact?.imageUrl"
                    class="w-full h-auto rounded-xl group-hover/card:shadow-xl"
                />
            </CardItem>
            <div class="mt-20 flex items-center justify-between">
                <CardItem
                    :translate-z="20"
                    as="a"
                    href="https://rahulv.dev"
                    target="__blank"
                    class="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
                >
                    Visit →
                </CardItem>
                <CardItem
                    :translate-z="20"
                    as="button"
                    class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
                >
                    Get Started
                </CardItem>
            </div>
        </CardBody>
    </CardContainer>
</template>

<script setup lang="ts">
import { CardContainer, CardBody, CardItem } from "@/components/ui/card-3d";
import { useRouter } from "vue-router";

const props = defineProps({
    artifact: {
        type: Object as () => Record<string, any> | null,
        default: null,
    },
});

const router = useRouter();
function navigateToDetail() {
    router.push(`/detail/${props.artifact?.id}`);
}
</script>
