import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  employee = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    jobTitle: '',
  };

  allowedPositions = [
    'Inženjer',
    'Konzultant',
    'Menađer',
    'Analitičar',
    'Dizajner',
    'Programer',
  ];

  private apiUrl = 'https://zaposlenici-json.onrender.com/employees';

  constructor(private http: HttpClient) {}

  onSave(form: NgForm): void {
    if (form.valid) {
      if (!this.allowedPositions.includes(this.employee.jobTitle)) {
        alert('Odabrana pozicija nije dopuštena!');
        return;
      }
      console.log('Podaci zaposlenika:', this.employee);

      this.http
        .post(this.apiUrl, this.employee, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        })
        .subscribe(
          (response) => {
            console.log('Zaposlenik uspješno spremljen:', response);
            alert('Zaposlenik uspješno dodan!');
            form.reset();
          },
          (error) => {
            console.error('Greška pri dodavanju zaposlenika:', error);
            alert('Došlo je do greške. Pokušajte ponovo.');
          }
        );
    } else {
      console.log('Ispunite sva polja!');
    }
  }
}
