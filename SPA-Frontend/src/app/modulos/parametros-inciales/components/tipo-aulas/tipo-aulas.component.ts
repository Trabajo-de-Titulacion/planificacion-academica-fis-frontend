import { DataSource } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import Semestre from '../../models/semestre.interface';
import TipoAula from '../../models/tipo-aula.interface';



const DATA: TipoAula[] = [
  {tipo: 'Aula regular', facultad: 'Facultad de Ingeniería de Sistemas'},
  {tipo: 'Laboratorio', facultad: 'Facultad de Ingeniería de Sistemas'},
];


@Component({
  selector: 'app-tipo-aulas',
  templateUrl: './tipo-aulas.component.html',
  styleUrls: ['./tipo-aulas.component.scss', '../../styles/common.scss']
})
export class TipoAulasComponent implements OnInit {

  @Input() semestre? : Semestre;

  constructor() { }

  displayedColumns: string[] = ['Tipo de aula', 'Facultad', 'Acciones'];
  dataSource = DATA;

  ngOnInit(): void {
  }

}
