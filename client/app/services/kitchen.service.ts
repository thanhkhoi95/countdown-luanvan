import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class KitchenService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
    });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getAllKitchens(): Observable<any> {
        return this.http.get('/api/kitchen/getall', this.options);
    }

    updateKitchen(kitchen): Observable<any> {
        return this.http.put(`/api/kitchen?id=${kitchen.id}`, kitchen, this.options);
    }

    addKitchen(kitchen): Observable<any> {
        return this.http.post(`/api/kitchen`, kitchen, this.options);
    }

    setActive(kitchen, flag): Observable<any> {
        return this.http.put(`/api/kitchen/setactive?id=${kitchen.id}&state=${flag}`, {}, this.options);
    }

}
