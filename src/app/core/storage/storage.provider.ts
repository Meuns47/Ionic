import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';

export function provideStorage(): EnvironmentProviders {
  return makeEnvironmentProviders([
    Storage,
    StorageService
  ]);
}
