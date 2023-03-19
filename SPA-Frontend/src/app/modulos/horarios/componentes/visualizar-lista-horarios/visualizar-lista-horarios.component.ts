import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';

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
    private readonly usuarioStorageService: UsuarioStorageService,
    private readonly horarioServicio: HorarioApiService,
    private readonly router: Router,
  ) { }

  horariosGeneradosExistentes: Horario[] = [];
  filtro?: FormControl;
  usuario?: Usuario;
  archivoSeleccionado?: File;

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
    this.cargarUsuario();
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datoFilaHorario.sort = this.tablaSort;
    this.datoFilaHorario.paginator = this.paginator!;
  }

  cargarUsuario(){
    this.usuario = this.usuarioStorageService.obtenerUsuario()
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

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0] ?? undefined;
    if (this.archivoSeleccionado) {
      const fileReader = new FileReader();
      fileReader.readAsText(this.archivoSeleccionado);
      fileReader.onload = (e) => {

        if(fileReader.result){
          Swal.fire({
            icon: 'success',
            title: 'Se ha cargado correctamente el archivo',
            showConfirmButton: false,
            timer: 1500
          })
        }

        console.log("LECTURA", fileReader.result);
      }
     this.procesarArchivoFet();
    }
  }

  procesarArchivoFet(){
    this.horarioServicio.cargarFET(this.archivoSeleccionado!!).subscribe({
      next: (result: any) => {
        console.log("archivo cargado completamente");
        window.location.reload();
      },
      complete: () => {
        window.location.reload();
      }
    });
  }

  test(){

    Swal.showLoading();
    if(this.usuario?.correo){
      const data = {
        email: this.usuario.correo
      }
      this.horarioServicio.generarHorario(data).subscribe(
        {
          next: (data) => {
            console.log("data", data);
            this.cargarRegistros();
            this.datoFilaHorario.data = this.horariosGeneradosExistentes;
            Swal.fire(
              'Horario generado correctamente',
              'Se ha generado un horario con el motor FET.',
              'success'
            )
          },
          error: (err) => {
            this.cargarRegistros();
            this.datoFilaHorario.data = this.horariosGeneradosExistentes;
            console.log("error", err)
          },
          complete: () => {
            this.cargarRegistros();
            this.datoFilaHorario.data = this.horariosGeneradosExistentes;
            window.location.reload();

          //  Swal.close();
          }
        
        }
      )
  
    }
  }
}
