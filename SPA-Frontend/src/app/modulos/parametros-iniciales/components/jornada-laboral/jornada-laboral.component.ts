import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { JornadaLaboralApiService } from '../../services/jornada-laboral-api.service';
import JornadaLaboral from '../../models/jornada-laboral.interface';
import { lastValueFrom } from 'rxjs';
import { SemestreService } from '../../services/semestre-api.service';
import Semestre from '../../models/semestre.interface';

@Component({
  selector: 'app-jornada-laboral',
  templateUrl: './jornada-laboral.component.html',
  styleUrls: ['./jornada-laboral.component.scss', '../../styles/common.scss']
})
export class JornadaLaboralComponent implements OnInit {

  diasLaborables: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  disabled = false;
  formularioJornadaLaboral: FormGroup = new FormGroup({});
  jornadasSemestre?: JornadaLaboral[]
  horasAlmuerzo = ["12:00", "13:00", "14:00"]
  inputsDisabled = true;
  inputType = 'number';
  intervalosHoras = this.crearIntervalos(5, 23);
  isLoading = true;

  semestres: Semestre[] = []
  semestreSeleccionado?: Semestre

  constructor(
    private fb: FormBuilder,
    private servicioSemestre: SemestreService,
    private servicioJornadaLaboral: JornadaLaboralApiService,
  ) { }

  async ngOnInit() {
    this.servicioSemestre.obtenerSemestres().subscribe(
      data => {
        this.semestres = data;
        this.isLoading = false;
      }
    )
  }

  private async crearFormulario() {
    this.inputsDisabled = true;
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
    /* Cuando el semestre no cuenta con horas y días laborables */
    else {
      this.inputsDisabled = false;
      this.formularioJornadaLaboral = this.fb.group({
        horaInicio: [{ value: '', disabled: this.inputsDisabled }, [Validators.required]],
        horaFin: [{ value: '', disabled: this.inputsDisabled }, [Validators.required]],
        horaAlmuerzo: [{ value: '', disabled: this.inputsDisabled }, [Validators.required]],
        dias: [{ value: [], disabled: this.inputsDisabled }, [Validators.required]],
      });
    }
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
    const idSemestre = this.semestreSeleccionado?.id;

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
                {
                  next: async () => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Registro exitoso',
                      text: `Se ha creado correctamente la jornada laboral del semestre ${this.semestreSeleccionado?.abreviatura}`
                    })
                    this.isLoading = true;
                    await this.obtenerJornadasDelSemestre(this.semestreSeleccionado?.id);
                    await this.crearFormulario();
                  }
                }
              );
            });
            while(this.jornadasSemestre?.length !== dias.length){
              await this.obtenerJornadasDelSemestre(this.semestreSeleccionado?.id);
            }
            await this.crearFormulario();
            this.isLoading = false;
          } else {

            Swal.fire({
              icon: 'error',
              title: 'Seleccione los días para la jornada laboral',
              text: 'La hora de almuerzo no debe ser cercana a la hora de inicio o la hora final de la jornada.',
            })
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente la hora final',
            text: 'La hora de fin no debe ser menor a la hora de inicio de la jornada.',
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

  eliminarJornada() {
    Swal.fire({
      title: `¿Está seguro de eliminar la jornada laboral del semestre ${this.semestreSeleccionado?.abreviatura}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioJornadaLaboral.eliminarJornadaLaboral(this.semestreSeleccionado!!.id).subscribe(
          {
            complete: async () => {
              Swal.fire({
                icon: 'success',
                title: 'Jornada laboral eliminada correctamente',
                text: `Se ha eliminado la jornada laboral del semestre ${this.semestreSeleccionado?.abreviatura}.`,
              })
              await this.obtenerJornadasDelSemestre(this.semestreSeleccionado?.id);
              this.formularioJornadaLaboral.reset();
              this.formularioJornadaLaboral.enable();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: `No se ha podido elminar la jornada laboral del semestre ${this.semestreSeleccionado?.abreviatura}`,
              })
            }
          }
        )
      } else if (result.isDenied) {
      }
    })

  }

  async seleccionarSemestre() {
    this.isLoading = true;
    await this.obtenerJornadasDelSemestre(this.semestreSeleccionado?.id);
    await this.crearFormulario();
    this.isLoading = false;
  }

  private async obtenerJornadasDelSemestre(idSemestre?: string) {
    if (idSemestre) {
      this.jornadasSemestre = await lastValueFrom(this.servicioJornadaLaboral.obtenerJornadaLaboralPorSemestre(idSemestre));
    }
  }
}