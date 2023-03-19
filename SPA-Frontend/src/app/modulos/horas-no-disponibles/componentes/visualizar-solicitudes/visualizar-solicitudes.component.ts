import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Semestre from 'src/app/modulos/parametros-inciales/models/semestre.interface';
import { SemestreService } from 'src/app/modulos/parametros-inciales/services/semestre-api.service';
import Swal from 'sweetalert2';
import { SolicitudHoraNoDisponible } from '../../modelos/solicitudHoraNoDisponible.interface';
import { HorasNoDisponiblesApiService } from '../../servicios/horas-no-disponibles-api.service';

@Component({
  selector: 'app-visualizar-solicitudes',
  templateUrl: './visualizar-solicitudes.component.html',
  styleUrls: ['./visualizar-solicitudes.component.scss']
})
export class VisualizarSolicitudesComponent implements OnInit {

  constructor(
    private readonly horasNoDisponiblesService: HorasNoDisponiblesApiService,
    private readonly semestreService: SemestreService,
    private readonly router: Router,
  ) { }

  solicitudesExistentes: SolicitudHoraNoDisponible[] = [];
  semestreEnProgreso?: Semestre;
  filtro?: FormControl;

  datosFilasSolicitudes = new MatTableDataSource<SolicitudHoraNoDisponible>([]);

  columnas: string[] = ['docente', 'ultimaModificacion', 'estado', 'acciones'];
  @ViewChild(MatSort) tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  rutaActual = this.router.url;

  // Filtrar entre todos los elementos de la tabla
  filtrarTabla(event: Event) {
    const valorFiltrado = (event.target as HTMLInputElement).value;
    this.datosFilasSolicitudes.filter = valorFiltrado.trim().toLowerCase();
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.obtenerSemestreConPlanifiacionEnProgreso();
  }

  ngAfterViewInit(): void {
    this.datosFilasSolicitudes.sort = this.tablaSort;
    this.datosFilasSolicitudes.sortingDataAccessor = (item: any, propiedad) => {
      switch (propiedad) {
        case 'docente': {
          return item.docente.nombreCompleto;
        }
        default: {
          return item[propiedad];
        }
      }
    };
    this.datosFilasSolicitudes.paginator = this.paginator!;
  }

  obtenerSemestreConPlanifiacionEnProgreso() {
    this.semestreService.obtenerSemestreConPlanificacionEnProgreso()
      .subscribe({
        next: (semestre) => {
          this.semestreEnProgreso = semestre;
        },
        error: (res) => {
          this.mostrarMensajeDeError(res.error);
        },
        complete: () => {
          this.cargarRegistros();
        }
      })
  }

  cargarRegistros() {
    this.horasNoDisponiblesService.obtenerSolicitudesDelSemestreEnProgreso()
      .subscribe({
        next: (solicitudes) => {
          this.solicitudesExistentes = solicitudes;
        },
        error: (res) => {
          this.mostrarMensajeDeError(res.error);
        },
        complete: () => {
          this.datosFilasSolicitudes.data = this.solicitudesExistentes;
          if (this.solicitudesExistentes.length == 0) {
            Swal.fire('No se han creado solicitudes', '', 'info');
          } else {
            Swal.close();
          }
        }
      });
  }

  mostrarMensajeDeError(error: any) {
    console.error("error: ", error)
    Swal.fire({
      title: 'Error',
      text: `${error.message}`,
      showCancelButton: true,
      confirmButtonText: 'Reiniciar página',
      cancelButtonText: 'Cerrar',
      icon: 'error',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }

}
