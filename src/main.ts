import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import "./style.css";

import App from "@/App.vue";
import { useArtifactStore } from "@/stores";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const artifactStore = useArtifactStore();
artifactStore.fetchArtifacts();

app.mount("#app");
