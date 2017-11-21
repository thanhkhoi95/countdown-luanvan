import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { StaffService } from '../services/staff.service';
import { TableService } from '../services/table.service';
import { AssignmentService } from '../services/assignment.service';

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
    tables = [];
    assignments = [];
    isLoading = true;
    isEditing = false;
    isAssigning = false;

    addStaffForm: FormGroup;
    addAssignmentForm: FormGroup;
    firstname = new FormControl('', Validators.required);
    lastname = new FormControl('', Validators.required);
    birthdate = new FormControl('', Validators.required);
    gender = new FormControl('', Validators.required);
    username = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);
    passwordConfirm = new FormControl('', Validators.required);
    tableA = new FormControl('', Validators.required);

    constructor(private staffService: StaffService,
        private assignmentService: AssignmentService,
        private tableService: TableService,
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
        this.addAssignmentForm = this.formBuilder.group({
            table: this.tableA
        });
    }

    cancelAddAssignment() {
        this.isAssigning = false;
        this.staff = {};
        this.addAssignmentForm.reset();
        this.getAllStaffs();
    }

    addAssignment() {
        const newAssignment = {
            staff: this.staff['id'],
            table: this.addAssignmentForm.value.table
        };
        this.assignmentService.addAssignment(newAssignment).subscribe(
            res => {
                this.assignments.push(res.data.assignment);
                this.addAssignmentForm.reset();
                for (const i in this.tables) {
                    if (this.tables[i].id === newAssignment.table) {
                        this.tables.splice(parseInt(i, 10), 1);
                        break;
                    }
                }
                this.toast.setMessage('Phân công thành công.', 'success');
            },
            err => console.log(err)
        );
    }

    removeAssignment(assignment) {
        this.assignmentService.removeAssignment(assignment).subscribe(
            res => {
                for (const i in this.assignments) {
                    if (this.assignments[i].id === assignment.id) {
                        this.assignments.splice(parseInt(i, 10), 1);
                        break;
                    }
                }
                this.getAssignableTableList();
                this.toast.setMessage('Xóa phân công thành công.', 'success');
            },
            err => console.log(err)
        );
    }

    private getAssignableTableList() {
        this.tableService.getAllTables().subscribe(
            res => {
                this.tables = res.data.tables;
                for (const i in this.tables) {
                    if (this.tables[i]) {
                        for (const j in this.assignments) {
                            if (this.assignments[j].table.id === this.tables[i].id) {
                                this.tables.splice(parseInt(i, 10), 1);
                            }
                        }
                    }
                }
            },
            err => console.log(err)
        );
    }

    private getAssignmentList(staff) {
        this.assignmentService.getByStaff(staff).subscribe(
            res => {
                console.log(res);
                this.assignments = res.data.assignments;
                console.log(this.assignments);
            },
            err => console.log(err)
        );
    }

    enableAssigning(staff) {
        this.isAssigning = true;
        this.staff = staff;
        this.getAssignmentList(staff);
        this.getAssignableTableList();
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
                this.addStaffForm.reset();
                this.toast.setMessage('Thêm nhân viên mới thành công.', 'success');
            },
            err => console.log(err)
        );
    }

    updateStaff(staff) {
        staff.gender = staff.gender === 'Nam' ? 'true' : 'false';
        this.staffService.updateStaff(staff).subscribe(
            res => {
                this.isEditing = false;
                staff.gender = staff.gender === 'true' ? 'Nam' : 'Nữ';
                staff.birthdate = moment(staff.birthdate).format('DD/MM/YYYY');
                this.staff = staff;
                this.toast.setMessage('Chỉnh sửa thông tin nhân viên thành công', 'success');
            },
            error => console.log(error)
        );
    }


}
