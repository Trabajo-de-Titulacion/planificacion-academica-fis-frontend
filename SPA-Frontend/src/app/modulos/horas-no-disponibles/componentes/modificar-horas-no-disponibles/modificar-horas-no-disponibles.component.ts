import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DISPONIBILIDAD, HoraSemana } from '../../modelos/horaSemana.interface';
import Swal from 'sweetalert2';
import { HoraNoDisponible } from '../../modelos/hora_no_disponible.interface';
import { SemestreService } from 'src/app/modulos/parametros-inciales/services/semestre.service';
import { HorasNoDisponiblesApiService } from '../../servicios/horas-no-disponibles-api.service';
import { DocenteApiService } from 'src/app/modulos/docentes/servicios/docentes_api.service';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import JornadaLaboral from 'src/app/modulos/parametros-inciales/models/jornada-laboral.interface';
import { Docente } from 'src/app/modulos/docentes/modelos/docente.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modificar-horas-no-disponibles',
  templateUrl: './modificar-horas-no-disponibles.component.html',
  styleUrls: ['./modificar-horas-no-disponibles.component.scss']
})
export class ModificarHorasNoDisponiblesComponent implements OnInit, OnDestroy {

  constructor(
    private readonly semestresService: SemestreService,
    private readonly horasNoDisponiblesService: HorasNoDisponiblesApiService,
    private readonly docenteService: DocenteApiService,
    private readonly usuarioStorageService: UsuarioStorageService,
  ) { }

  columnasTabla: string[] = ['HORA'];
  datoFilasTabla = new MatTableDataSource<HoraSemana>([]);
  disponibilidad = DISPONIBILIDAD;

  jornadasLaborales?: JornadaLaboral[];
  docenteActual?: Docente;
  horasNoDisponiblesPrevias: HoraNoDisponible[] = [];
  
  formGroup: FormGroup = new FormGroup({});
  controles: FormControl[] = [];
  totalSeleccionados: number = 0;

  cambiosForm$?: Subscription;
  btnDesmarcarHabilitado: boolean = false;
  btnGuardarHabilitado: boolean = false;


  ngOnInit(): void {
    this.cargarJornadasLaborales();
  }

  cargarJornadasLaborales() {
    Swal.showLoading();
    this.semestresService.obtenerSemestreConPlanificacionEnProgreso().subscribe({
      next: (semestre) => {
        // Se obtienen las jornadas laborales
        this.jornadasLaborales = semestre.jornadas;

        // Ordenar datos en la semana
        const dias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
        dias.forEach(dia => {
          this.jornadasLaborales!.forEach(jornada => {
            if (jornada.dia.toUpperCase() == dia) {
              this.columnasTabla.push(jornada.dia);
            }
          });
        });
        // Crear filas en la tabla
        this.crearFilasTabla();
        // Cargar información de las horas del usuario
        this.cargarHorasNoDisponiblesPrevias();
      },
      error: () => {
        this.mostrarMensajeError();
      },
    });
  }

  cargarHorasNoDisponiblesPrevias() {
    const usuario = this.usuarioStorageService.obtenerUsuario();
    if (usuario.correo) {
      this.docenteService.visualizarDocentePorCorreoElectronico(usuario.correo)
      .subscribe({
        next: (docente) => {
          this.docenteActual = docente;
          this.horasNoDisponiblesService.obtenerHorasNoDisponiblesPorDocenteId(docente.id!)
          .subscribe({
            next: (horasNoDisponibles) => {
              this.horasNoDisponiblesPrevias = horasNoDisponibles;
              // Inicializa los valores como 'true'
              horasNoDisponibles.forEach(hora => {
                const nombreControl = this.obtenerNombreControl(hora.dia!.dia, hora.hora_inicio);
                this.formGroup.get(nombreControl)!.setValue(true);
                this.totalSeleccionados += 1;
              });
            },
            error: () => {
              this.mostrarMensajeError();
            },
            complete: () => {
              Swal.close();
              this.escucharCambiosControles();
              // Si hay botones activados, se puede usar el botón 'Desmarcar todo'
              if (this.controles.some(control => control.value)) {
                this.btnDesmarcarHabilitado = true;
              }
            }
          })
        },
        error: () => {
          this.mostrarMensajeError();
        }
      })
    }
  }

  mostrarMensajeError() {
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron obtener los registros.',
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

  crearFilasTabla() {
    // Identificar horas mínima y máxima
    let horaMinima = 24;
    let horaMaxima = 0;
    for (let jornada of this.jornadasLaborales!) {
      const horaInicio = Number(jornada.horaInicio.split(':')[0]);
      const horaFin = Number(jornada.horaFin.split(':')[0]);
      horaMinima = (horaInicio < horaMinima)? horaInicio : horaMinima;
      horaMaxima = (horaFin > horaMaxima)? horaFin : horaMaxima;
    }

    const rangoHoras = horaMaxima - horaMinima;

    for (let indice = 0; indice < rangoHoras; indice++) {
      const hora = horaMinima + indice;
      const horaSemana: HoraSemana = {
        hora: hora,
        rangoHoras: `${hora}:00 - ${hora + 1}:00`,
        LUNES: this.obtenerDisponibilidad('LUNES', hora),
        MARTES: this.obtenerDisponibilidad('MARTES', hora),
        MIÉRCOLES: this.obtenerDisponibilidad('MIÉRCOLES', hora),
        JUEVES: this.obtenerDisponibilidad('JUEVES', hora),
        VIERNES: this.obtenerDisponibilidad('VIERNES', hora),
        SÁBADO: this.obtenerDisponibilidad('SÁBADO', hora),
        DOMINGO: this.obtenerDisponibilidad('DOMINGO', hora)
      };
      this.datoFilasTabla.data.push(horaSemana);
    }
  }

  obtenerDisponibilidad(dia: string, hora: number): DISPONIBILIDAD {
    const jornadaCorrespondiente = this.jornadasLaborales?.find(jornada => {
      return jornada.dia == dia.toUpperCase();
    });
    if (jornadaCorrespondiente) {
      const horaInicio = Number(jornadaCorrespondiente.horaInicio.split(':')[0]);
      const horaFin = Number(jornadaCorrespondiente.horaFin.split(':')[0]);
      const horaAlmuerzo = Number(jornadaCorrespondiente.horaAlmuerzo.split(':')[0]);
      if ((horaInicio <= hora) && (hora < horaFin)) {
        if (hora == horaAlmuerzo) {
          return DISPONIBILIDAD.ALMUERZO;
        }
        // Se crea el control cuando es una hora que se pueda seleccionar
        this.crearControl(dia, hora);
        return DISPONIBILIDAD.DISPONIBLE;
      }
    }
    return DISPONIBILIDAD.NO_DISPONIBLE;
  }

  crearControl(dia: string, hora: number) {
    // Crear control (checkbox) cuando la hora está disponible
    const control = new FormControl({ value: false, disabled: false });
    const nombreControl = this.obtenerNombreControl(dia, hora);
    // Asocia el control al FormGroup
    this.formGroup.setControl(nombreControl, control);
    // Almacena los controles en un arreglo
    this.controles.push(control);
  }

  // Devuelve un nombre (para un control) a partir de un día y una hora
  obtenerNombreControl(dia: string, hora: number): string {
    return `${dia}-${hora}-${hora + 1}`;
  }

  // Devuelve el día y la hora a partir del nombre de un control
  obtenerDiaYHoraDelNombreControl(nombre: string) {
    const dia = nombre.split('-')[0];
    const hora = Number(nombre.split('-')[1]);
    return { dia: dia, hora: hora };
  }

  escucharCambiosControles() {
    this.cambiosForm$ = this.formGroup.valueChanges.subscribe({
      next: () => {
        // El botón de guardar se habilita solo si hay cambios en comparación con los valores iniciales
        const huboCambios = Object.entries(this.formGroup.value).some(([nombreControl, seleccionado]) => {
          // Revisa las horas previamente seleccionadas
          for (let horaNoDisponible of this.horasNoDisponiblesPrevias) {
            const nombreHoraPrevia = this.obtenerNombreControl(horaNoDisponible.dia!.dia, horaNoDisponible.hora_inicio);
            // Hora que inicialmente estuvo activada
            if (nombreHoraPrevia == nombreControl) {
              return !seleccionado; // Cambio: Se deseleccionó
            }
          }
          // Hora que inicialmente no estuvo seleccionada
          return seleccionado; // Cambio: Se seleccionó
        });
        this.btnGuardarHabilitado = huboCambios;

        // El botón de desmarcar se habilita solo si hay al menos un control seleccionado
        this.btnDesmarcarHabilitado = this.controles.some(c => c.value);

        // Actualizar total de controles seleccionados
        this.totalSeleccionados = this.controles.filter(c => c.value).length;
      }
    });
  }

  desmarcarTodo() {
    if ((this.controles.length > 0) && this.btnDesmarcarHabilitado) {
      this.controles.forEach(control => {
        control.setValue(false);
      });
      this.btnDesmarcarHabilitado = false;
    }
  }

  marcarODesmarcarFila(fila: HoraSemana) {
    const controlesFila: AbstractControl[] = [];
    Object.entries(this.formGroup.value).forEach(([nombreControl, seleccionado]) => {
      const { hora } = this.obtenerDiaYHoraDelNombreControl(nombreControl);
      if (hora == fila.hora) {
        controlesFila.push(this.formGroup!.get(nombreControl)!);
      }
    });
    // Si toda la fila está seleccionada
    if (controlesFila.every(c => c.value)) {
      controlesFila.forEach(c => c.setValue(false)); // Se deselecciona la fila
    } else {
      controlesFila.forEach(c => c.setValue(true));  // Se selecciona la fila
    }
  }

  guardarCambios() {
    if (this.formGroup.valid && this.btnGuardarHabilitado) {
      this.btnGuardarHabilitado = false;
      Swal.showLoading();
      const registrosACrear: HoraNoDisponible[] = [];
      // Iterar por cada control del FormGroup
      Object.entries(this.formGroup.value).forEach(([nombreControl, seleccionado]) => {
        if (seleccionado) {
          const {dia, hora} = this.obtenerDiaYHoraDelNombreControl(nombreControl);
          const jornada = this.jornadasLaborales!.find(j => j.dia == dia);
          // Registro a crear
          const horaNoDisponible: HoraNoDisponible = {
            hora_inicio: hora,
            dia_id: jornada!.id!,
            dia: jornada,
            docente_id: this.docenteActual!.id!,
          }
          // Guardar en arreglo
          registrosACrear.push(horaNoDisponible);
        }
      });

      // Se registran horas no disponibles
      if (registrosACrear.length > 0) {
        // Enviar al servicio y crear las horas seleccionadas
        this.horasNoDisponiblesService.crearHorasNoDisponibles(registrosACrear)
        .subscribe({
          next: (res: any) => {
            Swal.fire('Horas no disponibles actualizadas exitosamente', `${res.mensaje}`, 'success');
            this.horasNoDisponiblesPrevias = registrosACrear;
            this.btnGuardarHabilitado = false;
          },
          error: (res) => {
            Swal.fire('Error', `${res.error.message}`, 'error');
            this.btnGuardarHabilitado = true;
          }
        });
      }
      // Si todas las horas han sido desmarcadas
      else {
        // Eliminar todas las horas previamente registradas
        this.horasNoDisponiblesService.eliminarHorasNoDisponiblesPorDocenteId(this.docenteActual!.id!)
        .subscribe({
          next: (res: any) => {
            Swal.fire('Horas no disponibles actualizadas exitosamente', '', 'success');
            this.horasNoDisponiblesPrevias = [];
            this.btnGuardarHabilitado = false;
          },
          error: (res) => {
            Swal.fire('Error', `${res.error.message}`, 'error');
            this.btnGuardarHabilitado = true;
          }
        });
      }

    }
  }

  ngOnDestroy(): void {
    if (this.cambiosForm$) {
      this.cambiosForm$.unsubscribe();
    }
  }
}
