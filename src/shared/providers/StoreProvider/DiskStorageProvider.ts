import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import { IStorageProvider } from './StoreInterface';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    const filePath = path.resolve(uploadConfig.dest, file);
    try {
      await fs.promises.stat(filePath);
    } catch (error) {
      return file;
    }
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.dest, file);
    try {
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }
    await fs.promises.unlink(filePath);
  }
}
