import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EspaciosFisicosApiService } from 'src/app/servicios/espacios_fisicos/espacios_fisicos_api.service';
import { EspacioFisico } from 'src/app/servicios/espacios_fisicos/interfaces/espacio_fisico.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-espacios-fisicos',
  templateUrl: './mostrar-espacios-fisicos.component.html',
  styleUrls: ['./mostrar-espacios-fisicos.component.scss']
})
export class MostrarEspaciosFisicosComponent implements OnInit {

  constructor(
    private readonly espaciosFisicosService: EspaciosFisicosApiService,
    private readonly router: Router,
  ) { }

  espaciosFisicos = new MatTableDataSource<EspacioFisico>([]);
  archivoSeleccionado?: File;
  @ViewChild('fileInput')
  fileInput: any;

  displayedColumns: string[] = ['nombre', 'tipo', 'aforo', 'acciones'];
  rutaActual = this.router.url;

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros() {
    Swal.showLoading();
    this.espaciosFisicosService.obtenerEspaciosFisicos()
      .subscribe({
        next: (data) => {
          const espacios_fisicos = data as EspacioFisico[];
          this.espaciosFisicos.data = espacios_fisicos;
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudieron obtener los registros.',
            'error'
          ).then((result) => {
            if (result.isDismissed || result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        complete: () => {
          Swal.close();
        }
      });
  }

  eliminarEspacioFisico(espacio_fisico: EspacioFisico) {
    Swal.fire({
      title: 'Eliminar espacio físico',
      text: `¿Está seguro de eliminar el ${espacio_fisico.tipo_id} "${espacio_fisico.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {

      if (result.isConfirmed) {
        Swal.showLoading();
        // Eliminar espacio fisico
        this.espaciosFisicosService.eliminarEspacioFisico(espacio_fisico.id!)
          .subscribe({
            // Si se eliminó correctamente
            next: () => {
              Swal.fire(
                'Eliminado',
                `Se ha eliminado el ${espacio_fisico.tipo_id} "${espacio_fisico.nombre}"?`,
                'success'
              );
              // Quitar del arreglo
              const indice = this.espaciosFisicos.data.indexOf(espacio_fisico);
              const espacios_fisicos = this.espaciosFisicos.data;
              espacios_fisicos.splice(indice, 1)
              this.espaciosFisicos.data = espacios_fisicos;
            },
            // Error al eliminar
            error: (err) => {
              Swal.fire(
                'Error',
                `No se pudo eliminar el ${espacio_fisico.tipo_id} "${espacio_fisico.nombre}"?`,
                'error'
              );
              console.error(err);
            }
          });
      }

    })
  }

  crearMultiplesEspaciosFisicos() {
    Swal.showLoading();
    if (this.archivoSeleccionado) {
      this.espaciosFisicosService.crearMultiplesEspaciosFisicos(this.archivoSeleccionado)
        .subscribe({
          next: (res: any) => {
            Swal.fire(
              'Archivo cargado exitosamente!',
              res.mensaje,
              'success'
            ).then((result) => {
              if (result.isDismissed || result.isConfirmed) {
                // Actualizar 
                this.espaciosFisicos.data = [];
                this.cargarRegistros();
              }
            });
          },
          error: (res: any) => {
            Swal.fire(
              'Error',
              res.error.message,
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

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0] ?? undefined;

    if (this.archivoSeleccionado) {

      const fileReader = new FileReader();
      fileReader.readAsText(this.archivoSeleccionado);
      fileReader.onload = (e) => {
        console.log("LECTURA");
        console.log(fileReader.result);
      }

      this.crearMultiplesEspaciosFisicos();
      
    }

  }

}
