import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CategoryService } from '../services/category.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    category = {};
    categories = [];
    isLoading = true;
    isEditing = false;

    addCategoryForm: FormGroup;
    name = new FormControl('', Validators.required);

    constructor(private categoryService: CategoryService,
        private formBuilder: FormBuilder,
        public toast: ToastComponent) { }

    ngOnInit() {
        this.getCategoryList();
        this.addCategoryForm = this.formBuilder.group({
            name: this.name
        });
    }

    getCategoryList() {
        this.categoryService.getCategoryList().subscribe(
            res => {
                this.categories = res.data.categories;
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

    addCategory() {
        this.categoryService.addCategory(this.addCategoryForm.value).subscribe(
            res => {
                const newCategory = res.data.category;
                this.categories.push(newCategory);
                this.addCategoryForm.reset();
                this.toast.setMessage('Thêm danh mục mới thành công', 'success');
            },
            error => console.log(error)
        );
    }

    enableEditing(category) {
        this.isEditing = true;
        this.category = category;
    }

    cancelEditing() {
        this.isEditing = false;
        this.category = {};
        this.toast.setMessage('Hủy chỉnh sửa thông tin danh mục', 'warning');
        // reload the cats to reset the editing
        this.getCategoryList();
    }

    updateCategory(category) {
        this.categoryService.updateCategory(category).subscribe(
            res => {
                this.isEditing = false;
                this.category = category;
                this.toast.setMessage('Chỉnh sửa thông tin danh mục thành công', 'success');
            },
            error => console.log(error)
        );
    }

    deactiveCategory(category) {
        this.categoryService.setActive(category, false).subscribe(
            res => {
                this.category = category;
                category.active = false;
                this.toast.setMessage('Danh mục đã được deactive', 'success');
            },
            error => console.log(error)
        );
    }

    activeCategory(category) {
        this.categoryService.setActive(category, true).subscribe(
            res => {
                this.category = category;
                category.active = true;
                this.toast.setMessage('Danh mục đã được active', 'success');
            },
            error => console.log(error)
        );
    }

}
