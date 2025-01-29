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

  // Stocker une donnée
  public async set(key: string, value: any) {
    await this.init();
    const result = await this._storage?.set(key, value);
    console.log(`Data saved for key "${key}"`, value);
    return result;
  }

  // Récupérer une donnée
  public async get(key: string) {
    await this.init();
    const value = await this._storage?.get(key);
    console.log(`Data retrieved for key "${key}":`, value);
    return value;
  }

  // Supprimer une donnée
  public async remove(key: string) {
    await this.init();
    const result = await this._storage?.remove(key);
    console.log(`Data removed for key "${key}"`);
    return result;
  }

  // Supprimer toutes les données
  public async clear() {
    await this.init();
    const result = await this._storage?.clear();
    console.log('All data cleared from storage');
    return result;
  }

  // Récupérer toutes les clés
  public async keys() {
    await this.init();
    const keys = await this._storage?.keys();
    console.log('All storage keys:', keys);
    return keys;
  }
}
