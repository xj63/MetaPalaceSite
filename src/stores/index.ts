import { defineStore } from "pinia";
import axios from "axios";

const axiosInstance = axios.create({
  timeout: 1000, // 设置超时时间为 1 秒
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
        const response = await this.fetchWithRetry("/resources/meta.json", 3);

        const artifactNames = response.data.support;
        const releaseArtifactNames = response.data.release || [];

        const artifactPromises = artifactNames.map(async (name: string) => {
          try {
            const descriptionResponse = await axiosInstance.get(
              `/resources/desc/${name}.txt`,
              { responseType: "text" },
            );
            const description = descriptionResponse.data;

            const imageUrl = `/resources/fig/${name}.png`;

            // 直接返回，不再重试加载图像
            return {
              id: name,
              name,
              imageUrl: imageUrl,
              description: description,
            };
          } catch (descriptionError) {
            console.warn(
              `Failed to fetch description for ${name}:`,
              descriptionError,
            );
            return {
              id: name,
              name,
              imageUrl: "",
              description: "加载失败",
            };
          }
        });

        const artifacts = await Promise.all(artifactPromises);

        // Separate release artifacts
        const releaseArtifacts = artifacts.filter((artifact) =>
          releaseArtifactNames.includes(artifact.name),
        );

        // Remove release artifacts from the main list
        const remainingArtifacts = artifacts.filter(
          (artifact) => !releaseArtifactNames.includes(artifact.name),
        );

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

    async fetchWithRetry(url: string, maxRetries: number): Promise<any> {
      let retry = 0;
      while (retry < maxRetries) {
        try {
          const response = await axiosInstance.get(url);
          return response;
        } catch (error: any) {
          console.warn(`尝试获取 ${url} 失败 (第 ${retry + 1} 次)`);
          if (retry === maxRetries - 1) {
            throw error;
          }
          retry++;
          await new Promise((resolve) => setTimeout(resolve, 1000 * retry));
        }
      }
    },
  },
});
