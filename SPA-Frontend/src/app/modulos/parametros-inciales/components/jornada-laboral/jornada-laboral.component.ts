import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Component, Input, OnInit } from '@angular/core';

import JornadaLaboral from '../../models/jornada-laboral.interface';
import { JornadaLaboralService } from '../../services/jornada-laboral.service';
import Semestre from '../../models/semestre.interface';

@Component({
  selector: 'app-jornada-laboral',
  templateUrl: './jornada-laboral.component.html',
  styleUrls: ['./jornada-laboral.component.scss', '../../styles/common.scss']
})
export class JornadaLaboralComponent implements OnInit {

  @Input() semestre?: Semestre;

  formularioJornadaLaboral: FormGroup = new FormGroup({});
  jornadasSemestre?: JornadaLaboral[]

  diasLaborables: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  disabled = false;
  inputType = 'number';
  isLoading = true;

  constructor(
    private servicioJornadaLaboral: JornadaLaboralService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
      this.crearFormulario();
  }

  private crearFormulario() {
    this.obtenerJornadasDelSemestre(this.semestre?.id);

    /* Cuando el semestre cuenta con horas y días laborables */
    if (this.jornadasSemestre?.length) {
      const jornada = this.jornadasSemestre[0];
      const dias = this.jornadasSemestre.map(jornada => jornada.dia)
      this.formularioJornadaLaboral = this.fb.group({
        horaInicio: [jornada.horaInicio, [Validators.required]],
        horaFin: [jornada.horaFin, [Validators.required]],
        horaAlmuerzo: [jornada.horaAlmuerzo, Validators.required],
        dias: [dias, [Validators.required]],
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
  }

  private obtenerJornadasDelSemestre(idSemestre?: string) {
    if (idSemestre) {
      this.servicioJornadaLaboral.obtenerJornadaLaboralPorSemestre(idSemestre).subscribe(
        resp => {
          this.isLoading = false;
          this.jornadasSemestre = resp;
          this.crearFormulario();
        }
      )
    }
  }

  crearJornadaLaboral() {

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
                _ => {
                  this.obtenerJornadasDelSemestre(this.semestre?.id);
                  this.crearFormulario();
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
}