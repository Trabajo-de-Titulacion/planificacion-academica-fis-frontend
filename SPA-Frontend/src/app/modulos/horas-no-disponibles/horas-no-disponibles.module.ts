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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CambiosGuardadosGuard } from './guards/cambios-guardados.guard';
import { VisualizarSolicitudesComponent } from './componentes/visualizar-solicitudes/visualizar-solicitudes.component';
import { AprobarRechazarSolicitudesComponent } from './componentes/aprobar-rechazar-solicitudes/aprobar-rechazar-solicitudes.component';


@NgModule({
  declarations: [
    ModificarHorasNoDisponiblesComponent,
    VisualizarSolicitudesComponent,
    AprobarRechazarSolicitudesComponent
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
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [
    CambiosGuardadosGuard,
  ]
})
export class HorasNoDisponiblesModule { }
