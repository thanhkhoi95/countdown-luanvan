import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ToastComponent } from '../shared/toast/toast.component';

import * as moment from 'moment';
import { KitchenService } from '../services/kitchen.service';

@Component({
    selector: 'app-kitchen',
    templateUrl: './kitchen.component.html',
    styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

    kitchen = {};
    kitchens = [];
    isLoading = true;
    isEditing = false;

    addKitchenForm: FormGroup;
    name = new FormControl('', Validators.required);
    username = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);
    passwordConfirm = new FormControl('', Validators.required);

    constructor(private kitchenService: KitchenService,
        private formBuilder: FormBuilder,
        public toast: ToastComponent) { }

    ngOnInit() {
        this.getAllKitchens();
        this.addKitchenForm = this.formBuilder.group({
            name: this.name,
            username: this.username,
            password: this.password,
            passwordConfirm: this.passwordConfirm
        }, { validator: this.checkIfMatchingPasswords('password', 'passwordConfirm') });
    }

    private checkIfMatchingPasswords(pass: string, confirm: string) {
        return (group: FormGroup) => {
            const passwordInput = group.controls[pass],
                passwordConfirmationInput = group.controls[confirm];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({ notEquivalent: true });
            } else {
                return passwordConfirmationInput.setErrors(null);
            }
        };
    }

    getAllKitchens() {
        this.kitchenService.getAllKitchens().subscribe(
            res => {
                this.kitchens = res.data.kitchens;
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

    addKitchen() {
      this.kitchenService.addKitchen(this.addKitchenForm.value).subscribe(
        res => {
          const newKitchen = res.data.kitchen;
          this.kitchens.push(newKitchen);
          this.addKitchenForm.reset();
          this.toast.setMessage('New kitchen added successfully.', 'success');
        },
        error => console.log(error)
      );
    }

    enableEditing(kitchen) {
        this.isEditing = true;
        this.kitchen = kitchen;
        console.log(this.kitchen);
    }

    cancelEditing() {
        this.isEditing = false;
        this.kitchen = {};
        this.toast.setMessage('Hủy chỉnh sửa thông tin nhà bếp', 'warning');
        this.getAllKitchens();
    }

    deactiveKitchen(kitchen) {
        this.kitchenService.setActive(kitchen, false).subscribe(
            res => {
                this.kitchen = kitchen;
                kitchen.active = false;
                this.toast.setMessage('Nhà bếp đã được deactive', 'success');
            },
            error => console.log(error)
        );
    }

    activeKitchen(kitchen) {
        this.kitchenService.setActive(kitchen, true).subscribe(
            res => {
                this.kitchen = kitchen;
                kitchen.active = true;
                this.toast.setMessage('Nhà bếp đã được active', 'success');
            },
            error => console.log(error)
        );
    }

    updateKitchen(kitchen) {
        this.kitchenService.updateKitchen(kitchen).subscribe(
            res => {
                this.isEditing = false;
                this.kitchen = kitchen;
                this.toast.setMessage('Chỉnh sửa thông tin nhà bếp thành công', 'success');
            },
            error => console.log(error)
        );
    }
}
