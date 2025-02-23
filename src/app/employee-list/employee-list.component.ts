import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchQuery: string = '';
  selectedPosition: string = '';
  sortBy: string = '';
  loading: boolean = true;

  // Paginacija
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  positions: string[] = [
    '---',
    'Inženjer',
    'Konzultant',
    'Menađer',
    'Analitičar',
    'Dizajner',
    'Programer',
  ];

  private apiUrl = 'https://zaposlenici-json.onrender.com/employees';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (response) => {
        console.log('Response:', response);
        this.loading = false;
        if (response && Array.isArray(response)) {
          this.employees = response;
          this.filteredEmployees = [...this.employees];
          console.log('Filtered Employees:', this.filteredEmployees);
        } else {
          this.employees = [];
          this.filteredEmployees = [];
        }

        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching employees data:', error);
        this.employees = [];
        this.filteredEmployees = [];
      }
    );
  }
  filterByPosition(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.selectedPosition = target.value;
      this.applyFilters();
    }
  }

  search(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredEmployees = this.employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query)
      );
    });

    if (this.filteredEmployees.length === 0) {
      console.log('Zaposlenici nisu pronađeni.');
    }
  }

  sortEmployees(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.sortBy = target.value;
      this.applyFilters();
    }
  }

  applyFilters(): void {
    if (!this.filteredEmployees) {
      this.filteredEmployees = [];
    }

    let filtered = this.employees;

    if (this.selectedPosition && this.selectedPosition !== '---') {
      filtered = filtered.filter(
        (employee) => employee.jobTitle === this.selectedPosition
      );
    }

    if (this.searchQuery) {
      filtered = filtered.filter(
        (employee) =>
          employee.firstName
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          employee.lastName
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.sortBy) {
      filtered = filtered.sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) {
          return -1;
        }
        if (a[this.sortBy] > b[this.sortBy]) {
          return 1;
        }
        return 0;
      });
    }

    this.totalItems = filtered.length;
    this.filteredEmployees = filtered;
    this.getPageData();
  }
  getPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  selectedEmployee: any = null;
  selectedEmployeeId: number | null = null;

  editEmployee(employee: any) {
    this.selectedEmployee = { ...employee };
    this.selectedEmployeeId = employee.id;
  }
  updateEmployee() {
    if (!this.selectedEmployee) return;

    this.http
      .put(`${this.apiUrl}/${this.selectedEmployee.id}`, this.selectedEmployee)
      .subscribe((updatedEmployee) => {
        console.log('Zaposlenik ažuriran:', updatedEmployee);

        this.employees = this.employees.map((emp) =>
          emp.id === this.selectedEmployee.id ? this.selectedEmployee : emp
        );

        this.applyFilters();
        this.fetchEmployees();

        this.selectedEmployee = null;
      });
  }

  cancelEdit() {
    this.selectedEmployee = null;
    this.selectedEmployeeId = null;
  }
  saveEmployee() {
    if (this.selectedEmployee) {
      const index = this.employees.findIndex(
        (emp) => emp.id === this.selectedEmployee?.id
      );
      if (index !== -1) {
        this.employees[index] = { ...this.selectedEmployee };
        this.applyFilters();
      }
    }
    this.cancelEdit();
  }

  fetchEmployees(): void {
    this.http
      .get<any[]>('https://zaposlenici-json.onrender.com/employees')
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.filteredEmployees = data;
          console.log('Podaci uspješno dohvaćeni:', data);
        },
        error: (error) => {
          console.error('Greška prilikom dohvaćanja zaposlenika:', error);
        },
      });
  }

  deleteEmployee(employee: { id: string }): void {
    if (!employee || !employee.id) {
      console.error('Nevažeći podaci o zaposleniku:', employee);
      return;
    }

    this.http
      .delete(`https://zaposlenici-json.onrender.com/employees/${employee.id}`)
      .subscribe({
        next: () => {
          console.log(`Zaposlenik s ID-em ${employee.id} uspješno obrisan.`);
          this.fetchEmployees();
        },
        error: (error) => {
          console.error('Greška prilikom brisanja zaposlenika:', error);
        },
      });
  }
}
