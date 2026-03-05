export interface StorageProvider {
  upload(file: File, path: string): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}
