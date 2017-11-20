import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FoodService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
    });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getAllFood(): Observable<any> {
        return this.http.get('/api/food/getall', this.options);
    }

    changePicture(food, formData): Observable<any> {

        const headers = new HttpHeaders({
            'x-access-token': localStorage.getItem('token')
        });

        return this.http.put('/api/food?id=' + food.id, formData, { headers: headers });
    }

    setActive(food, flag): Observable<any> {
        return this.http.put(`/api/food/setactive?id=${food.id}&state=${flag}`, {}, this.options);
    }

    addFood(formData): Observable<any> {

        const headers = new HttpHeaders({
            'x-access-token': localStorage.getItem('token')
        });

        return this.http.post('/api/food', formData, { headers: headers });
    }

    updateFood(food, formData): Observable<any> {
        const headers = new HttpHeaders({
            'x-access-token': localStorage.getItem('token')
        });

        return this.http.put('/api/food?id=' + food.id, formData, { headers: headers });
    }
}
