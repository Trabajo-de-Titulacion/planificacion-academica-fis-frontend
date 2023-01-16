import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Horario } from '../../modelos/horario.interface';
import { HorarioApiService } from '../../servicios/horarios_api.service';

@Component({
  selector: 'app-visualizar-lista-horarios',
  templateUrl: './visualizar-lista-horarios.component.html',
  styleUrls: ['./visualizar-lista-horarios.component.scss']
})
export class VisualizarListaHorariosComponent implements OnInit {

  constructor(
    private readonly horarioServicio: HorarioApiService,
    private readonly router: Router,
  ) { }

  horariosGeneradosExistentes: Horario[] = [];
  filtro?: FormControl;

  datoFilaHorario = new MatTableDataSource<Horario>([]);

  displayedColumns: string[] = ['descripcion', 'fechaCreacion', 'correoUsuario', 'acciones'];
  @ViewChild('tablaSort') tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  rutaActual = this.router.url;

  // Filtrar entre todos los elementos de la tabla
  filtrarTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datoFilaHorario.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datoFilaHorario.sort = this.tablaSort;
    this.datoFilaHorario.paginator = this.paginator!;
  }

  cargarRegistros() {
    Swal.showLoading();
    this.horarioServicio.obtenerHorarios()
      .subscribe({
        next: (data) => {
          const horarios = data as Horario[];
          this.horariosGeneradosExistentes = horarios;
        },
        error: (err) => {
          console.log("error: ", err)
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron obtener los registros.',
            showCancelButton: true,
            confirmButtonText: 'Reiniciar página',
            cancelButtonText: 'Cerrar',
            icon: 'error',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        complete: () => {
          this.datoFilaHorario.data = this.horariosGeneradosExistentes;
          Swal.close();
        }
      });
  }

  test(){
    this.horarioServicio.generarHorario().subscribe(
      {
        next: (data) => {
          console.log("data", data);
        },
        error: (err) => {
          console.log("error", err)
        }
      }
    )
  }
}
