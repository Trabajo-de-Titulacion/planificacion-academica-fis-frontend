import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import JornadaLaboral from 'src/app/modulos/parametros-inciales/models/jornada-laboral.interface';
import { SemestreService } from 'src/app/modulos/parametros-inciales/services/semestre-api.service';
import Swal from 'sweetalert2';
import ESTADO_SOLICITUD_HORA_NO_DISPONIBLE from '../../enum/estadoSolicitudHoraNoDisponible.enum';
import { DISPONIBILIDAD, HoraSemana } from '../../modelos/horaSemana.interface';
import { HoraNoDisponible } from '../../modelos/hora_no_disponible.interface';
import { SolicitudHoraNoDisponible } from '../../modelos/solicitudHoraNoDisponible.interface';
import { HorasNoDisponiblesApiService } from '../../servicios/horas-no-disponibles-api.service';

@Component({
  selector: 'app-aprobar-rechazar-solicitudes',
  templateUrl: './aprobar-rechazar-solicitudes.component.html',
  styleUrls: ['./aprobar-rechazar-solicitudes.component.scss']
})
export class AprobarRechazarSolicitudesComponent implements OnInit, OnDestroy {

  constructor(
    private readonly horasNoDisponiblesService: HorasNoDisponiblesApiService,
    private readonly semestresService: SemestreService,
    private readonly ruta: ActivatedRoute,
    private readonly router: Router,
  ) { }

  columnasTabla: string[] = ['HORA'];
  datoFilasTabla = new MatTableDataSource<HoraSemana>([]);
  filas: HoraSemana[] = [];
  disponibilidad = DISPONIBILIDAD;
  params$?: Subscription;
  jornadasLaborales?: JornadaLaboral[];
  idDocenteActual?: string;
  solicitud?: SolicitudHoraNoDisponible;
  horasNoDisponiblesDelDocente: HoraNoDisponible[] = [];
  btnAprobarHabilitado: boolean = false;
  btnRechazarHabilitado: boolean = false;
  mensajeAprobado: boolean = false;

  ngOnInit(): void {
    Swal.showLoading();
    this.params$ = this.ruta.params.subscribe({
      next: (params) => {
        this.idDocenteActual = String(params['id']);
        this.cargarJornadasLaborales();
      },
      error: (res) => {
        this.mostrarMensajeError(res.error);
      }
    });
  }

  cargarJornadasLaborales() {
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
        // Cargar información de las horas del docente
        this.cargarHorasNoDisponiblesDelDocente();
      },
      error: (res) => {
        this.mostrarMensajeError(res.error);
      },
    });
  }

  cargarHorasNoDisponiblesDelDocente() {
    this.horasNoDisponiblesService.obtenerHorasNoDisponiblesSolicitadasPorDocenteId(this.idDocenteActual!)
      .subscribe({
        next: (horasNoDisponibles) => {
          if (horasNoDisponibles.length == 0) {
            Swal.fire({
              title: 'El docente no ha creado una solicitud',
              showCancelButton: true,
              confirmButtonText: 'Reiniciar página',
              cancelButtonText: 'Regresar',
              icon: 'info',
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
              if (result.isDismissed) {
                this.router.navigate(['/spa', 'horas_no_disponibles', 'solicitudes']);
              }
            });
          } else {
            this.horasNoDisponiblesDelDocente = horasNoDisponibles;
            this.solicitud = this.horasNoDisponiblesDelDocente[0].solicitud!;
            if (this.solicitud?.estado == ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.POR_REVISAR) {
              this.btnAprobarHabilitado = true;
              this.btnRechazarHabilitado = true;
            } else {
              this.mensajeAprobado = true;
            }
            // Crear filas en la tabla
            this.crearFilasTabla();
            this.datoFilasTabla.data = this.filas;
            Swal.close();
          }
        },
        error: (res: any) => {
          this.mostrarMensajeError(res.error);
        },
      });
  }

  mostrarMensajeError(error: any) {
    Swal.fire({
      title: 'Error',
      text: `No se pudieron obtener los registros. ${error.message}`,
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
      this.filas.push(horaSemana);
    }
  }

  obtenerDisponibilidad(dia: string, hora: number): DISPONIBILIDAD {
    const horaNoDisponible = this.horasNoDisponiblesDelDocente.find(h => {
      return (h.dia!.dia.toUpperCase() == dia.toUpperCase()) && (h.hora_inicio == hora);
    });
    if (horaNoDisponible) {
      return DISPONIBILIDAD.NO_DISPONIBLE
    }
    return DISPONIBILIDAD.DISPONIBLE;
  }

  aprobarSolicitud() {
    if (this.solicitud && this.solicitud.estado == ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.POR_REVISAR && this.btnAprobarHabilitado) {
      this.btnAprobarHabilitado = false;
      this.btnRechazarHabilitado = false;
      Swal.showLoading();
      this.horasNoDisponiblesService.aprobarSolicitudHorasNoDisponiblesPorDocenteId(this.idDocenteActual!)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Solicitud aprobada', `${res.mensaje}`, 'success');
          this.mensajeAprobado = true;
        },
        error: (res: any) => {
          Swal.fire('Solicitud aprobada', `${res.error.message}`, 'warning');
          this.mensajeAprobado = true;
        }
      });
    }
  }

  rechazarSolicitud() {
    if (this.solicitud && this.solicitud.estado == ESTADO_SOLICITUD_HORA_NO_DISPONIBLE.POR_REVISAR && this.btnAprobarHabilitado) {
      this.btnAprobarHabilitado = false;
      this.btnRechazarHabilitado = false;
      Swal.showLoading();
      this.horasNoDisponiblesService.rechazarSolicitudHorasNoDisponiblesPorDocenteId(this.idDocenteActual!)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Solicitud rechazada', `${res.mensaje}`, 'success')
          .then((result) => {
            this.router.navigate(['/spa', 'horas_no_disponibles', 'solicitudes']);
          });
        },
        error: (res: any) => {
          Swal.fire('Solicitud rechazada', `${res.error.message}`, 'warning')
          .then((result) => {
            this.router.navigate(['/spa', 'horas_no_disponibles', 'solicitudes']);
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.params$) {
      this.params$.unsubscribe();
    }
  }

}
