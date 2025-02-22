import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Zaposlenici';

  constructor(private router: Router) {}

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  goToAddEmployee(): void {
    this.router.navigate(['/add-employee']);
  }
}
