import { inject, Injectable } from '@angular/core';
import { KeyValueStorageService } from './key-value-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
    private keyValueStorage = inject(KeyValueStorageService);

    private section = 'ichi-pad-loop';

    public get<T>(name: string): T {
        return this.keyValueStorage.get(name, this.section);
    }

    public set(name: string, data: unknown): void {
        this.keyValueStorage.set(name, data, this.section);
    }

    public remove(name: string): void {
        this.keyValueStorage.remove(name, this.section);
    }
}
