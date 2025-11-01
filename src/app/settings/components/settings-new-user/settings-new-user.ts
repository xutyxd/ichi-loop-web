import { Component, inject } from '@angular/core';
import { DialogRef } from '../../../ui/classes/dialog-ref.class';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStorageService } from '../../../providers/user-storage.service';
import { DialogService } from '../../../ui/services/dialog.service';
import { InputForm } from "../../../ui/components/input/input-form/input-form";
import { Button } from '../../../ui/components/button/button';
import { Input } from '../../../ui/components/input/input/input';

@Component({
  selector: 'app-settings-new-user',
  imports: [ReactiveFormsModule, InputForm, Input, Button],
  templateUrl: './settings-new-user.html',
  styleUrl: './settings-new-user.scss',
})
export class SettingsNewUser {
    private userStorageService = inject(UserStorageService);
    private dialogService = inject(DialogService);
    
    public userForm = new FormGroup({
        nickname: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })
    });

    constructor(private dialogRef: DialogRef) {
        this.dialogRef.onClose = () => {
            if (this.userStorageService.user.logged()) {
                return;
            }
            // Not configured so open dialog
            this.dialogService.open(SettingsNewUser);
        }
    }

    public save() {
        const { nickname } = this.userForm.getRawValue();

        if (!nickname) {
            return;
        }

        this.userStorageService.user.create(nickname);
        this.dialogRef.close();
    }
}
