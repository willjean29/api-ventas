// import Redis, { RedisClientType } from 'redis';
import * as redis from 'redis';
import cacheConfig from '@config/cache';

class RedisCache {
  private client: redis.RedisClientType;
  private static instance: RedisCache;
  constructor() {
    this.client = redis.createClient({
      socket: {
        host: 'redis',
        port: 6379,
      },
      password: '',
    });

    this.connected();
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  private async connected() {
    this.client.on('error', error => {
      console.log('Error :', error);
    });

    this.client.on('connect', () => {
      console.log('connected to redis');
    });

    await this.client.connect();
  }

  public async disconnect() {
    await this.client.quit();
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }
}

export default RedisCache;
