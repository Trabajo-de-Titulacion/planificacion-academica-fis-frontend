import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Actividad, ActividadEntity } from '../../modelos/actividad.interface';
import { ActividadesApiService } from '../../servicios/actividades_api.service';
import { CrearActividadDialogComponent } from '../crear-actividad-dialog/crear-actividad-dialog.component';
import { ActualizarActividadComponent } from '../actualizar-actividad/actualizar-actividad.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mostrar-actividades',
  templateUrl: './mostrar-actividades.component.html',
  styleUrls: ['./mostrar-actividades.component.scss']
})
export class MostrarActividadesComponent implements OnInit, AfterViewInit {

  idActividadRuta: string = '';
  datoFilas = new MatTableDataSource<Actividad>([]);
  actividades: Actividad[] = [];
  columnas: string[] = ['asignatura', 'docente', 'tipoAula', 'numeroEstudiantes', 'grupo', 'duracion', 'restricciones'];
  @ViewChild(MatSort) tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginador?: MatPaginator;

  //Barra de busqueda
  actividad : ActividadEntity = {};
  searchControl = new FormControl('');
  //searchValue: string = '';

  constructor(
    public dialog: MatDialog,
    private readonly actividadesService: ActividadesApiService,
  ) { }
  ngAfterViewInit(): void {
    this.datoFilas.sort = this.tablaSort;
    this.datoFilas.paginator = this.paginador!;
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deje de escribir
      distinctUntilChanged() // Asegura que solo se dispare cuando el valor cambia
    ).subscribe(value => {
      this.applyFilter(); // Aplica el filtro al cambiar el valor del campo de búsqueda
    });
  }
  ngOnInit(): void {
    this.cargarActividades();
  }

  /*
  applyFilter(value: string): void {
    value = value.trim().toLowerCase(); // Elimina espacios en blanco y convierte a minúsculas
    this.datoFilas.filter = value; // Aplica el filtro al origen de datos de la tabla
  }
  */

  applyFilter(): void {
    const value = this.searchControl.value.trim().toLowerCase(); // Elimina espacios en blanco y convierte a minúsculas

    // Definir el filterPredicate para la asignatura
    this.datoFilas.filterPredicate = (data: ActividadEntity) => {
      const asignatura = data.asignatura ? data.asignatura.nombre.toLowerCase() : '';
      return asignatura.indexOf(value) !== -1;
    };

    this.datoFilas.filter = value; // Aplica el filtro al origen de datos de la tabla
  }


  cargarActividades() {
    Swal.showLoading();
    this.actividadesService.obtenerActividades().subscribe({
      next: (data) => {
        const actividades = data as Actividad[];
        this.actividades = actividades;
        this.datoFilas.data = this.actividades;

      },
      error: (Err) => {
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
        console.log("actividades", this.actividades);
        Swal.close();
      }
    })
  }

  abrirCrearActividadDialog() {
    const dialogRef = this.dialog.open(CrearActividadDialogComponent, {
      width: '110%',
      data: {
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      Swal.showLoading();
      this.cargarActividades();
    })
  }

  //Metodo para eliminar una actividad
  eliminarActividad(idActividad: number) {
    Swal.fire({
      title: 'Esta seguro de eliminar esta actividad?',
      text: "No se podrá revertir estos cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idActividad)
        this.actividadesService
          .eliminarActividadPorId(idActividad)
          .subscribe({
            next: () => {
              console.log("Test eliminar")
            },
            complete: () => {
              this.cargarActividades();
              Swal.fire({
                title: 'Actividad eliminada!',
                text: "Se ha eliminado correctamente la actividad",
                icon: 'success',
                timer: 5000
              })
            },
            error: (error) => {
              this.cargarActividades();
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar la actividad',
              })
            }
          })
      }
    })
  }

  //FUncionalidad de la barra de bùsqueda


}
