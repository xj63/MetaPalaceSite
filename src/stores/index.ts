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

        const artifactPromises = artifactNames.map(async (name: string) => {
          try {
            const descriptionResponse = await axiosInstance.get(
              `https://assets.metapalace.xj63.fun/desc/${name}.txt`,
              { responseType: "text" }, // Important for text files!
            );
            const description = descriptionResponse.data;

            return {
              id: name,
              name,
              imageUrl: `https://assets.metapalace.xj63.fun/fig/${name}.png`,
              description: description,
            };
          } catch (descriptionError) {
            console.warn(
              `Failed to fetch description for ${name}:`,
              descriptionError,
            );
            //Provide a default description if fetch fails
            return {
              id: name,
              name,
              imageUrl: `https://assets.metapalace.xj63.fun/fig/${name}.png`,
              description: "文物描述待补充",
            };
          }
        });

        this.artifacts = await Promise.all(artifactPromises);
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
