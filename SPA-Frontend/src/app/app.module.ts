import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modulos/login/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MostrarEspaciosFisicosComponent } from './modulos/espacios_fisicos/mostrar-espacios-fisicos/mostrar-espacios-fisicos.component';
import { CrearEspacioFisicoComponent } from './modulos/espacios_fisicos/crear-espacio-fisico/crear-espacio-fisico.component';
import { AutenticacionService } from './servicios/auth/autenticacion.service';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './modulos/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MostrarEspaciosFisicosComponent,
    CrearEspacioFisicoComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [
    AutenticacionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
