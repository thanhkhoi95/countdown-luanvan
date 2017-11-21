import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { TableService } from '../services/table.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    table = {};
    tables = [];
    isLoading = true;
    isEditing = false;

    addTableForm: FormGroup;
    name = new FormControl('', Validators.required);

    constructor(private tablesService: TableService,
        private formBuilder: FormBuilder,
        public toast: ToastComponent) { }

    ngOnInit() {
        this.getAllTables();
        this.addTableForm = this.formBuilder.group({
            name: this.name,
        });
    }

    getAllTables() {
        this.tablesService.getAllTables().subscribe(
            res => {
                this.tables = res.data.tables;
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

    addTable() {
        this.tablesService.addTable(this.addTableForm.value).subscribe(
            res => {
                const newTable = res.data.table;
                this.tables.push(newTable);
                this.addTableForm.reset();
                this.toast.setMessage('New table added successfully.', 'success');
            },
            error => console.log(error)
        );
    }

    enableEditing(table) {
        this.isEditing = true;
        this.table = table;
    }

    cancelEditing() {
        this.isEditing = false;
        this.table = {};
        this.toast.setMessage('Hủy chỉnh sửa thông tin bàn ăn', 'warning');
        // reload the cats to reset the editing
        this.getAllTables();
    }

    updateTable(table) {
        this.tablesService.updateTable(table).subscribe(
            res => {
                this.isEditing = false;
                this.table = table;
                this.toast.setMessage('Chỉnh sửa thông tin bàn thành công', 'success');
            },
            error => console.log(error)
        );
    }

    deactiveTable(table) {
        this.tablesService.setActive(table, false).subscribe(
            res => {
                this.table = table;
                table.active = false;
                this.toast.setMessage('Bàn ăn đã được deactive', 'success');
            },
            error => console.log(error)
        );
    }

    activeTable(table) {
        this.tablesService.setActive(table, true).subscribe(
            res => {
                this.table = table;
                table.active = true;
                this.toast.setMessage('Bàn ăn đã được active', 'success');
            },
            error => console.log(error)
        );
    }

    // deleteCat(cat) {
    //   if (window.confirm('Are you sure you want to permanently delete this item?')) {
    //     this.catService.deleteCat(cat).subscribe(
    //       res => {
    //         const pos = this.cats.map(elem => elem._id).indexOf(cat._id);
    //         this.cats.splice(pos, 1);
    //         this.toast.setMessage('item deleted successfully.', 'success');
    //       },
    //       error => console.log(error)
    //     );
    //   }
    // }

}
