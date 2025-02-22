import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Provjeri je li ovo ispravno

import { AppComponent } from './app.component'; // Tvoja glavna komponenta

@NgModule({
  declarations: [
    AppComponent, // Dodaj ovdje svoje komponente
  ],
  imports: [
    BrowserModule, // Osnovni Angular moduli
  ],
  providers: [
    provideHttpClient(withFetch()), // Omogućava fetch API
  ],
  bootstrap: [AppComponent], // Glavna komponenta koja se bootstrapa prva
})
export class AppModule {}
