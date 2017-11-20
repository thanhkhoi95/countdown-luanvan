import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { StaffService } from '../services/staff.service';
import { ToastComponent } from '../shared/toast/toast.component';

import * as moment from 'moment';

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

    staff = {};
    staffs = [];
    isLoading = true;
    isEditing = false;

    addStaffForm: FormGroup;
    firstname = new FormControl('', Validators.required);
    lastname = new FormControl('', Validators.required);
    birthdate = new FormControl('', Validators.required);
    gender = new FormControl('', Validators.required);
    username = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);
    passwordConfirm = new FormControl('', Validators.required);

    constructor(private staffService: StaffService,
        private formBuilder: FormBuilder,
        public toast: ToastComponent) { }

    ngOnInit() {
        this.getAllStaffs();
        this.addStaffForm = this.formBuilder.group({
            firstname: this.firstname,
            lastname: this.lastname,
            birthdate: this.birthdate,
            gender: this.gender,
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

    getAllStaffs() {
        this.staffService.getAllStaff().subscribe(
            res => {
                this.staffs = res.data.staffs;
                for (const i in this.staffs) {
                    if (this.staffs[i]) {
                        this.staffs[i].birthdate = moment(this.staffs[i].birthdate).format('DD/MM/YYYY');
                        if (this.staffs[i].gender === 'male') {
                            this.staffs[i].gender = 'Nam';
                        } else {
                            this.staffs[i].gender = 'Nữ';
                        }
                    }
                }
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

    changeAvatar($event, staff) {
        this.staff = staff;
        const file = $event.target.files[0] || $event.srcElement.files[0];
        const formData = new FormData();
        formData.append('file', file);
        this.staffService.changeAvatar(staff, formData).subscribe(
            res => {
                for (const i in this.staffs) {
                    if (this.staffs[i].id === staff.id) {
                        this.staffs[i].avatar = res.data.staff.avatar;
                    }
                }
                this.toast.setMessage('Change staff\'s avatar successfully.', 'success');
            },
            err => console.log(err)
        );
    }

    // addTable() {
    //   this.tablesService.addTable(this.addTableForm.value).subscribe(
    //     res => {
    //       const newTable = res.data.table;
    //       this.tables.push(newTable);
    //       this.addTableForm.reset();
    //       this.toast.setMessage('New table added successfully.', 'success');
    //     },
    //     error => console.log(error)
    //   );
    // }

    enableEditing(staff) {
        this.isEditing = true;
        const dateParts = staff.birthdate.split('/');
        staff.birthdate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        this.staff = staff;
        console.log(this.staff);
    }

    cancelEditing() {
        this.isEditing = false;
        this.staff = {};
        this.toast.setMessage('Hủy chỉnh sửa thông tin nhân viên', 'warning');
        this.getAllStaffs();
    }

    parseDate(dateString: string): Date {
        if (dateString) {
            return new Date(dateString);
        } else {
            return null;
        }
    }

    deactiveStaff(staff) {
        this.staffService.setActive(staff, false).subscribe(
            res => {
                this.staff = staff;
                staff.active = false;
                this.toast.setMessage('Nhân viên đã được deactive', 'success');
            },
            error => console.log(error)
        );
    }

    activeStaff(staff) {
        this.staffService.setActive(staff, true).subscribe(
            res => {
                this.staff = staff;
                staff.active = true;
                this.toast.setMessage('Nhân viên đã được active', 'success');
            },
            error => console.log(error)
        );
    }

    addStaff() {
        console.log(this.addStaffForm.value);
        const newStaff = this.addStaffForm.value;
        const formData = new FormData();
        formData.append('firstname', newStaff.firstname);
        formData.append('lastname', newStaff.lastname);
        formData.append('gender', newStaff.gender === 'Nam' ? 'true' : 'false');
        formData.append('birthdate', newStaff.birthdate);
        formData.append('username', newStaff.username);
        formData.append('password', newStaff.password);
        this.staffService.addStaff(formData).subscribe(
            res => {
                this.getAllStaffs();
                this.toast.setMessage('Thêm nhân viên mới thành công.', 'success');
            },
            err => console.log(err)
        );
    }

    updateStaff(staff) {
        staff.gender = staff.gender === 'Nam' ? 'true' : 'false';
        console.log(staff);
        this.staffService.updateStaff(staff).subscribe(
            res => {
                this.isEditing = false;
                staff.gender = staff.gender === 'true' ? 'Nam' : 'Nữ';
                this.staff = staff;
                this.toast.setMessage('Chỉnh sửa thông tin nhân viên thành công', 'success');
            },
            error => console.log(error)
        );
    }


}
