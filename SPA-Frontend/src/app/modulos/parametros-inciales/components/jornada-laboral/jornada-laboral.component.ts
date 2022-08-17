import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Component, Input, OnInit } from '@angular/core';

import JornadaLaboral from '../../models/jornada-laboral.interface';
import { JornadaLaboralApiService } from '../../services/jornada-laboral-api.service';
import Semestre from '../../models/semestre.interface';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-jornada-laboral',
  templateUrl: './jornada-laboral.component.html',
  styleUrls: ['./jornada-laboral.component.scss', '../../styles/common.scss']
})
export class JornadaLaboralComponent implements OnInit {

  @Input() semestre?: Semestre;

  diasLaborables: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  disabled = false;
  edicionHabilitada = false;
  formularioJornadaLaboral: FormGroup = new FormGroup({});
  jornadasSemestre?: JornadaLaboral[]
  horasAlmuerzo = ["12:00", "13:00", "14:00"]
  inputsDisabled = true;
  inputType = 'number';
  intervalosHoras = this.crearIntervalos(5, 23);
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private servicioJornadaLaboral: JornadaLaboralApiService,
  ) { }

  async ngOnInit() {
    await this.obtenerJornadasDelSemestre(this.semestre?.id);
    await this.crearFormulario();
  }

  async ngOnChanges(changes: any) {
    this.isLoading = true;
    this.edicionHabilitada = false;
    await this.obtenerJornadasDelSemestre(this.semestre?.id);
    await this.crearFormulario();
  }

  private async crearFormulario() {
    /* Cuando el semestre cuenta con horas y días laborables */
    if (this.jornadasSemestre && this.jornadasSemestre.length !== 0) {
      const jornada = this.jornadasSemestre[0];
      const dias = this.jornadasSemestre.map(jornada => jornada.dia)
      this.formularioJornadaLaboral = this.fb.group({
        horaInicio: [{ value: jornada.horaInicio, disabled: this.inputsDisabled }, [Validators.required]],
        horaFin: [{ value: jornada.horaFin, disabled: this.inputsDisabled }, [Validators.required]],
        horaAlmuerzo: [{ value: jornada.horaAlmuerzo, disabled: this.inputsDisabled }, [Validators.required]],
        dias: [{ value: dias, disabled: this.inputsDisabled }, [Validators.required]],
      });
    }
    /* Cuando el semestre cuenta con horas y días laborables */
    else {
      this.formularioJornadaLaboral = this.fb.group({
        horaInicio: ['', [Validators.required]],
        horaFin: ['', [Validators.required]],
        horaAlmuerzo: ['', Validators.required],
        dias: [[], [Validators.required]],
      });
    }
    this.isLoading = false;
  }

  private crearIntervalos(horaInicio: number, horaFin: number) {
    const intervalos = [];
    for (let hora = horaInicio; hora <= horaFin; hora++) {
      intervalos.push(`${hora < 10 ? '0' + hora : hora}:00`)
    }
    return intervalos;
  }

  async crearJornadaLaboral() {

    // Propiedades de jornada laboral
    const dias = this.formularioJornadaLaboral.value.dias;
    const horaAlmuerzo = this.formularioJornadaLaboral.value.horaAlmuerzo;
    const horaFin = this.formularioJornadaLaboral.value.horaFin;
    const horaInicio = this.formularioJornadaLaboral.value.horaInicio;
    const idSemestre = this.semestre?.id;

    if (horaInicio && horaFin) {

      // Si la hora de almuerzo es mayor que la de inicio y menor que la de fin de jornada
      const horaAlmuerzoValida = parseInt(horaInicio.split(":"[0])) < parseInt(horaAlmuerzo.split(":")[0])
        && parseInt(horaAlmuerzo.split(":")[0]) < parseInt(horaFin.split(":")[0])

      if (horaAlmuerzoValida) {

        // Si la hora de fin jornada es mayor a la del inicio
        const horaInicioFinValida = parseInt(horaInicio.split(":"[0])) < parseInt(horaAlmuerzo.split(":")[0])

        if (horaInicioFinValida) {
          if (dias.length >= 1 && idSemestre) {

            dias.forEach((dia: string) => {
              const jornada: JornadaLaboral = {
                horaInicio,
                horaFin,
                dia: dia.toUpperCase(),
                horaAlmuerzo,
                idSemestre
              };
              this.servicioJornadaLaboral.crearJornadaLaboral(jornada).subscribe(
                async _ => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Jornada laboral creada',
                    text: `Se ha creado la jornada laboral del semestre ${this.semestre?.abreviatura}`
                  })
                  this.isLoading = true;
                  this.edicionHabilitada = false;
                  this.inputsDisabled = true;
                  await this.obtenerJornadasDelSemestre(this.semestre?.id);
                  await this.crearFormulario();
                }
              );
            });
          } else {

            Swal.fire({
              icon: 'error',
              title: 'Seleccione días para jornada laboral',
              text: 'La hora de almuerzo no debe ser cercana a la hora de inicio o la hora final de la jornada.',
            })
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente la hora de almuerzo',
            text: 'La hora de almuerzo no debe ser cercana a la hora de inicio o la hora final de la jornada.',
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ingrese correctamente la hora de almuerzo',
          text: 'La hora de almuerzo no debe ser cercana a la hora de inicio o la hora final de la jornada.',
        })
      }
    }
  }

  habilitarEdicion() {
    this.inputsDisabled = true;
    this.edicionHabilitada = true;
    this.formularioJornadaLaboral.enable();
  }

  private async obtenerJornadasDelSemestre(idSemestre?: string) {
    if (idSemestre) {
      this.jornadasSemestre = await lastValueFrom(this.servicioJornadaLaboral.obtenerJornadaLaboralPorSemestre(idSemestre));
    }
  }
}