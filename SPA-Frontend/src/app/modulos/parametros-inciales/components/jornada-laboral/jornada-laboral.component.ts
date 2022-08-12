import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jornada-laboral',
  templateUrl: './jornada-laboral.component.html',
  styleUrls: ['./jornada-laboral.component.scss', '../../styles/common.scss']
})
export class JornadaLaboralComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  diasLaborables: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  inputType = 'number';
  disabled = false;

}
