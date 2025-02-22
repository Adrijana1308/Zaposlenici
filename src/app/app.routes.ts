import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component'; // Uvoz nove komponente

export const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add-employee', component: EmployeeFormComponent },
];
