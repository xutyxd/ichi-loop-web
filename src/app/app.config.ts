import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { LucideAngularModule } from 'lucide-angular';
import { LucideSettings, LucideTrash, LucideLoaderCircle, LucidePlay, LucidePause, LucideInfinity, ArrowRightFromLine, CircleFadingArrowUp } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(
        LucideAngularModule.pick({
            LucideSettings,
            LucideTrash,
            LucideLoaderCircle,
            LucidePlay,
            LucidePause,
            LucideInfinity,
            ArrowRightFromLine,
            CircleFadingArrowUp
        })
    )
  ]
};
