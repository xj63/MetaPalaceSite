import { defineStore } from "pinia";
import axios from "axios";

const axiosInstance = axios.create({
  timeout: 10000, // 设置超时时间为 10 秒
});

export interface Artifact {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export const useArtifactStore = defineStore("artifact", {
  state: () => ({
    artifacts: [] as Artifact[],
    currentArtifact: null as Artifact | null,
    loading: false,
  }),

  actions: {
    async fetchArtifacts() {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "https://assets.metapalace.xj63.fun/meta.json",
        );
        const artifactNames = response.data.support;
        this.artifacts = artifactNames.map((name: string) => ({
          id: name,
          name,
          imageUrl: `https://assets.metapalace.xj63.fun/fig/${name}.png`,
          description: "文物描述待补充", // 这里可以根据需要补充描述信息
        }));
      } catch (error) {
        console.error("Failed to fetch artifacts:", error);
      } finally {
        this.loading = false;
      }
    },

    setCurrentArtifact(artifact: Artifact) {
      this.currentArtifact = artifact;
    },

    clearCurrentArtifact() {
      this.currentArtifact = null;
    },
  },
});
