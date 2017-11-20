import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CategoryService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
    });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getCategoryList(): Observable<any> {
        return this.http.get('/api/category/getall', this.options);
    }

    updateCategory(category): Observable<any> {
        return this.http.put(`/api/category?id=${category.id}`, category, this.options);
    }

    addCategory(category): Observable<any> {
        return this.http.post(`/api/category`, category, this.options);
    }

    setActive(category, flag): Observable<any> {
        return this.http.put(`/api/category/setactive?id=${category.id}&state=${flag}`, {}, this.options);
    }

}
