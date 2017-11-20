import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class StaffService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
    });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getAllStaff(): Observable<any> {
        return this.http.get('/api/staff/getall', this.options);
    }

    changeAvatar(staff, formData): Observable<any> {

        const headers = new HttpHeaders({
            'x-access-token': localStorage.getItem('token')
        });

        return this.http.put('/api/staff/avatar?id=' + staff.id, formData, { headers: headers });
    }

    setActive(staff, flag): Observable<any> {
        return this.http.put(`/api/staff/setactive?id=${staff.id}&state=${flag}`, {}, this.options);
    }

    addStaff(formData): Observable<any> {

        const headers = new HttpHeaders({
            'x-access-token': localStorage.getItem('token')
        });

        return this.http.post('/api/staff', formData, { headers: headers });
    }

    updateStaff(staff): Observable<any> {
        return this.http.put(`/api/staff?id=${staff.id}`, staff, this.options);
    }
}
