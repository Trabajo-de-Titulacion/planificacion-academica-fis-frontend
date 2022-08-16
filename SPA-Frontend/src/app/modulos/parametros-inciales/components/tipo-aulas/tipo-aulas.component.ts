import { DataSource } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import Semestre from '../../models/semestre.interface';
import TipoAula from '../../models/tipo-aula.interface';
import { TiposAulasApiService } from '../../services/tipos-aulas-api.service';
import { CrearTipoAulaDialogComponent } from './crear-tipo-aula-dialog/crear-tipo-aula-dialog.component';



const DATA: TipoAula[] = [
  {tipo: 'Aula regular', facultad: { nombre: 'Facultad de Ingeniería de Sistemas'}},
  {tipo: 'Laboratorio', facultad: { nombre: 'Facultad de Ingeniería de Sistemas' }},
];


@Component({
  selector: 'app-tipo-aulas',
  templateUrl: './tipo-aulas.component.html',
  styleUrls: ['./tipo-aulas.component.scss', '../../styles/common.scss']
})
export class TipoAulasComponent implements OnInit {

  @Input() semestre? : Semestre;

  constructor(
    private servicioTiposAulas : TiposAulasApiService,
    public dialog: MatDialog

  ) { }

  displayedColumns: string[] = ['Tipo de aula', 'Facultad', 'Acciones'];
  dataSource : TipoAula[] = []

  ngOnInit(): void {
    this.servicioTiposAulas.obtenerTipoAulas().subscribe(
      resp  => {
        this.dataSource = resp;
        console.log('*-*-*-*-*-*---> ', resp);
      }
    )
  }

  abrirCrearTipoAulaDialog(){
    const dialogRef = this.dialog.open(CrearTipoAulaDialogComponent, {
      width: '450px',
      data: {}
    })

    dialogRef.afterClosed().subscribe( result => {
      console.log('The dialog was closed');

    })
  }

}
