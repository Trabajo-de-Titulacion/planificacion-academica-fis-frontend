import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualizarDocenteComponent } from './componentes/actualizar-docente/actualizar-docente.component';
import { CrearDocenteComponent } from './componentes/crear-docente/crear-docente.component';
import { VisualizarDocentesComponent } from './componentes/visualizar-docentes/visualizar-docentes.component';
import { DocentesRoutingModule } from './docentes-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ActualizarDocenteComponent,
    CrearDocenteComponent,
    VisualizarDocentesComponent
  ],
  imports: [
    CommonModule,
    DocentesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class DocentesModule { }
