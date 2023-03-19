import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DocenteApiService } from 'src/app/modulos/docentes/servicios/docentes_api.service';
import { Docente } from 'src/app/modulos/docentes/modelos/docente.interface';
import { CrearDocenteComponent } from '../crear-docente/crear-docente.component';
import { ActualizarDocenteComponent } from '../actualizar-docente/actualizar-docente.component';

@Component({
  selector: 'app-visualizar-docentes',
  templateUrl: './visualizar-docentes.component.html',
  styleUrls: ['./visualizar-docentes.component.scss']
})
export class VisualizarDocentesComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly docenteService: DocenteApiService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) { }

  docentesExistentes: Docente[] = [];
  filtro?: FormControl;
  archivoSeleccionado?: File;

  datosFilaDocentes = new MatTableDataSource<Docente>([]);

  displayedColumns: string[] = ['nombreCompleto', 'correoElectronico', 'acciones'];
  @ViewChild('tablaSort') tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginador?: MatPaginator;
  rutaActual = this.router.url;

  // Filtrar entre todos los elementos de la tabla

  filtrarTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFilaDocentes.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datosFilaDocentes.sort = this.tablaSort;
    this.datosFilaDocentes.paginator = this.paginador!;
  }

  cargarRegistros() {
    Swal.showLoading();
    this.docenteService.visualizarDocentes()
      .subscribe({
        next: (data) => {
          const docentes = data as Docente[];
          this.docentesExistentes = docentes;
        },
        error: () => {
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
          this.datosFilaDocentes.data = this.docentesExistentes;
          Swal.close();
        }
      });
  }

  eliminarDocente(docente: Docente) {
    Swal.fire({
      title: 'Eliminar docente',
      text: `¿Está seguro de eliminar el docente ${docente.nombreCompleto}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        // Eliminar docente por id
        this.docenteService.eliminarDocentePorID(docente.id!)
          .subscribe({
            next: () => {
              Swal.fire(
                'Eliminado',
                `Se ha eliminado el docente ${docente.nombreCompleto}.`,
                'success'
              );
              // Quitar del arreglo
              const indice = this.datosFilaDocentes.data.indexOf(
                this.datosFilaDocentes.data.find(fila => fila.id == docente.id)!
              );
              const docentes = this.datosFilaDocentes.data;
              docentes.splice(indice, 1)
              this.datosFilaDocentes.data = docentes;
            },
            // Error al eliminar
            error: (err) => {
              Swal.fire(
                'Error',
                `No se pudo eliminar el docente ${docente.nombreCompleto}.`,
                'error'
              );
            }
          });
      }
    });
  }

  crearVariosDocentes() {
    Swal.showLoading();
    if (this.archivoSeleccionado) {
      this.docenteService.crearVariosDocentes(this.archivoSeleccionado)
        .subscribe({
          next: (result: any) => {
            const substring = String(result.mensaje);
            if (substring.substr(-2) == "s.") {
              Swal.fire(
                'Archivo cargado exitosamente',
                result.mensaje,
                'success'
              ).then((result) => {
                if (result.isDismissed || result.isConfirmed) {
                  // Actualizar
                  this.datosFilaDocentes.data = [];
                  this.cargarRegistros();
                }
              });
            } else {
              const mensaje = `Se han creado ${result.docentesIngresados.length} registros. Hay ${result.docentesNoIngresados.length} repetidos.`;
              let numColumnas = (result.docentesNoIngresados.length > 8) ? 2 : 1;
              let anchoSwal = (result.docentesNoIngresados.length <= 4) ? '50vw' : '75vw';
              numColumnas = (result.docentesNoIngresados.length <= 4) ? 1 : numColumnas;
              const repetidos = `<div style="column-count: ${numColumnas};">` +
                '<p>' +
                result.docentesNoIngresados.map((r: Docente) => {
                  return r.nombreCompleto
                }).join('</p><p>') +
                '</p>' +
                '</div>'
              Swal.fire({
                title: 'Archivo cargado incompletamente',
                icon: 'info',
                html: '<h2>' + mensaje + '</h2>' + repetidos,
                width: anchoSwal
              }).then((result) => {
                if (result.isDismissed || result.isConfirmed) {
                  // Actualizar
                  this.datosFilaDocentes.data = [];
                  this.cargarRegistros();
                }
              });
            }
          },
          error: (result: any) => {
            Swal.fire(
              'Error',
              result.error.message,
              'error'
            ).then((result) => {
              if (result.isDismissed || result.isConfirmed) {
                this.archivoSeleccionado = undefined;
              }
            });
          },
          complete: () => {
            this.archivoSeleccionado = undefined;
          }
        });
    }
  }

  abrirCreacionDocente() {
    const dialogRef = this.dialog.open(CrearDocenteComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  abrirActualizacionDocente(docente: Docente) {
    const dialogRef = this.dialog.open(ActualizarDocenteComponent, {
      width: 'auto',
      height: 'auto',
      data: docente.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }


  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0] ?? undefined;
    if (this.archivoSeleccionado) {
      const fileReader = new FileReader();
      fileReader.readAsText(this.archivoSeleccionado);
      fileReader.onload = (e) => {
        console.log("LECTURA", fileReader.result);
      }
      this.crearVariosDocentes();
    }
  }

}
