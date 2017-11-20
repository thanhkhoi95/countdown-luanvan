import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { FoodService } from '../services/food.service';
import { CategoryService } from '../services/category.service';
import { ToastComponent } from '../shared/toast/toast.component';

import * as moment from 'moment';

@Component({
    selector: 'app-food',
    templateUrl: './food.component.html',
    styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

    food = {};
    foods = [];
    categories = [];
    isLoading = true;
    isEditing = false;

    addFoodForm: FormGroup;
    name = new FormControl('', Validators.required);
    description = new FormControl('', Validators.required);
    price = new FormControl('', Validators.required);
    category = new FormControl('', Validators.required);

    constructor(private foodService: FoodService,
        private categoryService: CategoryService,
        private formBuilder: FormBuilder,
        public toast: ToastComponent) { }

    ngOnInit() {
        this.categoryService.getCategoryList().subscribe(
            res => {
                this.categories = res.data.categories;
            },
            error => console.log(error)
        );
        this.getAllFoods();
        this.addFoodForm = this.formBuilder.group({
            name: this.name,
            description: this.description,
            price: this.price,
            category: this.category
        });
    }

    getAllFoods() {
        this.foodService.getAllFood().subscribe(
            res => {
                this.foods = res.data.foods;
                for (const i in this.foods) {
                    if (this.foods[i]) {
                        this.foods[i].category = this.foods[i].categories[0].id;
                    }
                }
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

    changePicture($event, food) {
        this.food = food;
        const file = $event.target.files[0] || $event.srcElement.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', food.name);
        formData.append('description', food.description);
        formData.append('price', food.price);
        formData.append('pictures', '');
        formData.append('categories', food.categories[0].id);

        this.foodService.changePicture(food, formData).subscribe(
            res => {
                for (const i in this.foods) {
                    if (this.foods[i].id === food.id) {
                        this.foods[i].pictures = res.data.food.pictures;
                    }
                }
                this.toast.setMessage('Change food\'s picture successfully.', 'success');
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

    enableEditing(food) {
        this.isEditing = true;
        this.food = food;
    }

    cancelEditing() {
        this.isEditing = false;
        this.food = {};
        this.toast.setMessage('Hủy chỉnh sửa thông tin nhân viên', 'warning');
        this.getAllFoods();
    }

    // parseDate(dateString: string): Date {
    //     if (dateString) {
    //         return new Date(dateString);
    //     } else {
    //         return null;
    //     }
    // }

    // deactiveStaff(staff) {
    //     this.staffService.setActive(staff, false).subscribe(
    //         res => {
    //             this.staff = staff;
    //             staff.active = false;
    //             this.toast.setMessage('Nhân viên đã được deactive', 'success');
    //         },
    //         error => console.log(error)
    //     );
    // }

    // activeStaff(staff) {
    //     this.staffService.setActive(staff, true).subscribe(
    //         res => {
    //             this.staff = staff;
    //             staff.active = true;
    //             this.toast.setMessage('Nhân viên đã được active', 'success');
    //         },
    //         error => console.log(error)
    //     );
    // }

    // addStaff() {
    //     console.log(this.addStaffForm.value);
    //     const newStaff = this.addStaffForm.value;
    //     const formData = new FormData();
    //     formData.append('firstname', newStaff.firstname);
    //     formData.append('lastname', newStaff.lastname);
    //     formData.append('gender', newStaff.gender === 'Nam' ? 'true' : 'false');
    //     formData.append('birthdate', newStaff.birthdate);
    //     formData.append('username', newStaff.username);
    //     formData.append('password', newStaff.password);
    //     this.staffService.addStaff(formData).subscribe(
    //         res => {
    //             this.getAllStaffs();
    //             this.toast.setMessage('Thêm nhân viên mới thành công.', 'success');
    //         },
    //         err => console.log(err)
    //     );
    // }

    // updateStaff(staff) {
    //     staff.gender = staff.gender === 'Nam' ? 'true' : 'false';
    //     console.log(staff);
    //     this.staffService.updateStaff(staff).subscribe(
    //         res => {
    //             this.isEditing = false;
    //             staff.gender = staff.gender === 'true' ? 'Nam' : 'Nữ';
    //             this.staff = staff;
    //             this.toast.setMessage('Chỉnh sửa thông tin nhân viên thành công', 'success');
    //         },
    //         error => console.log(error)
    //     );
    // }


}
