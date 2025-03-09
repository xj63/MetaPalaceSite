import axios from "axios";

const SERVER = "https://api-metapalace.xj63.fun";

export async function aichat(
  audioFile: File,
  artifactName: string,
): Promise<string> {
  // return "hello";
  // This is todo.

  const API_URL = `${SERVER}/aichat/${artifactName}`;

  try {
    const formData = new FormData();
    formData.append("audio", audioFile); // Important: use 'audio' as the key

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // axios sets this automatically, but be explicit
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      console.warn("AI Chat API returned unexpected data:", response.data);
      return "Sorry, I could not understand. Please try again.";
    }
  } catch (error: any) {
    console.error("Error calling AI Chat API:", error);
    return "Sorry, an error occurred. Please try again later.";
  }
}

export async function isApiReady(): Promise<boolean> {
  try {
    const response = await axios.head(`${SERVER}`);
    return response.status === 200;
  } catch (error) {
    console.warn("Error checking API readiness:");
    return false;
  }
}
