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
            category: this.category,
            categories: this.category
        }, { validator: this.checkPrice('price') });
    }

    checkPrice(price) {
        return (group: FormGroup) => {
            const priceInput = group.controls[price];
            if (priceInput.value < 0) {
                return priceInput.setErrors({ notValid: true });
            } else {
                return priceInput.setErrors(null);
            }
        };
    }

    validatePrice(value) {
        value < 0 ? this.food['price'] = 0 : this.food['price'] = value;
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
        formData.append('categories', food.categories[0].id);
        console.log(food);

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

    addFood() {
        this.foodService.addFood(this.addFoodForm.value).subscribe(
            res => {
                res.data.food.category = res.data.food.categories[0];
                const newFood = res.data.food;
                this.foods.push(newFood);
                this.addFoodForm.reset();
                this.toast.setMessage('Thêm món ăn mới thành công.', 'success');
            },
            error => console.log(error)
        );
    }

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

    deactiveFood(food) {
        this.foodService.setActive(food, false).subscribe(
            res => {
                this.food = food;
                food.active = false;
                this.toast.setMessage('Món ăn đã được deactive', 'success');
            },
            error => console.log(error)
        );
    }

    activeFood(food) {
        this.foodService.setActive(food, true).subscribe(
            res => {
                this.food = food;
                food.active = true;
                this.toast.setMessage('Món ăn đã được active', 'success');
            },
            error => console.log(error)
        );
    }

    // addFood() {
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

    updateFood(food) {
        const formData = new FormData();
        formData.append('name', food.name);
        formData.append('description', food.description);
        formData.append('price', food.price);
        formData.append('categories', food.category);
        formData.append('pictures', food.pictures[0]);
        this.foodService.updateFood(food, formData).subscribe(
            res => {
                this.isEditing = false;
                res.data.food.category = res.data.food.categories[0].id;
                this.food = res.data.food;
                this.toast.setMessage('Chỉnh sửa thông tin món ăn thành công', 'success');
            },
            error => console.log(error)
        );
    }

}
