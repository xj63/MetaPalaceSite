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
        const response = await this.fetchWithRetry(
          "https://assets-metapalace.xj63.fun/meta.json",
          3,
        );
        const artifactNames = response.data.support;
        const releaseArtifactNames = response.data.release || [];

        const artifactPromises = artifactNames.map(async (name: string) => {
          try {
            const descriptionResponse = await axiosInstance.get(
              `https://assets-metapalace.xj63.fun/desc/${name}.txt`,
              { responseType: "text" },
            );
            const description = descriptionResponse.data;

            // 尝试加载图像并重试
            const imageUrl = await this.retryLoadImage(
              `https://assets-metapalace.xj63.fun/fig/${name}.png`,
              3, // 重试次数
            );

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

    // 增加 retryLoadImage 方法
    async retryLoadImage(url: string, maxRetries: number): Promise<string> {
      let retry = 0;
      while (retry < maxRetries) {
        try {
          // 使用 Promise 包装图像加载
          const imageUrl = await new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              resolve(url); // 成功加载，返回 URL
            };
            img.onerror = () => {
              reject(new Error(`Failed to load image: ${url}`)); // 加载失败，抛出错误
            };
            img.src = url; // 开始加载图像
          });
          return imageUrl; // 成功加载，返回URL
        } catch (error: any) {
          console.warn(`尝试加载图像 ${url} 失败 (第 ${retry + 1} 次)`);
          if (retry === maxRetries - 1) {
            console.warn(`加载图像 ${url} 彻底失败:`, error);
            return ""; // 彻底失败，返回空
          }
          retry++;
          await new Promise((resolve) => setTimeout(resolve, 1000 * retry)); // 等待一段时间后重试
        }
      }
      return "path/to/default_image.png"; // 如果循环结束还没有成功，返回默认图片
    },
  },
});
