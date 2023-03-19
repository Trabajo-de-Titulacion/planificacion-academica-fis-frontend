import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MostrarActividadesComponent } from './componentes/mostrar-actividades/mostrar-actividades.component';
import { ActividadesRoutingModule } from './actividades-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { CrearActividadDialogComponent } from './componentes/crear-actividad-dialog/crear-actividad-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    MostrarActividadesComponent,
    CrearActividadDialogComponent,
  ],
  imports: [
    CommonModule,
    ActividadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatIconModule
  ]
})
export class ActividadesModule { }
