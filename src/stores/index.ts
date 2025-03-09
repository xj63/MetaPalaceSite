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
          "https://assets-metapalace.xj63.fun/meta.json",
        );
        const artifactNames = response.data.support;
        const releaseArtifactNames = response.data.release || []; // 确保 release 存在，否则默认为空数组

        const artifactPromises = artifactNames.map(async (name: string) => {
          try {
            const descriptionResponse = await axiosInstance.get(
              `https://assets-metapalace.xj63.fun/desc/${name}.txt`,
              { responseType: "text" }, // Important for text files!
            );
            const description = descriptionResponse.data;

            return {
              id: name,
              name,
              imageUrl: `https://assets-metapalace.xj63.fun/fig/${name}.png`,
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
              imageUrl: `https://assets-metapalace.xj63.fun/fig/${name}.png`,
              description: "文物描述待补充",
            };
          }
        });

        const artifacts = await Promise.all(artifactPromises);

        // Separate release artifacts
        const releaseArtifacts = artifacts.filter(artifact => releaseArtifactNames.includes(artifact.name));

        // Remove release artifacts from the main list
        const remainingArtifacts = artifacts.filter(artifact => !releaseArtifactNames.includes(artifact.name));

        // Combine release artifacts and remaining artifacts
        this.artifacts = [...releaseArtifacts, ...remainingArtifacts];
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
