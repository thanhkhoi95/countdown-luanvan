import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TableService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
    });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getAllTables(): Observable<any> {
        return this.http.get('/api/table/getall', this.options);
    }

    updateTable(table): Observable<any> {
        return this.http.put(`/api/table?id=${table.id}`, table, this.options);
    }

    addTable(table): Observable<any> {
        return this.http.post(`/api/table`, table, this.options);
    }

    setActive(table, flag): Observable<any> {
        return this.http.put(`/api/table/setactive?id=${table.id}&state=${flag}`, {}, this.options);
    }

}
