import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {}

  async init() {
    if (this._initialized) return;
    
    if (!this.initPromise) {
      this.initPromise = this.initStorage();
    }
    
    await this.initPromise;
  }

  private async initStorage() {
    try {
      console.log('Initializing Storage...');
      this._storage = await this.storage.create();
      this._initialized = true;
      console.log('Storage initialized successfully');
    } catch (error) {
      console.error('Error initializing storage:', error);
      throw error;
    }
  }

  public async set(key: string, value: any): Promise<any> {
    await this.init();
    const result = await this._storage?.set(key, value);
    console.log(`Data saved for key "${key}"`, value);
    return result;
  }

  public async get(key: string): Promise<any> {
    await this.init();
    const value = await this._storage?.get(key);
    console.log(`Data retrieved for key "${key}":`, value);
    return value;
  }

  public async remove(key: string): Promise<any> {
    await this.init();
    const result = await this._storage?.remove(key);
    console.log(`Data removed for key "${key}"`);
    return result;
  }

  public async clear(): Promise<void> {
    await this.init();
    await this._storage?.clear();
    console.log('Storage cleared');
  }

  public async keys(): Promise<string[]> {
    await this.init();
    const keys = await this._storage?.keys() || [];
    console.log('Storage keys:', keys);
    return keys;
  }

  public async length(): Promise<number> {
    await this.init();
    const length = await this._storage?.length() || 0;
    console.log('Storage length:', length);
    return length;
  }
}
