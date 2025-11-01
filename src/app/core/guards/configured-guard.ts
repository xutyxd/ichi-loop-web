import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserStorageService } from '../../providers/user-storage.service';
import { DialogService } from '../../ui/services/dialog.service';
import { SettingsNewUser } from '../../settings/components/settings-new-user/settings-new-user';

export const configuredGuard: CanActivateFn = async (route, state) => {
    const userStorageService = inject(UserStorageService);
    const dialogService = inject(DialogService);

    const logged = userStorageService.user.logged();

    if (!logged) {
        await dialogService.open(SettingsNewUser);
    }

    return userStorageService.user.logged();
};
