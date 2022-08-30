import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Docente } from 'src/app/modulos/docentes/modelos/docente.interface';
import { DocenteApiService } from 'src/app/modulos/docentes/servicios/docentes_api.service';
import { Grupo } from 'src/app/modulos/grupos/modelos/grupo.interface';
import { GrupoApiService } from 'src/app/modulos/grupos/servicios/grupo_api.service';
import JornadaLaboral from 'src/app/modulos/parametros-inciales/models/jornada-laboral.interface';
import { SemestreService } from 'src/app/modulos/parametros-inciales/services/semestre-api.service';
import Swal from 'sweetalert2';
import { Horario } from '../../modelos/horario.interface';
import { HorarioGrupo } from '../../modelos/horarioGrupo.interface';
import { HorarioApiService } from '../../servicios/horarios_api.service';

interface Hora {
  hora: number,
  rangoHoras: string
}

@Component({
  selector: 'app-visualizar-horario',
  templateUrl: './visualizar-horario.component.html',
  styleUrls: ['./visualizar-horario.component.scss']
})
export class VisualizarHorarioComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly ruta: ActivatedRoute,
    private readonly horarioService: HorarioApiService,
    private readonly docenteService: DocenteApiService,
    private readonly semestresService: SemestreService,
    private readonly grupoService: GrupoApiService,
  ) { }

  columnasTabla: string[] = ['HORA'];
  datoFilasTabla = new MatTableDataSource<Hora>([]);
  jornadasLaborales?: JornadaLaboral[];

  horarioJSON?: Horario;
  arregloDocentes?: Docente[];

  arregloGrupos?: Grupo[];

  params$?: Subscription;

  cargando: boolean = false;

  ngOnInit(): void {
    Swal.showLoading();
    this.params$ = this.ruta.params.subscribe({
      next: (params) => {
        const idHorario = String(params['id']);
        this.obtenerDocentes();
        this.obtenerGrupos();
      },
      error: (res) => {
        this.redireccionarTrasError(res);
      }
    });

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
        Swal.close()
      },
      error: () => {
        this.mostrarMensajeError();
      },
    });
  }

  crearFilasTabla() {
    // Identificar horas mínima y máxima
    let horaMinima = 24;
    let horaMaxima = 0;
    for (let jornada of this.jornadasLaborales!) {
      const horaInicio = Number(jornada.horaInicio.split(':')[0]);
      const horaFin = Number(jornada.horaFin.split(':')[0]);
      horaMinima = (horaInicio < horaMinima) ? horaInicio : horaMinima;
      horaMaxima = (horaFin > horaMaxima) ? horaFin : horaMaxima;
    }

    const rangoHoras = horaMaxima - horaMinima;

    for (let indice = 0; indice < rangoHoras; indice++) {
      const hora = horaMinima + indice;
      const horaSemana = {
        hora: hora,
        rangoHoras: `${hora}:00 - ${hora + 1}:00`,
      };
      this.datoFilasTabla.data.push(horaSemana);
    }
  }


  obtenerDocentes() {
    this.docenteService.visualizarDocentes()
      .subscribe({
        next: (result) => {
          this.arregloDocentes = result as Docente[];
          console.log(this.arregloGrupos)
        },
        error: (error) => {
          Swal.fire(
            'Error',
            'No se pudo obtener los datos de los docentes.',
            'error'
          )
        }
      });
  }

  obtenerGrupos() {
    this.grupoService.obtenerGrupos()
      .subscribe({
        next: (result) => {
          this.arregloGrupos = result as Grupo[];
        },
        error: (error) => {
          Swal.fire(
            'Error',
            'No se pudo obtener los datos de los grupos.',
            'error'
          )
        }
      });
  }

  redireccionarTrasError(res: any) {
    Swal.fire('Error', res.error.message, 'error')
      .then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.router.navigate(['/spa', 'horarios']);
        }
      });
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

  ngOnDestroy(): void {
    if (this.params$) {
      this.params$.unsubscribe();
    }
  }
}
