import { inject, Injectable } from '@angular/core';
import { AppStorageService } from './app-storage.service';
import { KeyValueStorageService } from './key-value-storage.service';
import { IUser } from '../core/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private keyValueStorageService = inject(KeyValueStorageService);
    private appStorageService = inject(AppStorageService);

    private uuid?: string;
    private User?: IUser;

    constructor() {
        // Check if exist last user
        const uuid = this.appStorageService.get<string>('lastUser');

        if (!uuid) {
            return;
        }
        // Load user in memory
        this.uuid = uuid;
        this.User = this.keyValueStorageService.get<IUser>('user', uuid);
        // Re set uuid from user
        this.uuid = this.User?.uuid;
    }

    public user = {
        create: (nickname: string) => {
            // Generate uuid
            const uuid = crypto.randomUUID();
            // Create user object
            const user: IUser = { uuid, nickname };
            // Set uuid in memory
            this.uuid = uuid;
            // Save user in key-value storage
            this.set('user', user);
            // Save on memory
            this.User = user;
            // Get created users
            const users = this.appStorageService.get<IUser[]>('users') || [];
            // Save users
            this.appStorageService.set('users', [...users, user]);
            // Change user to last one
            this.user.change(uuid);
        },
        get: () => {
            return structuredClone(this.User);
        },
        logged: () => {
            return !!this.uuid;
        },
        change: (uuid: string) => {
            this.uuid = uuid;
            this.appStorageService.set('lastUser', uuid);
        }
    }

    public get<T>(name: string): T{
        if (!this.uuid) {
            throw new Error('User not logged');
        }

        return this.keyValueStorageService.get(name, this.uuid);
    }

    public set(name: string, data: any): void {
        if (!this.uuid) {
            throw new Error('User not logged');
        }

        return this.keyValueStorageService.set(name, data, this.uuid);
    }

    public remove = (name: string) => {
        if (!this.uuid) {
            throw new Error('User not logged');
        }

        return this.keyValueStorageService.remove(name, this.uuid);
    }
}
