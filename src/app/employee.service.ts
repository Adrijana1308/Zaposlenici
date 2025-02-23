import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://zaposlenici-json.onrender.com/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  OnSave(employee: any): Observable<any> {
    return this.http.post(
      'https://zaposlenici-json.onrender.com/employees',
      employee
    );
  }
}
