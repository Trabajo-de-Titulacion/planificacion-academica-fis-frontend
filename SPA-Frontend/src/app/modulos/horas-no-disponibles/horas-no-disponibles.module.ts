import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorasNoDisponiblesRoutingModule } from './horas-no-disponibles-routing.module';
import { ModificarHorasNoDisponiblesComponent } from './componentes/modificar-horas-no-disponibles/modificar-horas-no-disponibles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CambiosGuardadosGuard } from './guards/cambios-guardados.guard';


@NgModule({
  declarations: [
    ModificarHorasNoDisponiblesComponent
  ],
  imports: [
    CommonModule,
    HorasNoDisponiblesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
  ],
  providers: [
    CambiosGuardadosGuard,
  ]
})
export class HorasNoDisponiblesModule { }
