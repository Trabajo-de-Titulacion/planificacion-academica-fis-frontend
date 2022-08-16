import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DISPONIBILIDAD, HoraSemana } from '../../modelos/horaSemana.interface';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-horas-no-disponibles',
  templateUrl: './modificar-horas-no-disponibles.component.html',
  styleUrls: ['./modificar-horas-no-disponibles.component.scss']
})
export class ModificarHorasNoDisponiblesComponent implements OnInit {

  constructor() { }

  columnasTabla: string[] = ['HORA'];
  jornadasLaborales?: any[];
  datoFilasTabla = new MatTableDataSource<HoraSemana>([]);
  
  formGroup: FormGroup = new FormGroup({});
  controles: FormControl[] = [];


  ngOnInit(): void {
    this.cargarJornadasLaborales();
  }

  cargarJornadasLaborales() {
    // TODO: Recibir jornada laboral de semestre activo
    // TODO: Para esto crear un metodo en el servicio de semestre...
    // que devuelva solo la jornada del semestre en curso desde backend

    Swal.showLoading();

    // Se obtienen las jornadas laborales
    this.jornadasLaborales = [
      { dia: 'VIERNES', horaInicio: '07:00', horaAlmuerzo: '13:00', horaFin: '21:00' },
      { dia: 'LUNES', horaInicio: '09:00', horaAlmuerzo: '13:00', horaFin: '21:00' },
      { dia: 'MIÉRCOLES', horaInicio: '07:00', horaAlmuerzo: '14:00', horaFin: '13:00' },
    ]

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
    // TODO: Llamar al servicio y setear controles como true

    // TODO: Complete: Swal.close()
    Swal.close();
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
          return 'ALMUERZO';
        }
        // Crear control (checkbox) cuando la hora está disponible
        const control = new FormControl({ value: false, disabled: false });
        const nombreControl = this.obtenerNombreControl(dia, hora);
        this.formGroup.setControl(nombreControl, control);
        this.controles.push(control);
        return 'DISPONIBLE';
      }
    }
    return 'NO_DISPONIBLE';
  }

  obtenerNombreControl(dia: string, hora: number): string {
    return `${dia}-${hora}-${hora + 1}`;
  }

  desmarcarTodo() {
    if (this.controles.length > 0) {
      this.controles.forEach(control => {
        control.setValue(false);
      });
    }
  }
}
