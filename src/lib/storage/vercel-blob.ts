import { put, del } from "@vercel/blob";
import type { StorageProvider } from "./index";

export const vercelBlobStorage: StorageProvider = {
  async upload(file: File, path: string) {
    const blob = await put(path, file, {
      access: "public",
    });
    return { url: blob.url };
  },
  async delete(url: string) {
    await del(url);
  },
};
