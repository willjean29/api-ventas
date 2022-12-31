import { IStorageProvider } from './StoreInterface';
import uploadConfig from '@config/upload';
import DiskStorageProvider from './DiskStorageProvider';
import S3StorageProvider from './S3StorageProvider';
export default class StoreProvider {
  private storeProvider: IStorageProvider;
  constructor() {
    this.storeProvider = this.selectStoreProvider();
  }

  public async saveFile(file: string): Promise<string> {
    return await this.storeProvider.saveFile(file);
  }

  public async deleteFile(file: string): Promise<void> {
    return await this.storeProvider.deleteFile(file);
  }

  selectStoreProvider() {
    switch (uploadConfig.driver) {
      case 's3':
        return new S3StorageProvider();

      default:
        return new DiskStorageProvider();
    }
  }
}
