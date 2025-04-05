<template>
    <main
        class="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900"
    >
        <div class="text-center">
            <p class="text-base font-semibold text-indigo-600">404</p>
            <h1
                class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white"
            >
                Page not found
            </h1>
            <p
                class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400"
            >
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <RouterLink
                    to="/"
                    class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    Go back home
                </RouterLink>
                <a
                    href="mailto:metapalace@xj63.fun"
                    class="text-sm font-semibold text-gray-900 dark:text-gray-100"
                >
                    Contact support
                    <span aria-hidden="true">&rarr;</span>
                </a>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
