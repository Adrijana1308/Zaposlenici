import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  OnSave(employee: any): Observable<any> {
    return this.http.post('http://localhost:3000/employees', employee);
  }
}
