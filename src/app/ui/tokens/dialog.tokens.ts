import { InjectionToken } from '@angular/core';

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');
export const DIALOG_CLOSE = new InjectionToken<(result?: any) => void>('DIALOG_CLOSE');