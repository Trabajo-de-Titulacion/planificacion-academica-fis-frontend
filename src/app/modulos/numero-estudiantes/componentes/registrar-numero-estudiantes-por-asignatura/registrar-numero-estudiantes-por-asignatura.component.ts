import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asignatura } from 'src/app/modulos/asignaturas/modelos/asignatura.interface';
import { AsignaturaApiService } from 'src/app/modulos/asignaturas/servicios/asignaturas_api.service';
import Semestre from 'src/app/modulos/parametros-inciales/models/semestre.interface';
import { SemestreService } from 'src/app/modulos/parametros-inciales/services/semestre-api.service';
import Swal from 'sweetalert2';
import { NumeroEstudiantesPorSemestre } from '../../modelos/numeroEstudiantesPorSemestre.interface';
import { NumeroEstudiantesApiService } from '../../servicios/numeroEstudiantesApi.service';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { RolesEnum } from 'src/app/servicios/auth/enum/roles.enum';

@Component({
  selector: 'app-registrar-numero-estudiantes-por-asignatura',
  templateUrl: './registrar-numero-estudiantes-por-asignatura.component.html',
  styleUrls: ['./registrar-numero-estudiantes-por-asignatura.component.scss']
})
export class RegistrarNumeroEstudiantesPorAsignaturaComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly asignaturaService: AsignaturaApiService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly numeroEstudiantesService: NumeroEstudiantesApiService,
    private readonly semestreService: SemestreService,
  ) { }

  semestreEnCurso?: Semestre;
  asignaturasExistentes: Asignatura[] = [];

  datoFilas = new MatTableDataSource<NumeroEstudiantesPorSemestre>([]);
  columnas: string[] = ['codigo', 'nombre', 'numeroEstudiantes'];
  @ViewChild(MatSort) tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginador?: MatPaginator;

  configuracion = { max: 200 };
  formGroup: FormGroup = new FormGroup({});
  btnGuardarHabilitado: boolean = false;

  //Rol de usuarios
  usuario?: Usuario;

  ngOnInit(): void {
    this.cargarSemestreEnCurso();
  }

  ngAfterViewInit(): void {
    this.datoFilas.sort = this.tablaSort;
    this.datoFilas.sortingDataAccessor = (item: any, propiedad) => {
      switch (propiedad) {
        case 'codigo': {
          return item.asignatura.codigo;
        }
        case 'nombre': {
          return item.asignatura.nombre;
        }
      }
    };
    this.datoFilas.paginator = this.paginador!;
  }

  cargarSemestreEnCurso() {
    Swal.showLoading();
    this.semestreService.obtenerSemestreConPlanificacionEnProgreso().subscribe({
      next: (semestre) => {
        if (!semestre) {
          this.mostrarMensajeError('No existe un semestre con planificación en curso.');
        } else {
          this.semestreEnCurso = semestre;
          this.cargarAsignaturas();
        }
      },
      error: (res) => {
        this.mostrarMensajeError(res.error.message);
      }
    });
  }

  cargarAsignaturas() {
    this.asignaturaService.obtenerAsignaturas().subscribe({
      next: (asignaturas) => {
        this.asignaturasExistentes.push(...(asignaturas as Asignatura[]));
        this.cargarDatosPrevios();
      },
      error: () => {
        this.mostrarMensajeError('No se pudieron cargar las asignaturas.');
      }
    });
  }

  cargarDatosPrevios() {
    this.numeroEstudiantesService.obtenerNumeroEstudiantesPorSemestreId(this.semestreEnCurso!.id)
      .subscribe({
        next: (registrosPrevios) => {
          const filas: NumeroEstudiantesPorSemestre[] = this.asignaturasExistentes.map(asignatura => {
            return {
              numeroEstudiantes: 0,
              asignatura: asignatura,
              semestre: this.semestreEnCurso!,
            }
          });
          registrosPrevios.forEach(numEstudAsign => {
            filas.forEach(dato => {
              if (dato.asignatura!.id! == numEstudAsign.asignatura!.id) {
                dato.numeroEstudiantes = numEstudAsign.numeroEstudiantes;
              }
            })
          });
          this.datoFilas.data = filas;

          filas.forEach(dato => {
            const control = new FormControl({ value: dato.numeroEstudiantes, disabled: false });
            this.formGroup.setControl(dato.asignatura!.codigo, control);
          });
          this.btnGuardarHabilitado = true;
        },
        error: () => {
          this.mostrarMensajeError('No se pudo cargar el número de estudiantes previamente registrado.');
        },
        complete: () => {
          Swal.close();
        }
      });
  }

  mostrarMensajeError(mensaje: string) {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      showCancelButton: true,
      confirmButtonText: 'Reiniciar página',
      cancelButtonText: 'Cerrar',
      icon: 'error',
    }
    ).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }

  guardarCambios() {
    if (this.formGroup.invalid || !this.btnGuardarHabilitado)
      return

    Swal.showLoading();
    this.btnGuardarHabilitado = false;
    const datosRegistro = this.datoFilas.data.map(numEst => {
      const registro: NumeroEstudiantesPorSemestre = {
        idSemestre: this.semestreEnCurso!.id,
        idAsignatura: numEst.asignatura!.id!,
        numeroEstudiantes: this.formGroup.get(numEst.asignatura!.codigo)!.value,
      }
      return registro;
    });
    this.numeroEstudiantesService.registrarNumeroEstudiantesPorSemestre(datosRegistro)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Datos actualizados', res.mensaje, 'success');
          this.btnGuardarHabilitado = true;
        },
        error: (res: any) => {
          Swal.fire('Error', res.error.message, 'error');
          this.btnGuardarHabilitado = true;
        },
      });

  }

  //Verificaciòn de rol
  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.ASISTENTE_ACADEMICO);
  }

}
