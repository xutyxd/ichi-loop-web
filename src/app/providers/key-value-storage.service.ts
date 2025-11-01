import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class KeyValueStorageService {
    public get<T>(name: string, section: string): T {
        let result: any;

        try {
            const retrieved = JSON.parse(localStorage.getItem(section) || '{}');
            result = name ? retrieved[name] : retrieved;
        } catch (e) { }

        return result;
    }

    public set(name: string, data: unknown, section: string): void {
        let previous: any = localStorage.getItem(section) || '{}';

        try {
            previous = JSON.parse(previous);
        } catch (e) {
            previous = {};
        }
        // Set data of user
        previous[name] = data;
        // Parse and save
        localStorage.setItem(section, JSON.stringify(previous));
    }

    public remove = (name: string, section: string) => {

        // Get data of section
        let data: any = localStorage.getItem(section) || {};
        // Try to parse
        try {
            data = JSON.parse(data);
        } catch (e) { }
        // Delete data
        delete data[name];
        // Save on localStorage
        localStorage.setItem(section, JSON.stringify(data));
    }
}
